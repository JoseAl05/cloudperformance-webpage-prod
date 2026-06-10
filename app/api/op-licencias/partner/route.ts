import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { authorizeRequest } from '@/lib/authUtils';

export async function GET(req: NextRequest) {
  const auth = await authorizeRequest(req, ['admin_global']);
  if (!auth.authorized) {
    return NextResponse.json({ message: auth.message }, { status: auth.status });
  }

  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.trim();

    if (!q || q.length < 2) {
      return NextResponse.json(
        { message: 'Ingresa al menos 2 caracteres para buscar.' },
        { status: 400 }
      );
    }

    const regex = new RegExp(q, 'i');

    const colLic = await getCollection('op_licencias');
    const colSol = await getCollection('op_solicitudes');

    // ── Buscar en licencias primero ───────────────────────────────────────────
    const ultimaLicencia = await colLic.findOne(
      { $or: [{ partner: regex }, { rut: regex }] },
      { sort: { generado_at: -1 } }
    );

    // ── Si no tiene licencia, buscar en solicitudes ────────────────────────────
    const solicitudRef = ultimaLicencia
      ? null
      : await colSol.findOne(
          { $or: [{ partner: regex }, { rut: regex }] },
          { sort: { createdAt: -1 } }
        );

    if (!ultimaLicencia && !solicitudRef) {
      return NextResponse.json(
        { message: 'No se encontró ningún partner con ese nombre o RUT.' },
        { status: 404 }
      );
    }

    // ── Datos base del partner ────────────────────────────────────────────────
    const partnerNombre   = ultimaLicencia?.partner   || solicitudRef?.partner;
    const partnerRut      = ultimaLicencia?.rut        || solicitudRef?.rut;
    const partnerFp       = ultimaLicencia?.fingerprint || solicitudRef?.fingerprint;

    // ── Solicitudes pendientes ────────────────────────────────────────────────
    const solicitudesPendientes = await colSol
      .find({ partner: partnerNombre, rut: partnerRut, estado: 'pendiente' })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      partner:                partnerNombre,
      rut:                    partnerRut,
      fingerprint:            partnerFp,
      ultima_licencia_id:     ultimaLicencia ? String(ultimaLicencia._id) : null,
      ultima_licencia_at:     ultimaLicencia?.generado_at || null,
      generado_por:           ultimaLicencia?.generado_por || null,
      compute_units:          ultimaLicencia?.compute_units || [],
      solicitudes_pendientes: solicitudesPendientes,
    });

  } catch (error) {
    console.error('[OP-PARTNER] Error al buscar partner:', error);
    return NextResponse.json({ message: 'Error interno.' }, { status: 500 });
  }
}