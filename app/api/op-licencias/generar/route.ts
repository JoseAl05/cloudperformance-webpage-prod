import { NextResponse } from 'next/server';
import { getAuthFromRequest } from '@/lib/auth';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import crypto from 'crypto';

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface ComputeUnitInput {
  cloud: 'aws' | 'azure' | 'gcp';
  db: string;
  rut: string;
  cliente: string;
  alias: string;
  type: 'subscription' | 'perpetual';
  starts: string;
  expires: string | null;
}

interface GenerarLicenciaBody {
  partner: string;
  rut: string;
  solicitante: string;
  fingerprint: string;
  compute_units: ComputeUnitInput[];
  solicitudes_ids?: string[]; // IDs de solicitudes pendientes que se están procesando
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcularUcFp(
  rutPartner: string,
  partner: string,
  rutCliente: string,
  cliente: string,
  db: string
): string {
  return crypto
    .createHash('sha256')
    .update(`${rutPartner}|${partner}|${rutCliente}|${cliente}|${db}`)
    .digest('hex');
}

function firmarRSA(data: string, privateKeyPem: string): string {
  const sig = crypto.sign(
    'sha256',
    Buffer.from(data, 'utf-8'),
    { key: privateKeyPem, padding: crypto.constants.RSA_PKCS1_PADDING }
  );
  return sig.toString('base64');
}

function calcularHash(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex');
}

function obtenerClavePrivada(): string | null {
  const raw = process.env.INTAC_PRIVATE_KEY;
  if (!raw) return null;
  // Normalizar saltos de línea en caso de que vengan como \n literal
  return raw.replace(/\\n/g, '\n');
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {

    // ── 1. Validar sesión y rol ───────────────────────────────────────────────
    const session = await getAuthFromRequest(req as never);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    const sessionTyped = session as unknown as { role: string; email: string };
    if (sessionTyped.role !== 'admin_global') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    // ── 2. Leer y validar body ────────────────────────────────────────────────
    const body: GenerarLicenciaBody = await req.json();
    const { partner, rut, solicitante, fingerprint, compute_units, solicitudes_ids } = body;

    if (!partner || !rut || !solicitante || !fingerprint) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios: partner, rut, solicitante, fingerprint' },
        { status: 400 }
      );
    }

    if (!compute_units || compute_units.length === 0) {
      return NextResponse.json(
        { error: 'Debes incluir al menos una unidad de cómputo' },
        { status: 400 }
      );
    }

    for (const uc of compute_units) {
      if (!uc.cloud || !uc.db || !uc.rut || !uc.cliente || !uc.alias || !uc.type || !uc.starts) {
        return NextResponse.json(
          { error: `UC incompleta: ${JSON.stringify(uc)}` },
          { status: 400 }
        );
      }
      if (uc.type === 'subscription' && !uc.expires) {
        return NextResponse.json(
          { error: `UC de suscripción sin fecha de vencimiento: ${uc.alias}` },
          { status: 400 }
        );
      }
    }

    // ── 3. Obtener clave privada ──────────────────────────────────────────────
    const privateKey = obtenerClavePrivada();
    if (!privateKey) {
      return NextResponse.json(
        { error: 'INTAC_PRIVATE_KEY no configurada en el servidor' },
        { status: 500 }
      );
    }

    // ── 4. Construir compute_units con uc_fp ──────────────────────────────────
    const ucConFp = compute_units.map(uc => ({
      cloud:    uc.cloud,
      db:       uc.db,
      rut:      uc.rut,
      cliente:  uc.cliente,
      alias:    uc.alias,
      type:     uc.type,
      starts:   uc.starts,
      expires:  uc.expires,
      uc_fp:    calcularUcFp(rut, partner, uc.rut, uc.cliente, uc.db),
    }));

    // ── 5. Construir payload del .lic ─────────────────────────────────────────
    const payload = {
      partner,
      rut,
      solicitante,
      fingerprint,
      generated: new Date().toISOString(),
      version: '2.0',
      compute_units: ucConFp,
    };

    const payloadStr = JSON.stringify(payload);

    // ── 6. Firmar con RSA ─────────────────────────────────────────────────────
    let sig: string;
    try {
      sig = firmarRSA(payloadStr, privateKey);
    } catch (e) {
      console.error('[OP-LICENCIAS] Error firmando con RSA:', e);
      return NextResponse.json(
        { error: 'Error al firmar la licencia — verifica INTAC_PRIVATE_KEY' },
        { status: 500 }
      );
    }

    // ── 7. Codificar en Base64 ────────────────────────────────────────────────
    const fullContent = { data: payloadStr, sig };
    const licContent  = Buffer.from(
      unescape(encodeURIComponent(JSON.stringify(fullContent)))
    ).toString('base64');
    const licHash = calcularHash(licContent);

    // ── 8. Guardar en op_licencias ────────────────────────────────────────────
    const col = await getCollection('op_licencias');
    await col.insertOne({
      partner,
      rut,
      solicitante,
      fingerprint,
      generado_por: sessionTyped.email,
      generado_at:  new Date().toISOString(),
      version:      '2.0',
      compute_units: ucConFp,
      lic_content:  licContent,
      lic_hash:     licHash,
      createdAt:    new Date(),
    });

    // ── 8b. Marcar solicitudes pendientes como procesadas ────────────────────
    if (solicitudes_ids && solicitudes_ids.length > 0) {
      const colSol = await getCollection('op_solicitudes');
      await colSol.updateMany(
        { _id: { $in: solicitudes_ids.map(id => new ObjectId(id)) } },
        {
          $set: {
            estado:        'procesada',
            procesada_por: sessionTyped.email,
            procesada_at:  new Date().toISOString(),
            updatedAt:     new Date(),
          }
        }
      );
    }

    // ── 9. Responder ──────────────────────────────────────────────────────────
    return NextResponse.json({
      ok:           true,
      lic_content:  licContent,
      partner,
      rut,
      compute_units: ucConFp,
      generado_at:  payload.generated,
    });

  } catch (err) {
    console.error('[OP-LICENCIAS] Error inesperado:', err);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}