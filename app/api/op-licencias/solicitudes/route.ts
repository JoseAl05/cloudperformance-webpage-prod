import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { authorizeRequest } from '@/lib/authUtils';

// ── Tipos ─────────────────────────────────────────────────────────────────────

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

// ── GET — Listar solicitudes ──────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const auth = await authorizeRequest(req, ['admin_global']);
  if (!auth.authorized) {
    return NextResponse.json({ message: auth.message }, { status: auth.status });
  }

  try {
    const col = await getCollection('op_solicitudes');
    const solicitudes = await col
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(solicitudes, { status: 200 });
  } catch (error) {
    console.error('[OP-SOLICITUDES] Error al listar:', error);
    return NextResponse.json({ message: 'Error interno.' }, { status: 500 });
  }
}

// ── POST — Guardar solicitud ──────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const auth = await authorizeRequest(req, ['admin_global']);
  if (!auth.authorized) {
    return NextResponse.json({ message: auth.message }, { status: auth.status });
  }

  try {
    const body = await req.json();
    const { partner, rut, solicitante, fingerprint, fecha_solicitud, compute_units } = body;

    // ── Validaciones ──────────────────────────────────────────────────────────
    if (!partner || !rut || !fingerprint) {
      return NextResponse.json(
        { message: 'Faltan campos obligatorios: partner, rut, fingerprint.' },
        { status: 400 }
      );
    }

    if (!Array.isArray(compute_units) || compute_units.length === 0) {
      return NextResponse.json(
        { message: 'Debes incluir al menos una unidad de cómputo.' },
        { status: 400 }
      );
    }

    for (const uc of compute_units as ComputeUnitInput[]) {
      if (!uc.cloud || !uc.db || !uc.rut || !uc.cliente || !uc.alias || !uc.type || !uc.starts) {
        return NextResponse.json(
          { message: `UC incompleta: ${uc.alias || uc.db}` },
          { status: 400 }
        );
      }
      if (uc.type === 'subscription' && !uc.expires) {
        return NextResponse.json(
          { message: `UC de suscripción sin fecha de vencimiento: ${uc.alias}` },
          { status: 400 }
        );
      }
    }

    // ── Verificar si ya existe solicitud pendiente para este partner ──────────
    const col = await getCollection('op_solicitudes');
    const existente = await col.findOne({ partner, rut, estado: 'pendiente' });

    if (existente) {
      return NextResponse.json(
        {
          message: `Ya existe una solicitud pendiente para ${partner} (${rut}). ` +
                   `Procésala antes de crear una nueva.`,
        },
        { status: 409 }
      );
    }

    // ── Insertar ──────────────────────────────────────────────────────────────
    const nueva = {
      partner,
      rut,
      solicitante:     solicitante || '—',
      fingerprint,
      fecha_solicitud: fecha_solicitud || new Date().toISOString(),
      compute_units,
      estado:          'pendiente',
      procesada_por:   null,
      procesada_at:    null,
      createdAt:       new Date(),
      updatedAt:       new Date(),
    };

    const result = await col.insertOne(nueva);

    return NextResponse.json(
      { message: 'Solicitud guardada correctamente.', id: result.insertedId },
      { status: 201 }
    );

  } catch (error) {
    console.error('[OP-SOLICITUDES] Error al guardar:', error);
    return NextResponse.json({ message: 'Error interno.' }, { status: 500 });
  }
}