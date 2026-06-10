import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { authorizeRequest } from '@/lib/authUtils';

// ── Helpers ───────────────────────────────────────────────────────────────────

function calcularEstadoUC(uc: {
  type: string;
  expires: string | null;
}): 'activa' | 'por_vencer' | 'vencida' | 'perpetua' {
  if (uc.type === 'perpetual' || !uc.expires) return 'perpetua';
  const dias = Math.ceil((new Date(uc.expires).getTime() - Date.now()) / 86400000);
  if (dias < 0)   return 'vencida';
  if (dias <= 30) return 'por_vencer';
  return 'activa';
}

// ── GET — Estado actual de todos los partners ─────────────────────────────────

export async function GET(req: NextRequest) {
  const auth = await authorizeRequest(req, ['admin_global']);
  if (!auth.authorized) {
    return NextResponse.json({ message: auth.message }, { status: auth.status });
  }

  try {
    const colLic = await getCollection('op_licencias');
    const colSol = await getCollection('op_solicitudes');

    // ── Última licencia por partner ───────────────────────────────────────────
    const ultimasPorPartner = await colLic.aggregate([
      { $sort: { generado_at: -1 } },
      {
        $group: {
          _id:             '$rut',
          partner:         { $first: '$partner' },
          rut:             { $first: '$rut' },
          fingerprint:     { $first: '$fingerprint' },
          generado_at:     { $first: '$generado_at' },
          generado_por:    { $first: '$generado_por' },
          compute_units:   { $first: '$compute_units' },
          licencia_id:     { $first: '$_id' },
        },
      },
      { $sort: { partner: 1 } },
    ]).toArray();

    // ── Partners con solicitud pendiente sin licencia ─────────────────────────
    const rutConLicencia = new Set(ultimasPorPartner.map(p => p.rut));
    const solicitudesSinLic = await colSol
      .find({ estado: 'pendiente' })
      .sort({ createdAt: -1 })
      .toArray();

    const sinLicencia = solicitudesSinLic
      .filter(s => !rutConLicencia.has(s.rut))
      .reduce((acc, s) => {
        if (!acc.find((x: {rut: string}) => x.rut === s.rut)) {
          acc.push({
            _id:           s.rut,
            partner:       s.partner,
            rut:           s.rut,
            fingerprint:   s.fingerprint,
            generado_at:   null,
            generado_por:  null,
            compute_units: [],
            licencia_id:   null,
            sin_licencia:  true,
            solicitud_id:  String(s._id),
          });
        }
        return acc;
      }, [] as object[]);

    // ── Calcular resumen por partner ──────────────────────────────────────────
    const resultado = [
      ...ultimasPorPartner.map(p => {
        const ucs = (p.compute_units || []).map((uc: {
          type: string;
          expires: string | null;
          cloud: string;
          db: string;
          alias: string;
          cliente: string;
        }) => ({
          ...uc,
          estado: calcularEstadoUC(uc),
        }));

        return {
          partner:      p.partner,
          rut:          p.rut,
          fingerprint:  p.fingerprint,
          generado_at:  p.generado_at,
          generado_por: p.generado_por,
          licencia_id:  String(p.licencia_id),
          sin_licencia: false,
          compute_units: ucs,
          resumen: {
            total:      ucs.length,
            activas:    ucs.filter((u: {estado: string}) => u.estado === 'activa').length,
            por_vencer: ucs.filter((u: {estado: string}) => u.estado === 'por_vencer').length,
            vencidas:   ucs.filter((u: {estado: string}) => u.estado === 'vencida').length,
            perpetuas:  ucs.filter((u: {estado: string}) => u.estado === 'perpetua').length,
          },
        };
      }),
      ...sinLicencia,
    ];

    return NextResponse.json(resultado);

  } catch (error) {
    console.error('[OP-ESTADO] Error:', error);
    return NextResponse.json({ message: 'Error interno.' }, { status: 500 });
  }
}