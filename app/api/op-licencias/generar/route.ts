import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { authorizeRequest } from '@/lib/authUtils';
import { ObjectId } from 'mongodb';

const SECRET_KEY = process.env.LIC_SECRET_KEY || 'INTAC-SECRET-KEY-2026-OFFLINE-LICENSE';
const SERVER_FP  = process.env.CP_SERVER_FINGERPRINT || 'CP-FP-DEMO-2026-INTAC-TEST-SERVER-001';

async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function toBase64(str: string): string {
  return Buffer.from(str).toString('base64');
}

export async function POST(req: NextRequest) {
  const auth = await authorizeRequest(req, ['admin_global']);
  if (!auth.authorized) {
    return NextResponse.json({ message: auth.message }, { status: auth.status });
  }

  try {
    const { solicitudesIds, partner, usuarios } = await req.json();

    if (!solicitudesIds?.length || !partner || !usuarios?.length) {
      return NextResponse.json({ message: 'Faltan datos.' }, { status: 400 });
    }

    const now     = new Date();
    const oneYear = new Date(now);
    oneYear.setFullYear(oneYear.getFullYear() + 1);

    // Construir usuarios del .lic
    const licUsers = usuarios.map((u: {
      id: string; email: string; starts?: string; expires?: string; estado: string;
    }) => ({
      id:      u.id,
      email:   u.email,
      starts:  u.starts  || now.toISOString().slice(0, 16),
      expires: u.expires || oneYear.toISOString().slice(0, 16),
    }));

    // Construir payload del .lic
    const payload = {
      partner,
      fingerprint: SERVER_FP,
      generated:   now.toISOString(),
      version:     '2.0',
      users:       licUsers,
    };

    const payloadStr = JSON.stringify(payload);
    const signature  = await sha256(`${payloadStr}|${SECRET_KEY}`);
    const licContent = toBase64(JSON.stringify({ data: payloadStr, sig: signature }));
    const licHash    = await sha256(licContent);

    // Guardar en op_licencias
    const licCol = await getCollection('op_licencias');
    await licCol.insertOne({
      partner,
      generado_por:   auth.user.email || auth.user.sub,
      generado_at:    now,
      solicitudes_ids: solicitudesIds.map((id: string) => new ObjectId(id)),
      usuarios:        licUsers,
      lic_hash:        licHash,
      lic_content:     licContent,
      version:         '2.0',
    });

    // Marcar TODAS las solicitudes como "generada"
    const solCol = await getCollection('op_solicitudes');
    await solCol.updateMany(
      { _id: { $in: solicitudesIds.map((id: string) => new ObjectId(id)) } },
      { $set: { estado: 'generada', updatedAt: now } }
    );

    return NextResponse.json({ licContent, licHash }, { status: 201 });

  } catch (error) {
    console.error('Error al generar licencia:', error);
    return NextResponse.json({ message: 'Error interno.' }, { status: 500 });
  }
}