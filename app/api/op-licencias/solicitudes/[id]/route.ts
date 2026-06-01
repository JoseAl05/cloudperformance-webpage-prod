import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { authorizeRequest } from '@/lib/authUtils';
import { ObjectId } from 'mongodb';

// ── PUT — Actualizar estado ───────────────────────────────────────────────────
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await authorizeRequest(req, ['admin_global']);
  if (!auth.authorized) {
    return NextResponse.json({ message: auth.message }, { status: auth.status });
  }

  try {
    const { estado } = await req.json();
    const col = await getCollection('op_solicitudes');

    await col.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { estado, updatedAt: new Date() } }
    );

    return NextResponse.json({ message: 'Estado actualizado.' }, { status: 200 });
  } catch (error) {
    console.error('Error al actualizar solicitud:', error);
    return NextResponse.json({ message: 'Error interno.' }, { status: 500 });
  }
}

// ── DELETE — Eliminar solicitud ───────────────────────────────────────────────
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await authorizeRequest(req, ['admin_global']);
  if (!auth.authorized) {
    return NextResponse.json({ message: auth.message }, { status: auth.status });
  }

  try {
    const col = await getCollection('op_solicitudes');

    await col.deleteOne({ _id: new ObjectId(params.id) });

    return NextResponse.json({ message: 'Solicitud eliminada.' }, { status: 200 });
  } catch (error) {
    console.error('Error al eliminar solicitud:', error);
    return NextResponse.json({ message: 'Error interno.' }, { status: 500 });
  }
}