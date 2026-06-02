import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { authorizeRequest } from '@/lib/authUtils';

export async function GET(req: NextRequest) {
  const auth = await authorizeRequest(req, ['admin_global']);
  if (!auth.authorized) {
    return NextResponse.json({ message: auth.message }, { status: auth.status });
  }

  try {
    const col = await getCollection('op_licencias');
    const licencias = await col
      .find({})
      .sort({ generado_at: -1 })
      .toArray();

    return NextResponse.json(licencias, { status: 200 });
  } catch (error) {
    console.error('Error al obtener historial:', error);
    return NextResponse.json({ message: 'Error interno.' }, { status: 500 });
  }
}