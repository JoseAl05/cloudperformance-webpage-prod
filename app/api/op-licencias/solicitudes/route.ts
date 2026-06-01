import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { authorizeRequest } from '@/lib/authUtils';

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
    console.error('Error al listar solicitudes:', error);
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
    const { partner, solicitante, fecha_solicitud, usuarios } = body;

    if (!partner || !usuarios?.length) {
      return NextResponse.json(
        { message: 'Faltan datos obligatorios.' },
        { status: 400 }
      );
    }

    const col = await getCollection('op_solicitudes');

    const nueva = {
      partner,
      solicitante,
      fecha_solicitud,
      usuarios,
      estado: 'pendiente',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await col.insertOne(nueva);

    return NextResponse.json(
      { message: 'Solicitud guardada.', id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al guardar solicitud:', error);
    return NextResponse.json({ message: 'Error interno.' }, { status: 500 });
  }
}