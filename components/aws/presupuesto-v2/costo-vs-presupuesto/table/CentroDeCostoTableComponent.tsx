"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import { CircleDollarSign, Pencil, Trash2, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";

interface CentroCosto {
  id_centro_costo: number;
  nombre_centro: string;
  responsable_centro: string;
  localizacion: string;
}

interface CentroDeCostoTableComponentProps {
  cloud?: string;
  onEdit?: (data: CentroCosto) => void;
  onDelete?: (id: number | string) => void;
}

type SortField = keyof CentroCosto | null;
type SortOrder = "asc" | "desc" | null;

const fetcher = (url: string) =>
  fetch(url, { method: "GET", headers: { "Content-Type": "application/json" } })
    .then((r) => r.json());

export const CentroDeCostoTableComponent = ({ cloud = "gcp", onEdit, onDelete }: CentroDeCostoTableComponentProps) => {
  const { data, error, isLoading } = useSWR<CentroCosto[]>(
    cloud ? `/api/presupuesto/bridge/${cloud}/centro-costo` : null,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: true, revalidateIfStale: true }
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleSort = (field: keyof CentroCosto) => {
    if (sortField === field) {
      if (sortOrder === "asc") setSortOrder("desc");
      else if (sortOrder === "desc") { setSortField(null); setSortOrder(null); }
      else setSortOrder("asc");
    } else {
      setSortField(field); setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const getSortIcon = (field: keyof CentroCosto) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 opacity-40" />;
    return sortOrder === "asc" ? <ArrowUp className="w-4 h-4 text-blue-600 dark:text-blue-400" /> : <ArrowDown className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
  };

  const filteredAndSortedData = useMemo(() => {
    const centros: CentroCosto[] = Array.isArray(data) ? data : [];
    const filtered = centros.filter((centro) => {
      const search = searchTerm.toLowerCase();
      return (
        centro.id_centro_costo.toString().includes(search) ||
        centro.nombre_centro.toLowerCase().includes(search) ||
        centro.responsable_centro?.toLowerCase().includes(search) ||
        centro.localizacion?.toLowerCase().includes(search)
      );
    });

    if (sortField && sortOrder) {
      filtered.sort((a, b) => {
        const aVal = a[sortField]; const bVal = b[sortField];
        if (aVal == null) return 1; if (bVal == null) return -1;
        if (typeof aVal === "number" && typeof bVal === "number") return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
        const aStr = String(aVal).toLowerCase(); const bStr = String(bVal).toLowerCase();
        return sortOrder === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
      });
    }
    return filtered;
  }, [data, searchTerm, sortField, sortOrder]);

  const paginatedData = useMemo(() => filteredAndSortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [filteredAndSortedData, currentPage, itemsPerPage]);
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  if (!data && !error) return (
    <div className="flex justify-center items-center p-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
      <span className="ml-4 text-gray-600 dark:text-gray-300 font-medium">Cargando datos...</span>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-6 rounded-lg shadow-md">
      <span className="font-medium">Error al cargar datos: {error.message}</span>
    </div>
  );

  if (!Array.isArray(data) || data.length === 0) return (
    <div className="bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-12 text-center">
      <CircleDollarSign className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
      <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No hay centros de costo disponibles en GCP</p>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar centros..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer" onClick={() => handleSort("id_centro_costo")}>
                <div className="flex items-center gap-2">ID {getSortIcon("id_centro_costo")}</div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer" onClick={() => handleSort("nombre_centro")}>
                <div className="flex items-center gap-2">Nombre {getSortIcon("nombre_centro")}</div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer" onClick={() => handleSort("responsable_centro")}>
                <div className="flex items-center gap-2">Responsable {getSortIcon("responsable_centro")}</div>
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedData.map((centro) => (
              <tr key={centro.id_centro_costo} className="hover:bg-blue-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4 whitespace-nowrap"><div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg px-3 py-1 inline-block text-blue-600 font-semibold">{centro.id_centro_costo}</div></td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{centro.nombre_centro}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">{centro.responsable_centro || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => onEdit && onEdit(centro)} className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200" title="Editar"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => onDelete && onDelete(centro.id_centro_costo)} className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CentroDeCostoTableComponent;