'use client';

import React, { useState } from 'react';
import { useSession } from '@/hooks/useSession';
import { FileUp, ArrowLeft, Loader2, Building2, Users, UserPlus, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTableGrouping } from '@/components/data-table/data-table-grouping';
import { createColumns } from '@/components/data-table/columns';
import { ColumnDef } from '@tanstack/react-table';
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

interface EmpresaGroup {
  nombre: string;
  nuevos: CSVUser[];
  existentes: CSVUser[];
}

interface TablaRow {
  id: string;
  email: string;
  empresa: string;
  fecha_solicitud: string;
  estado: 'nuevo' | 'vencida' | 'por_vencer' | 'vigente';
  diasRestantes: number | null;
  expires?: string;
}

interface VigenteAutomatico {
  id: string;
  email: string;
  empresa: string;
  starts: string;
  expires: string;
}

export default function ImportarCSVPage() {
  const { user, isLoading } = useSession();
  const [dragging, setDragging]             = useState(false);
  const [meta, setMeta]                     = useState<CSVMeta | null>(null);
  const [empresaGroups, setEmpresaGroups]   = useState<EmpresaGroup[]>([]);
  const [processing, setProcessing]         = useState(false);
  const [error, setError]                   = useState('');
  const [fileName, setFileName]             = useState('');
  const [guardando, setGuardando]           = useState(false);
  const [vigentesAutomaticos, setVigentesAuto]  = useState<VigenteAutomatico[]>([]);
  const [tablaRows, setTablaRows]               = useState<TablaRow[]>([]);
  const [kpisExtended, setKpisExtended]         = useState<{
    usuariosPorVencer: number;
    usuariosVigentes: number;
    usuariosVencidos: number;
  } | null>(null);
  if (isLoading) return (
    <div className="flex items-center gap-2 p-8 text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" /> Cargando...
    </div>
  );

  if (!user || user.role !== 'admin_global') {
    return <div className="p-4 bg-red-100 text-red-700 rounded">Acceso denegado.</div>;
  }

  // KPIs calculados
  const totalEmpresas = empresaGroups.length;
  const totalExistentes = empresaGroups.reduce((s, e) => s + e.existentes.length, 0);
  const totalNuevos = empresaGroups.reduce((s, e) => s + e.nuevos.length, 0);
  const totalLicencias = totalNuevos;

  function parseCSVText(text: string) {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    const parsedMeta: Partial<CSVMeta> = {};
    const users: CSVUser[] = [];

    for (const line of lines) {
      if (line.startsWith('#')) {
        const content = line.replace('#', '').trim();
        if (content.startsWith('Partner:')) parsedMeta.partner = content.replace('Partner:', '').trim();
        if (content.startsWith('Solicitante:')) parsedMeta.solicitante = content.replace('Solicitante:', '').trim();
        if (content.startsWith('Fecha Solicitud:')) parsedMeta.fecha = content.replace('Fecha Solicitud:', '').trim();
        if (content.startsWith('Total Usuarios:')) parsedMeta.total = content.replace('Total Usuarios:', '').trim();
      } else if (!line.startsWith('id_mongodb')) {
        const cols = line.split(',');
        if (cols.length >= 3) {
          users.push({
            id: cols[0].trim(),
            email: cols[1].trim(),
            empresa: cols[2].trim(),
            fecha_solicitud: cols[3]?.trim() || '',
          });
        }
      }
    }

    return { meta: parsedMeta as CSVMeta, users };
  }

  async function processFile(file: File) {
    if (!file.name.endsWith('.csv')) {
      setError('El archivo debe ser .csv');
      return;
    }

    setProcessing(true);
    setError('');
    setFileName(file.name);

    try {
      const text = await file.text();
      const { meta: parsedMeta, users } = parseCSVText(text);

      if (!parsedMeta.partner || users.length === 0) {
        setError('El archivo no tiene el formato correcto. Debe ser generado desde CP OnPremises.');
        return;
      }

      setMeta(parsedMeta);

      // Agrupar por empresa — por ahora todos son nuevos
      const grouped = new Map<string, EmpresaGroup>();
      users.forEach(u => {
        if (!grouped.has(u.empresa)) {
          grouped.set(u.empresa, { nombre: u.empresa, nuevos: [], existentes: [] });
        }
        grouped.get(u.empresa)!.nuevos.push(u);
      });

      setEmpresaGroups(Array.from(grouped.values()));
      sessionStorage.setItem('op_csv_users', JSON.stringify(users));
      sessionStorage.setItem('op_csv_meta', JSON.stringify(parsedMeta));

      // Comparar con historial de licencias
      const res = await fetch('/api/op-licencias/comparar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ partner: parsedMeta.partner, users }),
      });

      if (res.ok) {
        const data = await res.json();
        setTablaRows(data.usuarios);
        setVigentesAuto(data.vigentesAutomaticos);
        setKpisExtended({
          usuariosPorVencer: data.kpis.usuariosPorVencer,
          usuariosVigentes:  data.kpis.usuariosVigentes,
          usuariosVencidos:  data.kpis.usuariosVencidos,
        });
      } else {
        // Sin historial — todos son nuevos
        setTablaRows(users.map((u: CSVUser) => ({ ...u, estado: 'nuevo' as const, diasRestantes: null })));
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

  const hasDatos = empresaGroups.length > 0;

  const tablaColumns = createColumns<TablaRow>([
    {
      header: 'Email',
      accessorKey: 'email',
      size: 280,
    },
    {
      header: 'Empresa',
      accessorKey: 'empresa',
      size: 180,
    },
    {
      header: 'Fecha Solicitud',
      accessorKey: 'fecha_solicitud',
      size: 140,
    },
    {
      header: 'Vencimiento Actual',
      accessorKey: 'expires',
      size: 150,
      cell: (info) => {
        const val = (info as { getValue: () => string }).getValue();
        if (!val) return <span className="text-muted-foreground text-xs">—</span>;
        return <span className="text-xs">{new Date(val).toLocaleDateString('es-CL')}</span>;
      }
    },
    {
      header: 'Estado',
      accessorKey: 'estado',
      size: 160,
      cell: (info) => {
        const val = (info as { getValue: () => string }).getValue();
        const row = (info as { row: { original: TablaRow } }).row.original;
        switch(val) {
          case 'nuevo':
            return <Badge className="bg-green-500/10 text-green-600 border-green-200">🟢 Nuevo</Badge>;
          case 'por_vencer':
            return <Badge className="bg-amber-500/10 text-amber-600 border-amber-200">🔔 Por vencer ({row.diasRestantes}d)</Badge>;
          case 'vigente':
            return <Badge className="bg-blue-500/10 text-blue-600 border-blue-200">⚠️ Vigente ({row.diasRestantes}d)</Badge>;
          case 'vencida':
            return <Badge className="bg-red-500/10 text-red-600 border-red-200">❌ Vencida</Badge>;
          default:
            return <span>—</span>;
        }
      }
    },
  ]);

  async function handleGuardar(generar: boolean) {
    if (!meta) return;
    setGuardando(true);
    try {
      const usuarios = [
        ...tablaRows,
        ...vigentesAutomaticos.map(v => ({ ...v, estado: 'vigente_auto', diasRestantes: null }))
      ];

      const res = await fetch('/api/op-licencias/solicitudes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          partner: meta.partner,
          solicitante: meta.solicitante,
          fecha_solicitud: meta.fecha,
          usuarios,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        if (generar) {
          window.location.href = `/op-licencias/generar?id=${data.id}&partner=${encodeURIComponent(meta.partner)}`;
        } else {
          window.location.href = '/op-licencias/generar';
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

  return (
    <section className="px-4 py-8 space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
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

      {/* Zona de carga — compacta */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('csvInput')?.click()}
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
        <input type="file" id="csvInput" accept=".csv" className="hidden" onChange={handleSelect} />
        {processing ? (
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 shrink-0" />
        ) : (
          <FileUp className={`h-8 w-8 shrink-0 ${hasDatos ? 'text-green-500' : 'text-blue-500'}`} />
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
              <p className="text-sm font-medium">Arrastra el CSV aquí o haz click para seleccionar</p>
              <p className="text-xs text-muted-foreground">Archivo generado desde Generar Solicitud de Licencias en CP OnPremises</p>
            </>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-300 text-red-600 rounded-xl text-sm">
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
                <p className="text-xs text-muted-foreground">Solicitante</p>
                <p className="font-semibold">{meta.solicitante}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Fecha Solicitud</p>
                <p className="font-semibold">{meta.fecha}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Usuarios en CSV</p>
                <p className="font-semibold">{meta.total || empresaGroups.reduce((s, e) => s + e.nuevos.length + e.existentes.length, 0)}</p>
              </div>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl border bg-blue-500/10 p-5 shadow-sm">
              <Building2 className="h-6 w-6 text-blue-600 mb-2" />
              <p className="text-2xl font-bold text-blue-600">{totalEmpresas}</p>
              <p className="text-xs text-muted-foreground mt-1">Empresas detectadas</p>
            </div>
            <div className="rounded-2xl border bg-green-500/10 p-5 shadow-sm">
              <UserPlus className="h-6 w-6 text-green-600 mb-2" />
              <p className="text-2xl font-bold text-green-600">
                {tablaRows.filter(u => u.estado === 'nuevo').length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Usuarios nuevos</p>
            </div>
            <div className="rounded-2xl border bg-amber-500/10 p-5 shadow-sm">
              <Users className="h-6 w-6 text-amber-600 mb-2" />
              <p className="text-2xl font-bold text-amber-600">
                {(kpisExtended?.usuariosPorVencer ?? 0) + (kpisExtended?.usuariosVencidos ?? 0)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Por vencer / Vencidas</p>
            </div>
            <div className="rounded-2xl border bg-purple-500/10 p-5 shadow-sm">
              <ShieldCheck className="h-6 w-6 text-purple-600 mb-2" />
              <p className="text-2xl font-bold text-purple-600">
                {tablaRows.filter(u => u.estado !== 'vigente').length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Licencias a generar</p>
            </div>
          </div>

          {/* Tabla de usuarios */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Detalle de Usuarios Solicitados</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTableGrouping
                columns={tablaColumns}
                data={tablaRows}
                filterColumn="email"
                filterPlaceholder="Buscar por email..."
                enableGrouping={true}
                groupByColumn="empresa"
                pageSizeItems={10}
              />
            </CardContent>
          </Card>

          {/* Botones guardar */}
          {empresaGroups.length > 0 && (
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => handleGuardar(false)}
                disabled={guardando}
                className="flex items-center gap-2 border border-border bg-card px-6 py-3 rounded-xl font-medium hover:bg-muted transition disabled:opacity-50"
              >
                {guardando ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Guardar Solicitud
              </button>
              <button
                onClick={() => handleGuardar(true)}
                disabled={guardando}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50"
              >
                {guardando ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Guardar y Generar Licencias
              </button>
            </div>
          )}
        </>
      )}

    </section>
  );
}