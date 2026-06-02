'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSession } from '@/hooks/useSession';
import { ArrowLeft, Loader2, ShieldCheck, Trash2, XCircle, CheckCircle, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface SolicitudUsuario {
  id: string;
  email: string;
  empresa: string;
  estado: string;
  starts?: string;
  expires?: string;
  diasRestantes?: number | null;
}

interface Solicitud {
  _id: string;
  partner: string;
  solicitante: string;
  fecha_solicitud: string;
  estado: string;
  usuarios: SolicitudUsuario[];
  createdAt: string;
}

interface PartnerGroup {
  partner: string;
  solicitudes: Solicitud[];
  usuariosConsolidados: SolicitudUsuario[];
  vigentesAuto: SolicitudUsuario[];
}

function GenerarContent() {
  const { user, isLoading } = useSession();

  const [partnerGroups, setPartnerGroups] = useState<PartnerGroup[]>([]);
  const [loading, setLoading]             = useState(true);
  const [procesando, setProcesando]       = useState<string | null>(null);
  const [error, setError]                 = useState('');
  const [selectedIds, setSelectedIds]     = useState<Record<string, Set<string>>>({});
  const [licGenerada, setLicGenerada]     = useState<{ content: string; partner: string } | null>(null);

  const fetchSolicitudes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/op-licencias/solicitudes', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        const pendientes: Solicitud[] = data.filter((s: Solicitud) => s.estado === 'pendiente');

        // Agrupar por partner
        const groups = new Map<string, PartnerGroup>();
        pendientes.forEach(s => {
          if (!groups.has(s.partner)) {
            groups.set(s.partner, {
              partner: s.partner,
              solicitudes: [],
              usuariosConsolidados: [],
              vigentesAuto: [],
            });
          }
          const g = groups.get(s.partner)!;
          g.solicitudes.push(s);

          s.usuarios.forEach(u => {
            if (u.estado === 'vigente_auto') {
              // Evitar duplicados en vigentes auto
              if (!g.vigentesAuto.find(v => v.id === u.id)) {
                g.vigentesAuto.push(u);
              }
            } else {
              g.usuariosConsolidados.push(u);
            }
          });
        });

        const groupsArr = Array.from(groups.values());
        setPartnerGroups(groupsArr);

        // Preseleccionar usuarios no vigentes
        const inicial: Record<string, Set<string>> = {};
        groupsArr.forEach(g => {
          inicial[g.partner] = new Set(
            g.usuariosConsolidados
              .filter(u => u.estado !== 'vigente')
              .map(u => u.id)
          );
        });
        setSelectedIds(inicial);
      }
    } catch {
      setError('Error al cargar solicitudes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchSolicitudes();
  }, [user, fetchSolicitudes]);

  function toggleUsuario(partner: string, usuarioId: string) {
    setSelectedIds(prev => {
      const next = { ...prev };
      const set = new Set(next[partner] || []);
      set.has(usuarioId) ? set.delete(usuarioId) : set.add(usuarioId);
      next[partner] = set;
      return next;
    });
  }

  async function handleCancelar(id: string) {
    if (!confirm('¿Cancelar esta solicitud?')) return;
    setProcesando(id);
    try {
      await fetch(`/api/op-licencias/solicitudes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ estado: 'cancelada' }),
      });
      fetchSolicitudes();
    } finally {
      setProcesando(null);
    }
  }

  async function handleEliminar(id: string) {
    if (!confirm('¿Eliminar esta solicitud permanentemente?')) return;
    setProcesando(id);
    try {
      await fetch(`/api/op-licencias/solicitudes/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      fetchSolicitudes();
    } finally {
      setProcesando(null);
    }
  }

  async function handleGenerar(group: PartnerGroup) {
    setProcesando(group.partner);
    setError('');
    try {
      const aprobados = [
        ...group.usuariosConsolidados.filter(u =>
          selectedIds[group.partner]?.has(u.id)
        ),
        ...group.vigentesAuto,
      ];

      if (aprobados.filter(u => u.estado !== 'vigente_auto').length === 0) {
        setError('Selecciona al menos un usuario para generar la licencia.');
        setProcesando(null);
        return;
      }

      const res = await fetch('/api/op-licencias/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          solicitudesIds: group.solicitudes.map(s => s._id),
          partner:        group.partner,
          usuarios:       aprobados,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setLicGenerada({ content: data.licContent, partner: group.partner });
        fetchSolicitudes();
      } else {
        setError(`Error: ${data.message}`);
      }
    } finally {
      setProcesando(null);
    }
  }

  function downloadLic(content: string, partner: string) {
    const slug = partner.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '_').slice(0, 20);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([content], { type: 'text/plain' }));
    a.download = `cloudperformance_${slug}_${new Date().toISOString().slice(0, 10)}.lic`;
    a.click();
  }

  function getEstadoBadge(estado: string, dias?: number | null) {
    switch (estado) {
      case 'nuevo':        return <Badge className="bg-green-500/10 text-green-600 border-green-200">🟢 Nuevo</Badge>;
      case 'por_vencer':   return <Badge className="bg-amber-500/10 text-amber-600 border-amber-200">🔔 Por vencer ({dias}d)</Badge>;
      case 'vigente':      return <Badge className="bg-blue-500/10 text-blue-600 border-blue-200">⚠️ Vigente ({dias}d)</Badge>;
      case 'vencida':      return <Badge className="bg-red-500/10 text-red-600 border-red-200">❌ Vencida</Badge>;
      case 'vigente_auto': return <Badge className="bg-gray-500/10 text-gray-500 border-gray-200">🔒 Auto</Badge>;
      default:             return <Badge>{estado}</Badge>;
    }
  }

  if (isLoading || loading) return (
    <div className="flex items-center gap-2 p-8 text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" /> Cargando...
    </div>
  );

  if (!user || user.role !== 'admin_global') {
    return <div className="p-4 bg-red-100 text-red-700 rounded">Acceso denegado.</div>;
  }

  return (
    <section className="px-4 py-8 space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/op-licencias" className="text-muted-foreground hover:text-foreground transition">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-semibold">Generar Licencias</h2>
          <p className="text-sm text-muted-foreground">
            Solicitudes consolidadas por partner. Selecciona usuarios y genera el .lic único.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-300 text-red-600 rounded-xl text-sm">{error}</div>
      )}

      {/* Licencia generada */}
      {licGenerada && (
        <div className="rounded-2xl border border-green-300 bg-green-500/5 p-5 space-y-3">
          <div className="flex items-center gap-2 text-green-600 font-semibold">
            <CheckCircle className="h-5 w-5" />
            .lic generado correctamente para {licGenerada.partner}
          </div>
          <button
            onClick={() => downloadLic(licGenerada.content, licGenerada.partner)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700 transition"
          >
            <Download className="h-4 w-4" />
            Descargar cloudperformance.lic
          </button>
        </div>
      )}

      {/* Sin solicitudes */}
      {partnerGroups.length === 0 && !licGenerada && (
        <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
          <ShieldCheck className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No hay solicitudes pendientes.</p>
          <Link href="/op-licencias/importar" className="text-blue-600 text-sm hover:underline mt-2 inline-block">
            ← Importar nueva solicitud
          </Link>
        </div>
      )}

      {/* Un card por partner */}
      {partnerGroups.map(group => (
        <Card key={group.partner} className="shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <CardTitle className="text-base">
                  {group.partner}
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  {group.solicitudes.length} solicitud{group.solicitudes.length !== 1 ? 'es' : ''} pendiente{group.solicitudes.length !== 1 ? 's' : ''} ·{' '}
                  {group.usuariosConsolidados.length} usuarios nuevos ·{' '}
                  {group.vigentesAuto.length} vigentes automáticos
                </p>
                {/* Tags de solicitudes incluidas */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {group.solicitudes.map(s => (
                    <div key={s._id} className="flex items-center gap-1">
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                        {s.fecha_solicitud} — {s.solicitante}
                      </span>
                      <button
                        onClick={() => handleCancelar(s._id)}
                        disabled={procesando === s._id}
                        title="Cancelar esta solicitud"
                        className="text-amber-500 hover:text-amber-700 transition"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleEliminar(s._id)}
                        disabled={procesando === s._id}
                        title="Eliminar esta solicitud"
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => handleGenerar(group)}
                disabled={procesando === group.partner}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
              >
                {procesando === group.partner
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <ShieldCheck className="h-4 w-4" />
                }
                Generar .lic consolidado
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {/* Usuarios nuevos/por vencer/vencidos — con checkbox */}
              {group.usuariosConsolidados.map(u => (
                <div key={`${u.id}-${u.email}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition">
                  <input
                    type="checkbox"
                    checked={selectedIds[group.partner]?.has(u.id) ?? false}
                    onChange={() => toggleUsuario(group.partner, u.id)}
                    disabled={u.estado === 'vigente'}
                    className="h-4 w-4 rounded border-input cursor-pointer disabled:opacity-30"
                  />
                  <span className="text-sm flex-1">{u.email}</span>
                  <span className="text-xs text-muted-foreground">{u.empresa}</span>
                  {getEstadoBadge(u.estado, u.diasRestantes)}
                </div>
              ))}

              {/* Vigentes automáticos */}
              {group.vigentesAuto.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-muted-foreground mb-2">
                    🔒 {group.vigentesAuto.length} usuarios con licencia vigente — se incluirán automáticamente en el .lic
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

    </section>
  );
}

export default function GenerarPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center gap-2 p-8 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Cargando...
      </div>
    }>
      <GenerarContent />
    </Suspense>
  );
}