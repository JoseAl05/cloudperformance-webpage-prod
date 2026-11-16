'use client';

import { useMemo, useState } from 'react';
import useSWR, { mutate } from 'swr';
import { AlertCircle, Loader2, Network, Search } from 'lucide-react';

import { fetcher } from '@/lib/fetcher';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface CostCenter {
  id_centro_costo: number;
  nombre_centro: string;
}

interface ResourceAssignment {
  resource_key: string;
  host_name?: string | null;
  ip_address?: string | null;
  cost_center_ids: number[];
  business_units: string[];
  last_seen?: string | null;
}

const ASSIGNMENTS_URL = '/api/presupuesto/bridge/vcenter/resource-assignments/';
const COST_CENTERS_URL = '/api/presupuesto/bridge/vcenter/centro-costo';

export function ResourceAssignmentsComponent() {
  const { data: resources, error: resourcesError, isLoading: resourcesLoading } = useSWR<ResourceAssignment[]>(ASSIGNMENTS_URL, fetcher);
  const { data: costCenters, error: costCentersError, isLoading: centersLoading } = useSWR<CostCenter[]>(COST_CENTERS_URL, fetcher);
  const [search, setSearch] = useState('');
  const [selectedResource, setSelectedResource] = useState<ResourceAssignment | null>(null);
  const [selectedCenterIds, setSelectedCenterIds] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const filteredResources = useMemo(() => {
    const term = search.trim().toLocaleLowerCase();
    if (!term) return resources ?? [];
    return (resources ?? []).filter((resource) =>
      [resource.resource_key, resource.host_name, resource.ip_address, ...(resource.business_units ?? [])]
        .filter(Boolean)
        .some((value) => String(value).toLocaleLowerCase().includes(term))
    );
  }, [resources, search]);

  const centersById = useMemo(
    () => new Map((costCenters ?? []).map((center) => [center.id_centro_costo, center.nombre_centro])),
    [costCenters]
  );

  const openAssignment = (resource: ResourceAssignment) => {
    setSelectedResource(resource);
    setSelectedCenterIds(resource.cost_center_ids ?? []);
    setMessage(null);
  };

  const toggleCenter = (id: number, checked: boolean) => {
    setSelectedCenterIds((current) =>
      checked ? Array.from(new Set([...current, id])) : current.filter((item) => item !== id)
    );
  };

  const saveAssignment = async () => {
    if (!selectedResource) return;
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch(ASSIGNMENTS_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host_name: selectedResource.host_name,
          ip_address: selectedResource.ip_address,
          cost_center_ids: selectedCenterIds,
        }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null) as { detail?: string } | null;
        throw new Error(body?.detail || 'No fue posible guardar la asignación.');
      }
      await mutate(ASSIGNMENTS_URL);
      setSelectedResource(null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No fue posible guardar la asignación.');
    } finally {
      setSaving(false);
    }
  };

  if (resourcesLoading || centersLoading) {
    return <div className="flex min-h-48 items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-blue-600" /></div>;
  }

  if (resourcesError || costCentersError) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
        <AlertCircle className="h-5 w-5" />
        No fue posible cargar los recursos o centros de costo de vCenter.
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="flex flex-col gap-4 border-b p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold"><Network className="h-5 w-5 text-blue-600" />Recursos disponibles</h2>
            <p className="text-sm text-muted-foreground">El host identifica el recurso; la IP se utiliza como respaldo.</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar host, IP o unidad" className="pl-9" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Host</th>
                <th className="px-5 py-3">Dirección IP</th>
                <th className="px-5 py-3">Unidad de negocio</th>
                <th className="px-5 py-3">Centros de costo</th>
                <th className="px-5 py-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredResources.map((resource) => (
                <tr key={resource.resource_key} className="hover:bg-muted/30">
                  <td className="px-5 py-4 font-medium">{resource.host_name || 'Sin host'}</td>
                  <td className="px-5 py-4 text-muted-foreground">{resource.ip_address || 'Sin IP'}</td>
                  <td className="px-5 py-4">{resource.business_units?.join(', ') || 'Sin unidad'}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {resource.cost_center_ids.length > 0
                        ? resource.cost_center_ids.map((id) => <span key={id} className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700 dark:bg-blue-950 dark:text-blue-300">{centersById.get(id) || `ID ${id}`}</span>)
                        : <span className="text-muted-foreground">Sin asignar</span>}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right"><Button variant="outline" size="sm" onClick={() => openAssignment(resource)}>Asignar</Button></td>
                </tr>
              ))}
              {filteredResources.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-muted-foreground">No se encontraron recursos.</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={Boolean(selectedResource)} onOpenChange={(open) => !open && setSelectedResource(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Asignar centros de costo</DialogTitle>
            <DialogDescription>{selectedResource?.host_name || selectedResource?.ip_address}</DialogDescription>
          </DialogHeader>
          <div className="max-h-72 space-y-2 overflow-y-auto py-2">
            {(costCenters ?? []).map((center) => (
              <label key={center.id_centro_costo} className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-muted/40">
                <Checkbox checked={selectedCenterIds.includes(center.id_centro_costo)} onCheckedChange={(value) => toggleCenter(center.id_centro_costo, value === true)} />
                <span className="font-medium">{center.nombre_centro}</span>
                <span className="ml-auto text-xs text-muted-foreground">ID {center.id_centro_costo}</span>
              </label>
            ))}
            {(costCenters ?? []).length === 0 ? <p className="py-6 text-center text-sm text-muted-foreground">Primero debes crear un centro de costo.</p> : null}
          </div>
          {message ? <p className="text-sm text-red-600">{message}</p> : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedResource(null)} disabled={saving}>Cancelar</Button>
            <Button onClick={saveAssignment} disabled={saving}>{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Guardar asignación</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
