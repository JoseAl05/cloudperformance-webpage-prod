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
  fingerprint_cliente?: string | null;
}

interface GenerarLicenciaBody {
  partner: string;
  rut: string;
  solicitante: string;
  fingerprint: string;
  compute_units: ComputeUnitInput[];
  solicitudes_ids?: string[];
}

// Resultado de un .lic generado
interface LicGenerado {
  tipo: 'subscription' | 'perpetual';
  nombre: string;       // nombre descriptivo para el archivo
  cliente: string;      // a quién pertenece
  rut_cliente: string;
  lic_content: string;
  lic_hash: string;
  compute_units: object[];
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
  return raw.replace(/\\n/g, '\n');
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 20);
}

function generarLicContent(payload: object, privateKey: string): { licContent: string; licHash: string; sig: string } {
  const payloadStr = JSON.stringify(payload);
  const sig        = firmarRSA(payloadStr, privateKey);
  const fullContent = { data: payloadStr, sig };
  const licContent  = Buffer.from(
    unescape(encodeURIComponent(JSON.stringify(fullContent)))
  ).toString('base64');
  const licHash = calcularHash(licContent);
  return { licContent, licHash, sig };
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
      if (uc.type === 'perpetual' && !uc.fingerprint_cliente) {
        return NextResponse.json(
          { error: `UC perpetua sin fingerprint_cliente: ${uc.alias}` },
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

    const generado_at = new Date().toISOString();
    const licsGenerados: LicGenerado[] = [];
    const col = await getCollection('op_licencias');

    // ── 4. Separar UCs por tipo ───────────────────────────────────────────────
    const ucsSubscription = compute_units.filter(uc => uc.type === 'subscription');
    const ucsPerpetual    = compute_units.filter(uc => uc.type === 'perpetual');

    // Agrupar perpetuos por cliente (rut)
    const perpetuosPorCliente = new Map<string, ComputeUnitInput[]>();
    for (const uc of ucsPerpetual) {
      const key = uc.rut;
      if (!perpetuosPorCliente.has(key)) perpetuosPorCliente.set(key, []);
      perpetuosPorCliente.get(key)!.push(uc);
    }

    // ── 5. Generar .lic de suscripciones (si hay) ─────────────────────────────
    if (ucsSubscription.length > 0) {
      const ucConFp = ucsSubscription.map(uc => ({
        cloud:   uc.cloud,
        db:      uc.db,
        rut:     uc.rut,
        cliente: uc.cliente,
        alias:   uc.alias,
        type:    uc.type,
        starts:  uc.starts,
        expires: uc.expires,
        uc_fp:   calcularUcFp(rut, partner, uc.rut, uc.cliente, uc.db),
      }));

      const payload = {
        partner, rut, solicitante, fingerprint,
        generated: generado_at, version: '2.0',
        compute_units: ucConFp,
      };

      const { licContent, licHash } = generarLicContent(payload, privateKey);

      await col.insertOne({
        partner, rut, solicitante, fingerprint,
        tipo_lic: 'subscription',
        generado_por: sessionTyped.email,
        generado_at, version: '2.0',
        compute_units: ucConFp,
        lic_content: licContent,
        lic_hash: licHash,
        createdAt: new Date(),
      });
      
      //variables necesarias para construir nombre del archivo suscripción
      const fecha = generado_at.slice(0,10).replace(/-/g,'');
      const rutSlug = rut.replace(/[^0-9kK]/g,'');
      licsGenerados.push({
        tipo:        'subscription',
        // suscripción
        nombre: `solicitud-s-${fecha}-${rutSlug}.lic`,
        cliente:     partner,
        rut_cliente: rut,
        lic_content: licContent,
        lic_hash:    licHash,
        compute_units: ucConFp,
      });
    }

    // ── 6. Generar .lic por cada cliente perpetuo ─────────────────────────────
    for (const [rutCliente, ucs] of perpetuosPorCliente) {
      const primerUC     = ucs[0];
      const nombreCliente = primerUC.cliente;
      // El fingerprint del perpetuo viene de la UC
      const fpCliente    = primerUC.fingerprint_cliente!;

      const ucConFp = ucs.map(uc => ({
        cloud:   uc.cloud,
        db:      uc.db,
        rut:     uc.rut,
        cliente: uc.cliente,
        alias:   uc.alias,
        type:    uc.type,
        starts:  uc.starts,
        expires: uc.expires,
        uc_fp:   calcularUcFp(rut, partner, uc.rut, uc.cliente, uc.db),
      }));

      const payload = {
        partner:     nombreCliente,  // el cliente perpetuo es el "partner" de su propio .lic
        rut:         rutCliente,
        solicitante,
        fingerprint: fpCliente,      // fingerprint del servidor del cliente
        generated:   generado_at,
        version:     '2.0',
        compute_units: ucConFp,
      };

      const { licContent, licHash } = generarLicContent(payload, privateKey);

      await col.insertOne({
        partner:     nombreCliente,
        rut:         rutCliente,
        solicitante,
        fingerprint: fpCliente,
        tipo_lic:    'perpetual',
        generado_por: sessionTyped.email,
        generado_at, version: '2.0',
        compute_units: ucConFp,
        lic_content:  licContent,
        lic_hash:     licHash,
        createdAt:    new Date(),
      });
      //variables necesarias para construir nombre del archivo perpetuo
      const fecha = generado_at.slice(0,10).replace(/-/g,'');
      const rutClienteSlug = rutCliente.replace(/[^0-9kK]/g,'');      
      licsGenerados.push({
        tipo:        'perpetual',
        // perpetuo
        nombre: `solicitud-p-${fecha}-${rutClienteSlug}.lic`,
        cliente:     nombreCliente,
        rut_cliente: rutCliente,
        lic_content: licContent,
        lic_hash:    licHash,
        compute_units: ucConFp,
      });
    }

    // ── 7. Marcar solicitudes como procesadas ─────────────────────────────────
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

    // ── 8. Responder ──────────────────────────────────────────────────────────
    return NextResponse.json({
      ok:             true,
      lics:           licsGenerados,      // array de .lic generados
      total:          licsGenerados.length,
      partner,
      generado_at,
    });

  } catch (err) {
    console.error('[OP-LICENCIAS] Error inesperado:', err);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}