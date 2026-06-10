'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from '@/hooks/useSession';
import {
  ArrowLeft, Loader2, Search, ShieldCheck, Download,
  CheckCircle, AlertCircle, Clock, Plus, Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  uc_fp?: string;
}

interface SolicitudPendiente {
  _id: string;
  fecha_solicitud: string;
  solicitante: string;
  compute_units: ComputeUnit[];
}

interface PartnerData {
  partner: string;
  rut: string;
  fingerprint: string;
  ultima_licencia_id: string;
  ultima_licencia_at: string;
  generado_por: string;
  compute_units: ComputeUnit[];
  solicitudes_pendientes: SolicitudPendiente[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function ucEstado(uc: ComputeUnit): { label: string; variant: string; dias?: number } {
  if (uc.type === 'perpetual') return { label: '∞ Perpetua', variant: 'purple' };
  if (!uc.expires) return { label: '∞ Perpetua', variant: 'purple' };
  const dias = Math.ceil((new Date(uc.expires).getTime() - Date.now()) / 86400000);
  if (dias < 0)  return { label: 'Vencida', variant: 'red' };
  if (dias <= 30) return { label: `Por vencer (${dias}d)`, variant: 'amber', dias };
  return { label: `Activa (${dias}d)`, variant: 'green', dias };
}

function EstadoBadge({ uc }: { uc: ComputeUnit }) {
  const { label, variant } = ucEstado(uc);
  const styles: Record<string, string> = {
    green:  'bg-green-500/10 text-green-600 border-green-200',
    amber:  'bg-amber-500/10 text-amber-600 border-amber-200',
    red:    'bg-red-500/10 text-red-600 border-red-200',
    purple: 'bg-purple-500/10 text-purple-600 border-purple-200',
  };
  const icons: Record<string, React.ReactNode> = {
    green:  <CheckCircle className="h-3 w-3" />,
    amber:  <Clock className="h-3 w-3" />,
    red:    <AlertCircle className="h-3 w-3" />,
    purple: <ShieldCheck className="h-3 w-3" />,
  };
  return (
    <Badge className={`flex items-center gap-1 ${styles[variant]}`}>
      {icons[variant]}{label}
    </Badge>
  );
}

function CloudBadge({ cloud }: { cloud: string }) {
  const styles: Record<string, string> = {
    aws:   'bg-amber-500/10 text-amber-600 border-amber-200',
    azure: 'bg-blue-500/10 text-blue-600 border-blue-200',
    gcp:   'bg-green-500/10 text-green-600 border-green-200',
  };
  return <Badge className={styles[cloud] || ''}>{cloud.toUpperCase()}</Badge>;
}

// ── Formulario nueva UC ───────────────────────────────────────────────────────

const ucVacia = (): Omit<ComputeUnit, 'uc_fp'> => ({
  cloud: 'aws', db: '', rut: '', cliente: '', alias: '',
  type: 'subscription',
  starts: new Date().toISOString().slice(0, 16),
  expires: new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 16),
});

// ── Página ────────────────────────────────────────────────────────────────────

export default function PartnerPage() {
  const { user, isLoading } = useSession();

  const [query, setQuery]           = useState('');
  const [buscando, setBuscando]     = useState(false);
  const [partner, setPartner]       = useState<PartnerData | null>(null);
  const [searchError, setSearchError] = useState('');

  const [nuevasUCs, setNuevasUCs]   = useState<Omit<ComputeUnit, 'uc_fp'>[]>([]);
  const [formUC, setFormUC]         = useState(ucVacia());

  const [generando, setGenerando]   = useState(false);
  const [licGenerada, setLicGenerada] = useState<{ content: string; partner: string } | null>(null);
  const [genError, setGenError]     = useState('');

  // ── SII autocomplete ────────────────────────────────────────────────────────
  const [siiStatus, setSiiStatus]   = useState<'idle' | 'loading' | 'found' | 'not_found'>('idle');
  const siiDebounce                 = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const rut = formUC.rut.trim();
    if (!rut || rut.length < 8) { setSiiStatus('idle'); return; }

    if (siiDebounce.current) clearTimeout(siiDebounce.current);
    setSiiStatus('loading');

    siiDebounce.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/empresas-sii?rut=${encodeURIComponent(rut)}`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setFormUC(p => ({ ...p, cliente: data.razonSocial }));
          setSiiStatus('found');
        } else {
          setSiiStatus('not_found');
        }
      } catch {
        setSiiStatus('idle');
      }
    }, 500);
  }, [formUC.rut]);
  // ── fin SII ──────────────────────────────────────────────────────────────────

  if (isLoading) return (
    <div className="flex items-center gap-2 p-8 text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" /> Cargando...
    </div>
  );

  if (!user || user.role !== 'admin_global') {
    return <div className="p-4 bg-red-100 text-red-700 rounded">Acceso denegado.</div>;
  }

  // ── Buscar partner ──────────────────────────────────────────────────────────
  async function handleBuscar() {
    if (query.length < 2) return;
    setBuscando(true);
    setSearchError('');
    setPartner(null);
    setNuevasUCs([]);
    setLicGenerada(null);

    try {
      const res = await fetch(`/api/op-licencias/partner?q=${encodeURIComponent(query)}`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) setPartner(data);
      else setSearchError(data.message);
    } catch {
      setSearchError('Error de conexión.');
    } finally {
      setBuscando(false);
    }
  }

  // ── Agregar UC al formulario ────────────────────────────────────────────────
  function handleAgregarUC() {
    if (!formUC.db || !formUC.rut || !formUC.cliente || !formUC.alias) {
      return;
    }
    if (formUC.type === 'subscription' && !formUC.expires) return;
    setNuevasUCs(prev => [...prev, { ...formUC }]);
    setFormUC(ucVacia());
  }

  function handleEliminarUC(idx: number) {
    setNuevasUCs(prev => prev.filter((_, i) => i !== idx));
  }

  // ── Agregar UCs de una solicitud pendiente ──────────────────────────────────
  function handleAgregarSolicitud(sol: SolicitudPendiente) {
    const yaExisten = nuevasUCs.map(u => u.db);
    const nuevas = sol.compute_units.filter(u => !yaExisten.includes(u.db));
    setNuevasUCs(prev => [...prev, ...nuevas]);
  }

  // ── Generar nuevo .lic ──────────────────────────────────────────────────────
  async function handleGenerar() {
    if (!partner) return;
    setGenerando(true);
    setGenError('');
    setLicGenerada(null);

    // UCs acumulativas: las existentes vigentes + las nuevas
    const ucsExistentes = partner.compute_units.filter(uc => {
      if (uc.type === 'perpetual') return true;
      return uc.expires ? new Date(uc.expires) > new Date() : false;
    });

    const todasUCs = [...ucsExistentes, ...nuevasUCs];

    if (todasUCs.length === 0) {
      setGenError('No hay unidades de cómputo para incluir en la licencia.');
      setGenerando(false);
      return;
    }

    try {
      const res = await fetch('/api/op-licencias/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          partner:       partner.partner,
          rut:           partner.rut,
          solicitante:   user.username || user.email,
          fingerprint:   partner.fingerprint,
          compute_units: todasUCs,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setLicGenerada({ content: data.lic_content, partner: partner.partner });
        setNuevasUCs([]);
        // Refrescar datos del partner
        handleBuscar();
      } else {
        setGenError(`Error: ${data.error}`);
      }
    } catch {
      setGenError('Error de conexión.');
    } finally {
      setGenerando(false);
    }
  }

  function downloadLic(content: string, partnerName: string) {
    const slug = partnerName
      .toLowerCase().normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '_').slice(0, 20);
    const date = new Date().toISOString().slice(0, 10);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([content], { type: 'text/plain' }));
    a.download = `cloudperformance_${slug}_${date}.lic`;
    a.click();
  }

  return (
    <section className="px-4 py-8 space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/op-licencias" className="text-muted-foreground hover:text-foreground transition">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-semibold">Gestión de Partner</h2>
          <p className="text-sm text-muted-foreground">
            Busca un partner para gestionar sus unidades de cómputo licenciadas.
          </p>
        </div>
      </div>

      {/* Buscador */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleBuscar()}
            placeholder="Buscar por nombre o RUT del partner..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleBuscar}
          disabled={buscando || query.length < 2}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
        >
          {buscando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Buscar
        </button>
      </div>

      {searchError && (
        <div className="p-4 bg-red-500/10 border border-red-300 text-red-600 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />{searchError}
        </div>
      )}

      {/* Resultado */}
      {partner && (
        <>
          {/* Info del partner */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <CardTitle className="text-base">{partner.partner}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">RUT: {partner.rut}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Última licencia: {new Date(partner.ultima_licencia_at).toLocaleDateString('es-CL')} · por {partner.generado_por}
                  </p>
                  <p className="font-mono text-xs text-muted-foreground mt-1">
                    FP: {partner.fingerprint}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                UCs licenciadas actualmente
              </p>
              {partner.compute_units.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin unidades de cómputo registradas.</p>
              ) : (
                <div className="space-y-2">
                  {partner.compute_units.map((uc, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition flex-wrap">
                      <CloudBadge cloud={uc.cloud} />
                      <span className="text-sm font-medium flex-1">{uc.alias}</span>
                      <span className="text-xs text-muted-foreground">{uc.cliente}</span>
                      <span className="text-xs font-mono text-muted-foreground">{uc.db}</span>
                      <EstadoBadge uc={uc} />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Solicitudes pendientes */}
          {partner.solicitudes_pendientes.length > 0 && (
            <Card className="shadow-sm border-amber-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-600" />
                  Solicitudes pendientes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {partner.solicitudes_pendientes.map(sol => (
                  <div key={sol._id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-200 flex-wrap">
                    <div>
                      <p className="text-sm font-medium">
                        {new Date(sol.fecha_solicitud).toLocaleDateString('es-CL')} — {sol.solicitante}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {sol.compute_units.length} unidad{sol.compute_units.length !== 1 ? 'es' : ''} de cómputo
                      </p>
                    </div>
                    <button
                      onClick={() => handleAgregarSolicitud(sol)}
                      className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-xl text-xs font-medium hover:bg-amber-700 transition"
                    >
                      <Plus className="h-3 w-3" /> Agregar UCs
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Agregar UC manual */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Plus className="h-4 w-4" /> Agregar UC manualmente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Nube</label>
                  <select
                    value={formUC.cloud}
                    onChange={e => setFormUC(p => ({ ...p, cloud: e.target.value as 'aws'|'azure'|'gcp' }))}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="aws">AWS</option>
                    <option value="azure">Azure</option>
                    <option value="gcp">GCP</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">DB</label>
                  <input
                    value={formUC.db}
                    onChange={e => setFormUC(p => ({ ...p, db: e.target.value }))}
                    placeholder="nombre_bd"
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    RUT Cliente
                    {siiStatus === 'loading' && <span className="ml-2 text-muted-foreground">buscando...</span>}
                    {siiStatus === 'found'   && <span className="ml-2 text-green-600">✓ SII</span>}
                    {siiStatus === 'not_found' && <span className="ml-2 text-red-500">No encontrado en SII</span>}
                  </label>
                  <input
                    value={formUC.rut}
                    onChange={e => { setFormUC(p => ({ ...p, rut: e.target.value, cliente: '' })); setSiiStatus('idle'); }}
                    placeholder="76.xxx.xxx-x"
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Cliente
                    {siiStatus === 'found' && <span className="ml-2 text-xs text-muted-foreground">(autocompletado)</span>}
                  </label>
                  <input
                    value={formUC.cliente}
                    onChange={e => setFormUC(p => ({ ...p, cliente: e.target.value }))}
                    placeholder={siiStatus === 'loading' ? 'Buscando en SII...' : 'Nombre empresa'}
                    readOnly={siiStatus === 'found'}
                    className={`w-full border border-border rounded-lg px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-blue-500 ${siiStatus === 'found' ? 'bg-green-500/5 text-green-700 cursor-not-allowed' : ''}`}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Alias</label>
                  <input
                    value={formUC.alias}
                    onChange={e => setFormUC(p => ({ ...p, alias: e.target.value }))}
                    placeholder="Nombre descriptivo"
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Tipo</label>
                  <select
                    value={formUC.type}
                    onChange={e => setFormUC(p => ({ ...p, type: e.target.value as 'subscription'|'perpetual', expires: e.target.value === 'perpetual' ? null : p.expires }))}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="subscription">Suscripción</option>
                    <option value="perpetual">Perpetua</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Inicio</label>
                  <input
                    type="datetime-local"
                    value={formUC.starts}
                    onChange={e => setFormUC(p => ({ ...p, starts: e.target.value }))}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {formUC.type === 'subscription' && (
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Vencimiento</label>
                    <input
                      type="datetime-local"
                      value={formUC.expires || ''}
                      onChange={e => setFormUC(p => ({ ...p, expires: e.target.value }))}
                      className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>
              <button
                onClick={handleAgregarUC}
                disabled={!formUC.db || !formUC.rut || !formUC.cliente || !formUC.alias}
                className="mt-4 flex items-center gap-2 border border-border bg-card px-5 py-2 rounded-xl text-sm font-medium hover:bg-muted transition disabled:opacity-50"
              >
                <Plus className="h-4 w-4" /> Agregar UC
              </button>
            </CardContent>
          </Card>

          {/* UCs nuevas agregadas */}
          {nuevasUCs.length > 0 && (
            <Card className="shadow-sm border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  UCs a agregar al nuevo .lic ({nuevasUCs.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {nuevasUCs.map((uc, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-blue-500/5 border border-blue-100 flex-wrap">
                    <CloudBadge cloud={uc.cloud} />
                    <span className="text-sm font-medium flex-1">{uc.alias}</span>
                    <span className="text-xs text-muted-foreground">{uc.cliente}</span>
                    <span className="text-xs font-mono text-muted-foreground">{uc.db}</span>
                    <Badge className="bg-blue-500/10 text-blue-600 border-blue-200">
                      {uc.type === 'perpetual' ? '∞ Perpetua' : 'Suscripción'}
                    </Badge>
                    <button
                      onClick={() => handleEliminarUC(i)}
                      className="text-red-400 hover:text-red-600 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
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

          {genError && (
            <div className="p-4 bg-red-500/10 border border-red-300 text-red-600 rounded-xl text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />{genError}
            </div>
          )}

          {/* Botón generar */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleGenerar}
              disabled={generando}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {generando
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <ShieldCheck className="h-4 w-4" />
              }
              Generar nuevo .lic
            </button>
          </div>
        </>
      )}
    </section>
  );
}