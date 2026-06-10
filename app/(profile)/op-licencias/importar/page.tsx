'use client';

import React, { useState } from 'react';
import { useSession } from '@/hooks/useSession';
import { FileJson, ArrowLeft, Loader2, Building2, ShieldCheck, Cloud, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTableSingle } from '@/components/data-table/data-table-single';
import { createColumns } from '@/components/data-table/columns';
import Link from 'next/link';

// ── Tipos ─────────────────────────────────────────────────────────────────────

interface ComputeUnit {
  cloud: 'aws' | 'azure' | 'gcp';
  db: string;
  rut: string;
  cliente: string;
  alias: string;
  type: 'subscription' | 'perpetual';
  starts: string;
  expires: string | null;
}

interface SolicitudMeta {
  partner: string;
  rut: string;
  solicitante: string;
  fingerprint: string;
  fecha_solicitud: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function cloudBadge(cloud: string) {
  const map: Record<string, string> = {
    aws:   'bg-amber-500/10 text-amber-600 border-amber-200',
    azure: 'bg-blue-500/10 text-blue-600 border-blue-200',
    gcp:   'bg-green-500/10 text-green-600 border-green-200',
  };
  return (
    <Badge className={map[cloud] || 'bg-gray-500/10 text-gray-600'}>
      {cloud.toUpperCase()}
    </Badge>
  );
}

function typeBadge(type: string) {
  return type === 'perpetual'
    ? <Badge className="bg-purple-500/10 text-purple-600 border-purple-200">∞ Perpetua</Badge>
    : <Badge className="bg-blue-500/10 text-blue-600 border-blue-200">Suscripción</Badge>;
}

function formatFecha(fecha: string | null) {
  if (!fecha) return <span className="text-muted-foreground text-xs">∞ Perpetua</span>;
  return <span className="text-xs">{new Date(fecha).toLocaleDateString('es-CL')}</span>;
}

// ── Página ────────────────────────────────────────────────────────────────────

export default function ImportarPage() {
  const { user, isLoading } = useSession();

  const [dragging, setDragging]   = useState(false);
  const [meta, setMeta]           = useState<SolicitudMeta | null>(null);
  const [units, setUnits]         = useState<ComputeUnit[]>([]);
  const [processing, setProcessing] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError]         = useState('');
  const [fileName, setFileName]   = useState('');

  if (isLoading) return (
    <div className="flex items-center gap-2 p-8 text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" /> Cargando...
    </div>
  );

  if (!user || user.role !== 'admin_global') {
    return <div className="p-4 bg-red-100 text-red-700 rounded">Acceso denegado.</div>;
  }

  const hasDatos = units.length > 0;

  // ── KPIs ──────────────────────────────────────────────────────────────────
  const totalUCs        = units.length;
  const totalClientes   = new Set(units.map(u => u.rut)).size;
  const totalSubs       = units.filter(u => u.type === 'subscription').length;
  const totalPerpetuos  = units.filter(u => u.type === 'perpetual').length;

  // ── Parsear JSON ──────────────────────────────────────────────────────────
  async function processFile(file: File) {
    if (!file.name.endsWith('.json')) {
      setError('El archivo debe ser .json');
      return;
    }

    setProcessing(true);
    setError('');
    setFileName(file.name);
    setMeta(null);
    setUnits([]);

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      // Validar estructura mínima
      if (!json.partner || !json.rut || !json.fingerprint || !Array.isArray(json.compute_units)) {
        setError('El archivo no tiene el formato correcto. Debe ser generado desde CP OnPremises.');
        return;
      }

      if (json.compute_units.length === 0) {
        setError('El archivo no contiene unidades de cómputo.');
        return;
      }

      setMeta({
        partner:         json.partner,
        rut:             json.rut,
        solicitante:     json.solicitante || '—',
        fingerprint:     json.fingerprint,
        fecha_solicitud: json.fecha_solicitud || new Date().toISOString(),
      });

      setUnits(json.compute_units);

    } catch {
      setError('Error al leer el archivo. Verifica que sea un JSON válido.');
    } finally {
      setProcessing(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }

  // ── Guardar solicitud ─────────────────────────────────────────────────────
  async function handleGuardar(generarAhora: boolean) {
    if (!meta) return;
    setGuardando(true);
    setError('');

    try {
      const res = await fetch('/api/op-licencias/solicitudes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          partner:         meta.partner,
          rut:             meta.rut,
          solicitante:     meta.solicitante,
          fingerprint:     meta.fingerprint,
          fecha_solicitud: meta.fecha_solicitud,
          compute_units:   units,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        if (generarAhora) {
          window.location.href = `/op-licencias/partner?solicitud=${data.id}&partner=${encodeURIComponent(meta.partner)}`;
        } else {
          window.location.href = '/op-licencias';
        }
      } else {
        setError(`Error al guardar: ${data.message}`);
      }
    } catch {
      setError('Error de conexión.');
    } finally {
      setGuardando(false);
    }
  }

  // ── Columnas tabla UCs ────────────────────────────────────────────────────
  const tablaColumns = createColumns<ComputeUnit>([
    {
      header: 'Nube',
      accessorKey: 'cloud',
      size: 90,
      cell: (info) => cloudBadge((info as { getValue: () => string }).getValue()),
    },
    {
      header: 'Cliente',
      accessorKey: 'cliente',
      size: 180,
    },
    {
      header: 'RUT Cliente',
      accessorKey: 'rut',
      size: 130,
    },
    {
      header: 'Alias',
      accessorKey: 'alias',
      size: 180,
    },
    {
      header: 'DB',
      accessorKey: 'db',
      size: 220,
    },
    {
      header: 'Tipo',
      accessorKey: 'type',
      size: 120,
      cell: (info) => typeBadge((info as { getValue: () => string }).getValue()),
    },
    {
      header: 'Inicio',
      accessorKey: 'starts',
      size: 110,
      cell: (info) => formatFecha((info as { getValue: () => string }).getValue()),
    },
    {
      header: 'Vencimiento',
      accessorKey: 'expires',
      size: 110,
      cell: (info) => formatFecha((info as { getValue: () => string | null }).getValue()),
    },
  ]);

  return (
    <section className="px-4 py-8 space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/op-licencias" className="text-muted-foreground hover:text-foreground transition">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-semibold">Carga de Solicitud</h2>
          <p className="text-sm text-muted-foreground">
            Importa el archivo solicitud.json generado desde CP OnPremises.
          </p>
        </div>
      </div>

      {/* Zona drag & drop */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('jsonInput')?.click()}
        className={`
          border-2 border-dashed rounded-2xl px-6 py-5 cursor-pointer transition-all
          flex items-center gap-4
          ${dragging
            ? 'border-blue-500 bg-blue-500/10'
            : hasDatos
              ? 'border-green-400 bg-green-500/5'
              : 'border-border hover:border-blue-400 hover:bg-blue-500/5'
          }
        `}
      >
        <input
          type="file"
          id="jsonInput"
          accept=".json"
          className="hidden"
          onChange={handleSelect}
        />
        {processing ? (
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 shrink-0" />
        ) : (
          <FileJson className={`h-8 w-8 shrink-0 ${hasDatos ? 'text-green-500' : 'text-blue-500'}`} />
        )}
        <div>
          {processing ? (
            <p className="text-sm font-medium">Procesando archivo...</p>
          ) : hasDatos ? (
            <>
              <p className="text-sm font-medium text-green-600">{fileName}</p>
              <p className="text-xs text-muted-foreground">Haz click para cargar otro archivo</p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium">Arrastra el solicitud.json aquí o haz click para seleccionar</p>
              <p className="text-xs text-muted-foreground">Archivo generado desde CP OnPremises</p>
            </>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-300 text-red-600 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Resultado */}
      {hasDatos && meta && (
        <>
          {/* Metadata */}
          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Datos de la Solicitud
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Partner</p>
                <p className="font-semibold">{meta.partner}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">RUT</p>
                <p className="font-semibold">{meta.rut}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Solicitante</p>
                <p className="font-semibold">{meta.solicitante}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Fecha Solicitud</p>
                <p className="font-semibold">
                  {new Date(meta.fecha_solicitud).toLocaleDateString('es-CL')}
                </p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t">
              <p className="text-xs text-muted-foreground">Fingerprint del servidor</p>
              <p className="font-mono text-xs mt-1">{meta.fingerprint}</p>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl border bg-blue-500/10 p-5 shadow-sm">
              <Cloud className="h-6 w-6 text-blue-600 mb-2" />
              <p className="text-2xl font-bold text-blue-600">{totalUCs}</p>
              <p className="text-xs text-muted-foreground mt-1">Unidades de cómputo</p>
            </div>
            <div className="rounded-2xl border bg-green-500/10 p-5 shadow-sm">
              <Building2 className="h-6 w-6 text-green-600 mb-2" />
              <p className="text-2xl font-bold text-green-600">{totalClientes}</p>
              <p className="text-xs text-muted-foreground mt-1">Clientes distintos</p>
            </div>
            <div className="rounded-2xl border bg-amber-500/10 p-5 shadow-sm">
              <ShieldCheck className="h-6 w-6 text-amber-600 mb-2" />
              <p className="text-2xl font-bold text-amber-600">{totalSubs}</p>
              <p className="text-xs text-muted-foreground mt-1">Suscripciones</p>
            </div>
            <div className="rounded-2xl border bg-purple-500/10 p-5 shadow-sm">
              <ShieldCheck className="h-6 w-6 text-purple-600 mb-2" />
              <p className="text-2xl font-bold text-purple-600">{totalPerpetuos}</p>
              <p className="text-xs text-muted-foreground mt-1">Perpetuas</p>
            </div>
          </div>

          {/* Tabla de UCs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Unidades de Cómputo Solicitadas</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTableSingle
                columns={tablaColumns}
                data={units}
                filterColumn="cliente"
                filterPlaceholder="Buscar por cliente..."
                initialPageSize={10}
              />
            </CardContent>
          </Card>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => handleGuardar(false)}
              disabled={guardando}
              className="flex items-center gap-2 border border-border bg-card px-6 py-3 rounded-xl font-medium hover:bg-muted transition disabled:opacity-50"
            >
              {guardando && <Loader2 className="h-4 w-4 animate-spin" />}
              Guardar Solicitud
            </button>
            <button
              onClick={() => handleGuardar(true)}
              disabled={guardando}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {guardando && <Loader2 className="h-4 w-4 animate-spin" />}
              Guardar y Procesar Ahora
            </button>
          </div>
        </>
      )}

    </section>
  );
}