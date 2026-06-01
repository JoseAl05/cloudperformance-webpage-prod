'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSession } from '@/hooks/useSession';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Building2, ChevronDown, ChevronRight, Loader2, UserCheck, UserPlus } from 'lucide-react';
import Link from 'next/link';

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

function SolicitudesContent() {
  const { user, isLoading } = useSession();
  const searchParams = useSearchParams();
  const partner = searchParams.get('partner') || '';

  const [empresaGroups, setEmpresaGroups] = useState<EmpresaGroup[]>([]);
  const [expandedEmpresas, setExpandedEmpresas] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // Cargar datos del sessionStorage — el CSV parseado en la página anterior
  useEffect(() => {
    const raw = sessionStorage.getItem('op_csv_users');
    if (!raw) return;
    const users: CSVUser[] = JSON.parse(raw);

    // Agrupar por empresa
    const grouped = new Map<string, EmpresaGroup>();
    users.forEach(u => {
      if (!grouped.has(u.empresa)) {
        grouped.set(u.empresa, { nombre: u.empresa, nuevos: [], existentes: [] });
      }
      // Por ahora todos son nuevos hasta que tengamos la API
      grouped.get(u.empresa)!.nuevos.push(u);
    });

    setEmpresaGroups(Array.from(grouped.values()));
  }, []);

  function toggleEmpresa(nombre: string) {
    setExpandedEmpresas(prev => {
      const next = new Set(prev);
      next.has(nombre) ? next.delete(nombre) : next.add(nombre);
      return next;
    });
  }

  if (isLoading) return (
    <div className="flex items-center gap-2 p-8 text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" /> Cargando...
    </div>
  );

  if (!user || user.role !== 'admin_global') {
    return <div className="p-4 bg-red-100 text-red-700 rounded">Acceso denegado.</div>;
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-8">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/op-licencias/importar" className="text-muted-foreground hover:text-foreground transition">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-semibold">Revisar Solicitud</h2>
          <p className="text-sm text-muted-foreground">
            Partner: <span className="font-medium text-foreground">{partner}</span>
          </p>
        </div>
      </div>

      {empresaGroups.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
          <p className="text-sm">No hay datos cargados.</p>
          <Link href="/op-licencias/importar" className="text-blue-600 text-sm hover:underline mt-2 inline-block">
            ← Volver a importar CSV
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {empresaGroups.map(empresa => {
            const isExpanded = expandedEmpresas.has(empresa.nombre);
            const totalNuevos    = empresa.nuevos.length;
            const totalExistentes = empresa.existentes.length;

            return (
              <div key={empresa.nombre} className="rounded-2xl border bg-card shadow-sm overflow-hidden">

                {/* Header empresa */}
                <button
                  onClick={() => toggleEmpresa(empresa.nombre)}
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition"
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold">{empresa.nombre}</span>
                    <div className="flex items-center gap-2">
                      {totalNuevos > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-600">
                          {totalNuevos} nuevo{totalNuevos !== 1 ? 's' : ''}
                        </span>
                      )}
                      {totalExistentes > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600">
                          {totalExistentes} existente{totalExistentes !== 1 ? 's' : ''}
                        </span>
                      )}
                      {totalNuevos === 0 && totalExistentes === 0 && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                          Sin cambios
                        </span>
                      )}
                    </div>
                  </div>
                  {isExpanded
                    ? <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    : <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  }
                </button>

                {/* Detalle expandido */}
                {isExpanded && (
                  <div className="border-t divide-y divide-border">

                    {/* Usuarios existentes */}
                    {empresa.existentes.length > 0 && (
                      <div className="p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                          <UserCheck className="h-3.5 w-3.5" /> Usuarios Existentes
                        </p>
                        <div className="space-y-2">
                          {empresa.existentes.map(u => (
                            <div key={u.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="text-amber-500">✓</span>
                              <span>{u.email}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Usuarios nuevos */}
                    {empresa.nuevos.length > 0 && (
                      <div className="p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                          <UserPlus className="h-3.5 w-3.5" /> Usuarios Nuevos
                        </p>
                        <div className="space-y-2">
                          {empresa.nuevos.map(u => (
                            <div key={u.id} className="flex items-center gap-2 text-sm">
                              <span className="text-green-500">🟢</span>
                              <span>{u.email}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Botón continuar */}
      {empresaGroups.length > 0 && (
        <div className="flex justify-end mt-6">
          <Link
            href={`/op-licencias/generar?partner=${encodeURIComponent(partner)}`}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition"
          >
            Generar Licencias →
          </Link>
        </div>
      )}

    </section>
  );
}

export default function SolicitudesPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center gap-2 p-8 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Cargando...
      </div>
    }>
      <SolicitudesContent />
    </Suspense>
  );
}