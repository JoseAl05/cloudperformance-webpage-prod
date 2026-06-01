'use client';

import React, { useState } from 'react';
import { useSession } from '@/hooks/useSession';
import { FileUp, ArrowLeft, Loader2, Building2, Users, UserPlus, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface CSVMeta {
  partner: string;
  solicitante: string;
  fecha: string;
  total: string;
}

interface CSVUser {
  id: string;
  email: string;
  empresa: string;
  fecha_solicitud: string;
}

interface ParsedCSV {
  meta: CSVMeta;
  users: CSVUser[];
}

interface KPIs {
  empresas: number;
  usuariosExistentes: number;
  usuariosNuevos: number;
  licenciasAGenerar: number;
}

export default function ImportarCSVPage() {
  const { user, isLoading } = useSession();
  const [dragging, setDragging]         = useState(false);
  const [parsed, setParsed]             = useState<ParsedCSV | null>(null);
  const [kpis, setKpis]                 = useState<KPIs | null>(null);
  const [processing, setProcessing]     = useState(false);
  const [error, setError]               = useState('');

  if (isLoading) return (
    <div className="flex items-center gap-2 p-8 text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" /> Cargando...
    </div>
  );

  if (!user || user.role !== 'admin_global') {
    return <div className="p-4 bg-red-100 text-red-700 rounded">Acceso denegado.</div>;
  }

  function parseCSVText(text: string): ParsedCSV | null {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    const meta: Partial<CSVMeta> = {};
    const users: CSVUser[] = [];

    for (const line of lines) {
      if (line.startsWith('#')) {
        const content = line.replace('#', '').trim();
        if (content.startsWith('Partner:'))        meta.partner     = content.replace('Partner:', '').trim();
        if (content.startsWith('Solicitante:'))    meta.solicitante = content.replace('Solicitante:', '').trim();
        if (content.startsWith('Fecha Solicitud:'))meta.fecha       = content.replace('Fecha Solicitud:', '').trim();
        if (content.startsWith('Total Usuarios:')) meta.total       = content.replace('Total Usuarios:', '').trim();
      } else if (!line.startsWith('id_mongodb')) {
        const cols = line.split(',');
        if (cols.length >= 3) {
          users.push({
            id:             cols[0].trim(),
            email:          cols[1].trim(),
            empresa:        cols[2].trim(),
            fecha_solicitud: cols[3]?.trim() || '',
          });
        }
      }
    }

    if (!meta.partner || users.length === 0) return null;
    return { meta: meta as CSVMeta, users };
  }

  async function processFile(file: File) {
    if (!file.name.endsWith('.csv')) {
      setError('El archivo debe ser .csv');
      return;
    }

    setProcessing(true);
    setError('');
    setParsed(null);
    setKpis(null);

    try {
      const text = await file.text();
      const result = parseCSVText(text);

      if (!result) {
        setError('El archivo no tiene el formato correcto. Debe ser generado desde CloudPerformance OnPremises.');
        return;
      }

      setParsed(result);

      // Consultar licencias existentes para calcular KPIs
      const res = await fetch('/api/op-licencias/comparar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partner: result.meta.partner, users: result.users }),
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setKpis(data.kpis);
      } else {
        // Si no existe la API aún, calculamos básico en frontend
        const empresas = new Set(result.users.map(u => u.empresa)).size;
        setKpis({
          empresas,
          usuariosExistentes: 0,
          usuariosNuevos: result.users.length,
          licenciasAGenerar: result.users.length,
        });
      }
    } catch {
      setError('Error al procesar el archivo.');
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

  return (
    <section className="mx-auto max-w-4xl px-4 py-8">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/op-licencias" className="text-muted-foreground hover:text-foreground transition">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-semibold">Importar Solicitud CSV</h2>
          <p className="text-sm text-muted-foreground">
            Carga el archivo enviado por el partner para procesar las licencias.
          </p>
        </div>
      </div>

      {/* Zona de carga */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('csvInput')?.click()}
        className={`
          border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all
          ${dragging
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-border hover:border-blue-400 hover:bg-blue-500/5'
          }
        `}
      >
        <input type="file" id="csvInput" accept=".csv" className="hidden" onChange={handleSelect} />
        {processing ? (
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            <p className="text-sm">Procesando archivo...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <FileUp className="h-10 w-10 text-blue-500" />
            <p className="text-base font-medium">Arrastra el CSV aquí o haz click para seleccionar</p>
            <p className="text-xs text-muted-foreground">
              Archivo generado desde "Generar Solicitud de Licencias" en CP OnPremises
            </p>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-300 text-red-600 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Resultado */}
      {parsed && kpis && (
        <div className="mt-8 space-y-6">

          {/* Metadata del partner */}
          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wide">
              Datos de la Solicitud
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Partner</p>
                <p className="font-semibold">{parsed.meta.partner}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Solicitante</p>
                <p className="font-semibold">{parsed.meta.solicitante}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Fecha Solicitud</p>
                <p className="font-semibold">{parsed.meta.fecha}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Usuarios en CSV</p>
                <p className="font-semibold">{parsed.users.length}</p>
              </div>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl border bg-blue-500/10 p-5 shadow-sm">
              <Building2 className="h-6 w-6 text-blue-600 mb-2" />
              <p className="text-2xl font-bold text-blue-600">{kpis.empresas}</p>
              <p className="text-xs text-muted-foreground mt-1">Empresas detectadas</p>
            </div>
            <div className="rounded-2xl border bg-amber-500/10 p-5 shadow-sm">
              <Users className="h-6 w-6 text-amber-600 mb-2" />
              <p className="text-2xl font-bold text-amber-600">{kpis.usuariosExistentes}</p>
              <p className="text-xs text-muted-foreground mt-1">Usuarios existentes</p>
            </div>
            <div className="rounded-2xl border bg-green-500/10 p-5 shadow-sm">
              <UserPlus className="h-6 w-6 text-green-600 mb-2" />
              <p className="text-2xl font-bold text-green-600">{kpis.usuariosNuevos}</p>
              <p className="text-xs text-muted-foreground mt-1">Usuarios nuevos</p>
            </div>
            <div className="rounded-2xl border bg-purple-500/10 p-5 shadow-sm">
              <ShieldCheck className="h-6 w-6 text-purple-600 mb-2" />
              <p className="text-2xl font-bold text-purple-600">{kpis.licenciasAGenerar}</p>
              <p className="text-xs text-muted-foreground mt-1">Licencias a generar</p>
            </div>
          </div>

          {/* Botón continuar */}
          <div className="flex justify-end">
            <Link
              href={`/op-licencias/solicitudes?partner=${encodeURIComponent(parsed.meta.partner)}`}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition"
            >
              Revisar Solicitud →
            </Link>
          </div>

        </div>
      )}

    </section>
  );
}