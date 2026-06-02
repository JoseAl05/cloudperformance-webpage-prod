'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from '@/hooks/useSession';
import { ArrowLeft, Loader2, Download, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface LicenciaHistorial {
  _id: string;
  partner: string;
  generado_por: string;
  generado_at: string;
  usuarios: { id: string; email: string; starts: string; expires: string }[];
  lic_hash: string;
  lic_content: string;
  version: string;
}

export default function HistorialPage() {
  const { user, isLoading } = useSession();
  const [licencias, setLicencias] = useState<LicenciaHistorial[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');

  useEffect(() => {
    if (!user) return;
    fetch('/api/op-licencias/historial', { credentials: 'include' })
      .then(r => r.json())
      .then(data => setLicencias(data))
      .catch(() => setError('Error al cargar historial.'))
      .finally(() => setLoading(false));
  }, [user]);

  function downloadLic(content: string, partner: string, fecha: string) {
    const slug = partner.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'_').slice(0,20);
    const date = new Date(fecha).toISOString().slice(0,10);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([content], { type: 'text/plain' }));
    a.download = `cloudperformance_${slug}_${date}.lic`;
    a.click();
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
      <div className="flex items-center gap-3">
        <Link href="/op-licencias" className="text-muted-foreground hover:text-foreground transition">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-semibold">Historial de Entregas</h2>
          <p className="text-sm text-muted-foreground">Registro de todos los archivos .lic generados.</p>
        </div>
      </div>

      {error && <div className="p-4 bg-red-500/10 border border-red-300 text-red-600 rounded-xl text-sm">{error}</div>}

      {licencias.length === 0 && (
        <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
          <ShieldCheck className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No hay licencias generadas aún.</p>
        </div>
      )}

      {licencias.map(lic => (
        <Card key={lic._id} className="shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <CardTitle className="text-base">{lic.partner}</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Generado por {lic.generado_por} · {new Date(lic.generado_at).toLocaleString('es-CL')}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {lic.usuarios.length} usuarios · Hash: {lic.lic_hash.slice(0,16)}...
                </p>
              </div>
              <button
                onClick={() => downloadLic(lic.lic_content, lic.partner, lic.generado_at)}
                className="flex items-center gap-2 border border-border bg-card px-4 py-2 rounded-xl text-sm font-medium hover:bg-muted transition"
              >
                <Download className="h-4 w-4" />
                Re-descargar .lic
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {lic.usuarios.map(u => (
                <div key={u.id} className="flex items-center gap-2 text-xs text-muted-foreground p-2 rounded-lg bg-muted/30">
                  <ShieldCheck className="h-3 w-3 shrink-0 text-green-500" />
                  <span className="truncate">{u.email}</span>
                  <span className="shrink-0 text-xs">→ {new Date(u.expires).toLocaleDateString('es-CL')}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}