'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from '@/hooks/useSession';
import {
  ArrowLeft, Loader2, ShieldCheck, AlertCircle,
  CheckCircle, Clock, ChevronDown, ChevronRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// ── Tipos ─────────────────────────────────────────────────────────────────────

interface ComputeUnit {
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
  solicitud_id?: string;
  compute_units: ComputeUnit[];
  resumen?: {
    total: number;
    activas: number;
    por_vencer: number;
    vencidas: number;
    perpetuas: number;
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function CloudBadge({ cloud }: { cloud: string }) {
  const map: Record<string, string> = {
    aws:   'bg-amber-500/10 text-amber-600 border-amber-200',
    azure: 'bg-blue-500/10 text-blue-600 border-blue-200',
    gcp:   'bg-green-500/10 text-green-600 border-green-200',
  };
  return (
    <Badge className={cn('text-xs', map[cloud] || 'bg-gray-500/10 text-gray-600')}>
      {cloud.toUpperCase()}
    </Badge>
  );
}

function UCEstadoBadge({ estado }: { estado: string }) {
  const map: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
    activa:     { label: 'Activa',     className: 'bg-green-500/10 text-green-600 border-green-200',    icon: <CheckCircle className="h-3 w-3" /> },
    por_vencer: { label: 'Por vencer', className: 'bg-amber-500/10 text-amber-600 border-amber-200',    icon: <Clock className="h-3 w-3" /> },
    vencida:    { label: 'Vencida',    className: 'bg-red-500/10 text-red-600 border-red-200',          icon: <AlertCircle className="h-3 w-3" /> },
    perpetua:   { label: '∞ Perpetua', className: 'bg-purple-500/10 text-purple-600 border-purple-200', icon: <ShieldCheck className="h-3 w-3" /> },
  };
  const cfg = map[estado] || map['activa'];
  return (
    <Badge className={cn('flex items-center gap-1 text-xs', cfg.className)}>
      {cfg.icon}{cfg.label}
    </Badge>
  );
}

function diasLabel(expires: string | null, estado: string): string {
  if (estado === 'perpetua' || !expires) return '∞';
  const dias = Math.ceil((new Date(expires).getTime() - Date.now()) / 86400000);
  if (dias < 0) return `Vencida hace ${Math.abs(dias)}d`;
  return `${dias}d restantes`;
}

// ── Card de partner ───────────────────────────────────────────────────────────

function PartnerCard({ partner }: { partner: PartnerEstado }) {
  const [expandido, setExpandido] = useState(false);

  const borderColor = partner.sin_licencia
    ? 'border-orange-200'
    : partner.resumen?.vencidas
      ? 'border-red-200'
      : partner.resumen?.por_vencer
        ? 'border-amber-200'
        : 'border-border';

  return (
    <div className={cn('rounded-2xl border bg-card shadow-sm overflow-hidden', borderColor)}>

      {/* Header — siempre visible, clickeable */}
      <button
        onClick={() => setExpandido(p => !p)}
        className="w-full flex items-center justify-between gap-4 p-5 hover:bg-muted/30 transition text-left"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {expandido
            ? <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
            : <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
          }
          <div className="min-w-0">
            <p className="font-semibold truncate">{partner.partner}</p>
            <p className="text-xs text-muted-foreground mt-0.5">RUT: {partner.rut}</p>
          </div>
        </div>

        {/* Resumen o sin licencia */}
        {partner.sin_licencia ? (
          <Badge className="bg-orange-500/10 text-orange-600 border-orange-200 shrink-0">
            ⚠️ Sin licencia
          </Badge>
        ) : (
          <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
            {(partner.resumen?.activas ?? 0) > 0 && (
              <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />{partner.resumen?.activas} activa{partner.resumen?.activas !== 1 ? 's' : ''}
              </span>
            )}
            {(partner.resumen?.por_vencer ?? 0) > 0 && (
              <span className="text-xs text-amber-600 font-medium flex items-center gap-1">
                <Clock className="h-3 w-3" />{partner.resumen?.por_vencer} por vencer
              </span>
            )}
            {(partner.resumen?.vencidas ?? 0) > 0 && (
              <span className="text-xs text-red-600 font-medium flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />{partner.resumen?.vencidas} vencida{partner.resumen?.vencidas !== 1 ? 's' : ''}
              </span>
            )}
            {(partner.resumen?.perpetuas ?? 0) > 0 && (
              <span className="text-xs text-purple-600 font-medium flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />{partner.resumen?.perpetuas} perpetua{partner.resumen?.perpetuas !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}
      </button>

      {/* Detalle expandido */}
      {expandido && (
        <div className="border-t px-5 pb-5 pt-4 space-y-2">

          {/* Metadata */}
          {!partner.sin_licencia && partner.generado_at && (
            <p className="text-xs text-muted-foreground mb-3">
              Última licencia: {new Date(partner.generado_at).toLocaleDateString('es-CL')}
              {partner.generado_por && ` · por ${partner.generado_por}`}
            </p>
          )}

          {/* Sin licencia */}
          {partner.sin_licencia && (
            <div className="rounded-xl bg-orange-500/5 border border-orange-200 px-4 py-3">
              <p className="text-sm text-orange-600 font-medium">⚠️ Solicitud pendiente — sin .lic generado</p>
              <p className="text-xs text-muted-foreground mt-1">
                Ve a <strong>Gestión de Partner</strong> para generar la licencia.
              </p>
            </div>
          )}

          {/* Headers de columna */}
          {partner.compute_units.length > 0 && (
            <div className="grid grid-cols-[70px_1fr_350px_230px_110px] gap-3 px-3 py-2 border-b">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Nube</span>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Alias</span>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Cliente</span>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Período</span>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Estado</span>
            </div>
          )}

          {/* UCs */}
          {partner.compute_units.map((uc, i) => (
            <div
              key={i}
              className="grid grid-cols-[70px_1fr_350px_230px_110px] gap-3 items-center px-3 py-2 rounded-xl hover:bg-muted/30 transition"
            >
              <CloudBadge cloud={uc.cloud} />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{uc.alias}</p>
                <p className="text-xs text-muted-foreground font-mono truncate" title={uc.db}>{uc.db}</p>
              </div>
              <span className="text-xs text-muted-foreground truncate" title={uc.cliente}>{uc.cliente}</span>
              <span className="text-xs text-muted-foreground">
                {uc.estado === 'perpetua'
                  ? `Desde ${new Date(uc.starts).toLocaleDateString('es-CL')} · ∞`
                  : `${new Date(uc.starts).toLocaleDateString('es-CL')} — ${uc.expires ? new Date(uc.expires).toLocaleDateString('es-CL') : '∞'} · ${diasLabel(uc.expires, uc.estado)}`
                }
              </span>
              <UCEstadoBadge estado={uc.estado} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────────────────

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

  // ── KPIs globales — totales de UCs ────────────────────────────────────────
  const kpis = {
    total:       partners.length,
    activas:     partners.reduce((acc, p) => acc + (p.resumen?.activas ?? 0), 0),
    sinLicencia: partners.filter(p => p.sin_licencia).length,
    conVencidas: partners.reduce((acc, p) => acc + (p.resumen?.vencidas ?? 0), 0),
    porVencer:   partners.reduce((acc, p) => acc + (p.resumen?.por_vencer ?? 0), 0),
  };

  // ── Filtrar ───────────────────────────────────────────────────────────────
  const partnersFiltrados = partners.filter(p => {
    if (filtro === 'sin_licencia') return p.sin_licencia;
    if (filtro === 'vencidas')     return (p.resumen?.vencidas ?? 0) > 0;
    if (filtro === 'por_vencer')   return (p.resumen?.por_vencer ?? 0) > 0;
    return true;
  });

  const FILTROS = [
    { key: 'todos',        label: 'Todos',         count: kpis.total },
    { key: 'vencidas',     label: 'Con vencidas',  count: kpis.conVencidas },
    { key: 'por_vencer',   label: 'Por vencer',    count: kpis.porVencer },
    { key: 'sin_licencia', label: 'Sin licencia',  count: kpis.sinLicencia },
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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <ShieldCheck className="h-6 w-6 text-blue-600 mb-2" />
          <p className="text-2xl font-bold">{kpis.total}</p>
          <p className="text-xs text-muted-foreground mt-1">Partners totales</p>
        </div>
        <div className="rounded-2xl border bg-green-500/10 p-5 shadow-sm">
          <CheckCircle className="h-6 w-6 text-green-600 mb-2" />
          <p className="text-2xl font-bold text-green-600">{kpis.activas}</p>
          <p className="text-xs text-muted-foreground mt-1">UCs activas</p>
        </div>
        <div className="rounded-2xl border bg-red-500/10 p-5 shadow-sm">
          <AlertCircle className="h-6 w-6 text-red-600 mb-2" />
          <p className="text-2xl font-bold text-red-600">{kpis.conVencidas}</p>
          <p className="text-xs text-muted-foreground mt-1">UCs vencidas</p>
        </div>
        <div className="rounded-2xl border bg-amber-500/10 p-5 shadow-sm">
          <Clock className="h-6 w-6 text-amber-600 mb-2" />
          <p className="text-2xl font-bold text-amber-600">{kpis.porVencer}</p>
          <p className="text-xs text-muted-foreground mt-1">UCs por vencer ≤ 30d</p>
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
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium transition border',
              filtro === f.key
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-card border-border hover:border-blue-400 text-muted-foreground'
            )}
          >
            {f.label}
            <span className="ml-2 text-xs opacity-70">({f.count})</span>
          </button>
        ))}
      </div>

      {/* Cards de partners */}
      {partnersFiltrados.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
          <ShieldCheck className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No hay partners que mostrar para este filtro.</p>
        </div>
      ) : (        
        <div className="space-y-3">         
          {partnersFiltrados.map(p => (
            <PartnerCard key={p.rut} partner={p} />
          ))}
        </div>
      )}

    </section>
  );
}