import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { authorizeRequest } from '@/lib/authUtils';

interface CSVUser {
  id: string;
  email: string;
  empresa: string;
  fecha_solicitud: string;
}

interface LicenciaUsuario {
  id: string;
  email: string;
  empresa: string;
  starts: string;
  expires: string;
}

interface OpLicencia {
  partner: string;
  usuarios: LicenciaUsuario[];
  generado_at: Date;
}

export async function POST(req: NextRequest) {
  const auth = await authorizeRequest(req, ['admin_global']);
  if (!auth.authorized) {
    return NextResponse.json({ message: auth.message }, { status: auth.status });
  }

  try {
    const { partner, users } = await req.json();

    if (!partner || !users?.length) {
      return NextResponse.json({ message: 'Faltan datos.' }, { status: 400 });
    }

    // Buscar el último .lic generado para este partner
    const col = await getCollection<OpLicencia>('op_licencias');
    const ultimaLicencia = await col
      .find({ partner })
      .sort({ generado_at: -1 })
      .limit(1)
      .toArray();

    const usuariosVigentes: LicenciaUsuario[] = ultimaLicencia[0]?.usuarios || [];

    const now = new Date();
    const treintaDias = 30 * 24 * 60 * 60 * 1000;

    // Calcular estado por usuario
    const resultado = users.map((u: CSVUser) => {
      const vigente = usuariosVigentes.find(v => v.id === u.id);

      if (!vigente) {
        return { ...u, estado: 'nuevo', diasRestantes: null };
      }

      const expires = new Date(vigente.expires);
      const diasRestantes = Math.ceil((expires.getTime() - now.getTime()) / 86400000);

      if (now > expires) {
        return { ...u, estado: 'vencida', diasRestantes: 0, expires: vigente.expires };
      }

      if (expires.getTime() - now.getTime() <= treintaDias) {
        return { ...u, estado: 'por_vencer', diasRestantes, expires: vigente.expires };
      }

      return { ...u, estado: 'vigente', diasRestantes, expires: vigente.expires };
    });

    // KPIs
    const kpis = {
      empresas:            new Set(users.map((u: CSVUser) => u.empresa)).size,
      usuariosNuevos:      resultado.filter((u: {estado: string}) => u.estado === 'nuevo').length,
      usuariosPorVencer:   resultado.filter((u: {estado: string}) => u.estado === 'por_vencer').length,
      usuariosVigentes:    resultado.filter((u: {estado: string}) => u.estado === 'vigente').length,
      usuariosVencidos:    resultado.filter((u: {estado: string}) => u.estado === 'vencida').length,
      licenciasAGenerar:   resultado.filter((u: {estado: string}) => u.estado !== 'vigente').length,
    };

    // Usuarios vigentes que deben incluirse automáticamente en el nuevo .lic
    const vigentesAutomaticos = usuariosVigentes.filter(v => {
      const expires = new Date(v.expires);
      const diasRestantes = Math.ceil((expires.getTime() - now.getTime()) / 86400000);
      return now < expires && diasRestantes > 30;
    });

    return NextResponse.json({
      usuarios:            resultado,
      kpis,
      vigentesAutomaticos,
      tieneHistorial:      usuariosVigentes.length > 0,
    }, { status: 200 });

  } catch (error) {
    console.error('Error al comparar:', error);
    return NextResponse.json({ message: 'Error interno.' }, { status: 500 });
  }
}