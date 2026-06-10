import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { authorizeRequest } from '@/lib/authUtils';

// ── GET — Buscar empresa en padrón SII ────────────────────────────────────────
// ?rut=76021154-0  → búsqueda exacta por RUT
// ?q=bracace       → búsqueda por nombre, devuelve top 10

export async function GET(req: NextRequest) {
  const auth = await authorizeRequest(req, ['admin_global']);
  if (!auth.authorized) {
    return NextResponse.json({ message: auth.message }, { status: auth.status });
  }

  try {
    const { searchParams } = new URL(req.url);
    const rut = searchParams.get('rut')?.trim();
    const q   = searchParams.get('q')?.trim();

    if (!rut && !q) {
      return NextResponse.json(
        { message: 'Debes enviar ?rut= o ?q=' },
        { status: 400 }
      );
    }

    const col = await getCollection('empresas_sii');

    // ── Búsqueda exacta por RUT ───────────────────────────────────────────────
    if (rut) {
      const empresa = await col.findOne({ rut });
      if (!empresa) {
        return NextResponse.json(
          { message: `RUT ${rut} no encontrado en el padrón SII.` },
          { status: 404 }
        );
      }
      return NextResponse.json({
        rut:          empresa.rut,
        razonSocial:  empresa.razonSocial,
      });
    }

    // ── Búsqueda por nombre — top 10 ──────────────────────────────────────────
    if (q) {
      if (q.length < 3) {
        return NextResponse.json(
          { message: 'Ingresa al menos 3 caracteres para buscar.' },
          { status: 400 }
        );
      }

      const regex = new RegExp(q, 'i');
      const empresas = await col
        .find({ razonSocial: regex })
        .limit(10)
        .project({ rut: 1, razonSocial: 1, _id: 0 })
        .toArray();

      return NextResponse.json(empresas);
    }

  } catch (error) {
    console.error('[EMPRESAS-SII] Error:', error);
    return NextResponse.json({ message: 'Error interno.' }, { status: 500 });
  }
}