'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from '@/hooks/useSession';
import { ArrowLeft, Loader2, ShieldCheck, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTableGrouping } from '@/components/data-table/data-table-grouping';
import { createColumns } from '@/components/data-table/columns';
import Link from 'next/link';

// ── Tipos ─────────────────────────────────────────────────────────────────────

interface UCFila {
  partner: string;
  rut_partner: string;
  cloud: string;
  db: string;
  cliente: string;
  alias: string;
  type: string;
  starts: string;
  expires: string | null;
  estado: 'activa' | 'por_vencer' | 'vencida' | 'perpetua';
}

interface PartnerEstado {
  partner: string;
  rut: string;
  generado_at: string | null;
  generado_por: string | null;
  sin_licencia: boolean;
  compute_units: (UCFila & { estado: string })[];
  resumen?: {
    total: number;
    activas: number;
    por_vencer: number;
    vencidas: number;
    perpetuas: number;
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function EstadoBadge({ estado }: { estado: string }) {
  const map: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
    activa:     { label: 'Activa',      className: 'bg-green-500/10 text-green-600 border-green-200',   icon: <CheckCircle className="h-3 w-3" /> },
    por_vencer: { label: 'Por vencer',  className: 'bg-amber-500/10 text-amber-600 border-amber-200',   icon: <Clock className="h-3 w-3" /> },
    vencida:    { label: 'Vencida',     className: 'bg-red-500/10 text-red-600 border-red-200',         icon: <AlertCircle className="h-3 w-3" /> },
    perpetua:   { label: '∞ Perpetua',  className: 'bg-purple-500/10 text-purple-600 border-purple-200', icon: <ShieldCheck className="h-3 w-3" /> },
  };
  const { label, className, icon } = map[estado] || map['activa'];
  return (
    <Badge className={`flex items-center gap-1 ${className}`}>
      {icon}{label}
    </Badge>
  );
}

function CloudBadge({ cloud }: { cloud: string }) {
  const map: Record<string, string> = {
    aws:   'bg-amber-500/10 text-amber-600 border-amber-200',
    azure: 'bg-blue-500/10 text-blue-600 border-blue-200',
    gcp:   'bg-green-500/10 text-green-600 border-green-200',
  };
  return <Badge className={map[cloud] || ''}>{cloud.toUpperCase()}</Badge>;
}

function diasRestantes(expires: string | null): string {
  if (!expires) return '∞';
  const dias = Math.ceil((new Date(expires).getTime() - Date.now()) / 86400000);
  if (dias < 0) return `Vencida hace ${Math.abs(dias)}d`;
  return `${dias}d restantes`;
}

// ── Página ────────────────────────────────────────────────────────────────────

export default function EstadoPage() {
  const { user, isLoading } = useSession();
  const [partners, setPartners]   = useState<PartnerEstado[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [filtro, setFiltro]       = useState<'todos' | 'vencidas' | 'por_vencer' | 'sin_licencia'>('todos');

  useEffect(() => {
    if (!user) return;
    fetch('/api/op-licencias/estado', { credentials: 'include' })
      .then(r => r.json())
      .then(data => setPartners(data))
      .catch(() => setError('Error al cargar estado de licencias.'))
      .finally(() => setLoading(false));
  }, [user]);

  if (isLoading || loading) return (
    <div className="flex items-center gap-2 p-8 text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" /> Cargando...
    </div>
  );

  if (!user || user.role !== 'admin_global') {
    return <div className="p-4 bg-red-100 text-red-700 rounded">Acceso denegado.</div>;
  }

  // ── Filtrar partners ──────────────────────────────────────────────────────
  const partnersFiltrados = partners.filter(p => {
    if (filtro === 'sin_licencia') return p.sin_licencia;
    if (filtro === 'vencidas')    return p.resumen && p.resumen.vencidas > 0;
    if (filtro === 'por_vencer')  return p.resumen && p.resumen.por_vencer > 0;
    return true;
  });

  // ── Aplanar UCs para la tabla agrupada ────────────────────────────────────
  const filas: UCFila[] = partnersFiltrados.flatMap(p =>
    p.sin_licencia
      ? [{
          partner:     p.partner,
          rut_partner: p.rut,
          cloud:       '—',
          db:          '—',
          cliente:     '—',
          alias:       '—',
          type:        '—',
          starts:      '—',
          expires:     null,
          estado:      'por_vencer' as const,
        }]
      : p.compute_units.map(uc => ({
          partner:     p.partner,
          rut_partner: p.rut,
          cloud:       uc.cloud,
          db:          uc.db,
          cliente:     uc.cliente,
          alias:       uc.alias,
          type:        uc.type,
          starts:      uc.starts,
          expires:     uc.expires,
          estado:      uc.estado as UCFila['estado'],
        }))
  );

  // ── KPIs globales ─────────────────────────────────────────────────────────
  const kpis = {
    totalPartners: partners.length,
    sinLicencia:   partners.filter(p => p.sin_licencia).length,
    conVencidas:   partners.filter(p => p.resumen && p.resumen.vencidas > 0).length,
    porVencer:     partners.filter(p => p.resumen && p.resumen.por_vencer > 0).length,
  };

  // ── Columnas tabla ────────────────────────────────────────────────────────
  const columnas = createColumns<UCFila>([
    {
      header: 'Nube',
      accessorKey: 'cloud',
      size: 80,
      cell: (info) => {
        const val = (info as { getValue: () => string }).getValue();
        return val === '—' ? <span className="text-muted-foreground text-xs">Sin licencia</span> : <CloudBadge cloud={val} />;
      },
    },
    {
      header: 'Cliente',
      accessorKey: 'cliente',
      size: 180,
    },
    {
      header: 'Alias',
      accessorKey: 'alias',
      size: 180,
    },
    {
      header: 'DB',
      accessorKey: 'db',
      size: 200,
    },
    {
      header: 'Tipo',
      accessorKey: 'type',
      size: 110,
      cell: (info) => {
        const val = (info as { getValue: () => string }).getValue();
        if (val === '—') return <span className="text-muted-foreground text-xs">—</span>;
        return val === 'perpetual'
          ? <Badge className="bg-purple-500/10 text-purple-600 border-purple-200">∞ Perpetua</Badge>
          : <Badge className="bg-blue-500/10 text-blue-600 border-blue-200">Suscripción</Badge>;
      },
    },
    {
      header: 'Vencimiento',
      accessorKey: 'expires',
      size: 150,
      cell: (info) => {
        const val = (info as { getValue: () => string | null }).getValue();
        const row = (info as { row: { original: UCFila } }).row.original;
        if (!val) return <span className="text-muted-foreground text-xs">∞ Perpetua</span>;
        return (
          <span className="text-xs">
            {new Date(val).toLocaleDateString('es-CL')}
            <span className="ml-2 text-muted-foreground">({diasRestantes(row.expires)})</span>
          </span>
        );
      },
    },
    {
      header: 'Estado',
      accessorKey: 'estado',
      size: 130,
      cell: (info) => <EstadoBadge estado={(info as { getValue: () => string }).getValue()} />,
    },
  ]);

  const FILTROS = [
    { key: 'todos',       label: 'Todos',          count: partners.length },
    { key: 'vencidas',    label: 'Con vencidas',    count: kpis.conVencidas },
    { key: 'por_vencer',  label: 'Por vencer',      count: kpis.porVencer },
    { key: 'sin_licencia', label: 'Sin licencia',   count: kpis.sinLicencia },
  ] as const;

  return (
    <section className="px-4 py-8 space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/op-licencias" className="text-muted-foreground hover:text-foreground transition">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-semibold">Estado de Licencias</h2>
          <p className="text-sm text-muted-foreground">
            Vista global del estado actual de todos los partners licenciados.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-300 text-red-600 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <ShieldCheck className="h-6 w-6 text-blue-600 mb-2" />
          <p className="text-2xl font-bold">{kpis.totalPartners}</p>
          <p className="text-xs text-muted-foreground mt-1">Partners totales</p>
        </div>
        <div className="rounded-2xl border bg-red-500/10 p-5 shadow-sm">
          <AlertCircle className="h-6 w-6 text-red-600 mb-2" />
          <p className="text-2xl font-bold text-red-600">{kpis.conVencidas}</p>
          <p className="text-xs text-muted-foreground mt-1">Con UCs vencidas</p>
        </div>
        <div className="rounded-2xl border bg-amber-500/10 p-5 shadow-sm">
          <Clock className="h-6 w-6 text-amber-600 mb-2" />
          <p className="text-2xl font-bold text-amber-600">{kpis.porVencer}</p>
          <p className="text-xs text-muted-foreground mt-1">Por vencer ≤ 30d</p>
        </div>
        <div className="rounded-2xl border bg-orange-500/10 p-5 shadow-sm">
          <AlertCircle className="h-6 w-6 text-orange-600 mb-2" />
          <p className="text-2xl font-bold text-orange-600">{kpis.sinLicencia}</p>
          <p className="text-xs text-muted-foreground mt-1">Sin licencia</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {FILTROS.map(f => (
          <button
            key={f.key}
            onClick={() => setFiltro(f.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition border ${
              filtro === f.key
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-card border-border hover:border-blue-400 text-muted-foreground'
            }`}
          >
            {f.label}
            <span className="ml-2 text-xs opacity-70">({f.count})</span>
          </button>
        ))}
      </div>

      {/* Tabla agrupada por partner */}
      {filas.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
          <ShieldCheck className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No hay licencias que mostrar para este filtro.</p>
        </div>
      ) : (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              Detalle por partner — {partnersFiltrados.length} partner{partnersFiltrados.length !== 1 ? 's' : ''}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTableGrouping
              columns={columnas}
              data={filas}
              filterColumn="cliente"
              filterPlaceholder="Buscar por cliente..."
              enableGrouping={true}
              groupByColumn="partner"
              pageSizeItems={10}
            />
          </CardContent>
        </Card>
      )}

    </section>
  );
}