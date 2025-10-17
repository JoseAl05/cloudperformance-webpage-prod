"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import {
  CircleDollarSign,
  Pencil,
  Trash2,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
  TrendingUp,
  Building2,
} from "lucide-react";

interface CentroCosto {
  id_centro_costo: number;
  nombre_centro: string;
  responsable_centro: string;
  localizacion: string;
}

export interface PresupuestoMensual {
  id_presupuesto_mensual: number;
  mes: number;
  anio: number;
  monto_mensual_asociado: string;
  monto_real_mes: string;
  monto_forecast_mes: string;
}

export interface PresupuestoAnual {
  id_presupuesto_anual: number;
  id_centro_costo: number;
  anio: number;
  monto_anual_asociado: string;
  presupuestos_mensuales: PresupuestoMensual[] | null;
}

export interface PresupuestoAnualMensual {
  id_centro_costo: number;
  nombre_centro: string;
  id_presupuesto_anual: number;
  id_presupuesto_mensual: number;
  mes: number;
  anio: number;
  monto_mensual_asociado: string;
  monto_real_mes: string;
  monto_forecast_mes: string;
}

interface PresupuestoMensualTableComponentProps {
  cloud?: string;
  onEdit?: (data: PresupuestoAnualMensual) => void;
  onDelete?: (id: number | string) => void;
}

type SortField = keyof PresupuestoAnualMensual | null;
type SortOrder = "asc" | "desc" | null;

const MES_LETRAS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const fetcher = (url: string) =>
  fetch(url, { method: "GET", headers: { "Content-Type": "application/json" } }).then((r) => r.json());

export const PresupuestoMensualTableComponent = ({
  cloud,
  onEdit,
  onDelete,
}: PresupuestoMensualTableComponentProps) => {
  const { data, error } = useSWR<PresupuestoAnual[]>(
    cloud ? `/api/presupuesto/bridge/${cloud}/presupuesto/anual` : null,
    fetcher,
    { revalidateOnFocus: true, revalidateOnReconnect: true, revalidateIfStale: true }
  );

  // Fetch centros de costo
  const { data: centrosCosto } = useSWR<CentroCosto[]>(
    cloud ? `/api/presupuesto/bridge/${cloud}/centro-costo` : null,
    fetcher
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  console.log(data)
  console.log(centrosCosto)

  // Transformar datos anuales a lista plana con nombre del centro
  const presupuestos: PresupuestoAnualMensual[] = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.flatMap((anual) =>
      (anual.presupuestos_mensuales || []).map((mensual) => {
        const centro = centrosCosto?.find(c => c.id_centro_costo === anual.id_centro_costo);
        return {
          id_centro_costo: anual.id_centro_costo,
          nombre_centro: centro?.nombre_centro ?? "—",
          id_presupuesto_anual: anual.id_presupuesto_anual,
          id_presupuesto_mensual: mensual.id_presupuesto_mensual,
          mes: mensual.mes,
          anio: anual.anio,
          monto_mensual_asociado: mensual.monto_mensual_asociado,
          monto_real_mes: mensual.monto_real_mes,
          monto_forecast_mes: mensual.monto_forecast_mes,
        };
      })
    );
  }, [data, centrosCosto]);

  console.log(presupuestos)

  const handleSort = (field: keyof PresupuestoAnualMensual) => {
    if (sortField === field) {
      if (sortOrder === "asc") {
        setSortOrder("desc");
      } else if (sortOrder === "desc") {
        setSortField(null);
        setSortOrder(null);
      } else {
        setSortOrder("asc");
      }
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const getSortIcon = (field: keyof PresupuestoAnualMensual) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 opacity-40" />;
    }
    if (sortOrder === "asc") {
      return <ArrowUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    }
    return <ArrowDown className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
  };

  const filteredAndSortedData = useMemo(() => {
    const filtered = presupuestos.filter((p) => {
      const search = searchTerm.toLowerCase();
      return (
        p.id_centro_costo.toString().includes(search) ||
        p.nombre_centro.toLowerCase().includes(search) ||
        p.id_presupuesto_anual.toString().includes(search) ||
        p.id_presupuesto_mensual.toString().includes(search) ||
        MES_LETRAS[p.mes - 1].toLowerCase().includes(search) ||
        p.anio.toString().includes(search) ||
        p.monto_mensual_asociado.toLowerCase().includes(search) ||
        p.monto_real_mes.toLowerCase().includes(search) ||
        p.monto_forecast_mes.toLowerCase().includes(search)
      );
    });

    if (sortField && sortOrder) {
      filtered.sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;
        
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
        }
        
        // Para strings numéricos (montos)
        if (["monto_mensual_asociado", "monto_real_mes", "monto_forecast_mes"].includes(sortField)) {
          const aNum = parseFloat(String(aVal));
          const bNum = parseFloat(String(bVal));
          return sortOrder === "asc" ? aNum - bNum : bNum - aNum;
        }
        
        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        
        if (sortOrder === "asc") {
          return aStr.localeCompare(bStr);
        } else {
          return bStr.localeCompare(aStr);
        }
      });
    }

    return filtered;
  }, [presupuestos, searchTerm, sortField, sortOrder]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedData.slice(startIndex, endIndex);
  }, [filteredAndSortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    return num.toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  if (!data && !error) {
    return (
      <div className="flex justify-center items-center p-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
        <span className="ml-4 text-gray-600 dark:text-gray-300 font-medium">Cargando datos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Error al cargar datos: {error.message}</span>
        </div>
      </div>
    );
  }

  if (presupuestos.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-12 text-center">
        <CircleDollarSign className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No hay presupuestos mensuales disponibles</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Los datos aparecerán aquí una vez que se carguen</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Search Bar */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por centro de costo, mes, año o montos..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-gray-700 dark:text-gray-300 text-sm font-medium whitespace-nowrap">Mostrar:</label>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
        {searchTerm && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Mostrando {filteredAndSortedData.length} de {presupuestos.length} registros
          </p>
        )}
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto" style={{ minHeight: '500px', maxHeight: '600px' }}>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900/50 sticky top-0 z-10">
            <tr>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors select-none"
                onClick={() => handleSort("nombre_centro")}
              >
                <div className="flex items-center gap-2">
                  Centro de Costo
                  {getSortIcon("nombre_centro")}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors select-none"
                onClick={() => handleSort("mes")}
              >
                <div className="flex items-center gap-2">
                  Mes
                  {getSortIcon("mes")}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors select-none"
                onClick={() => handleSort("anio")}
              >
                <div className="flex items-center gap-2">
                  Año
                  {getSortIcon("anio")}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors select-none"
                onClick={() => handleSort("monto_mensual_asociado")}
              >
                <div className="flex items-center gap-2">
                  Monto Asociado
                  {getSortIcon("monto_mensual_asociado")}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors select-none"
                onClick={() => handleSort("monto_real_mes")}
              >
                <div className="flex items-center gap-2">
                  Monto Real
                  {getSortIcon("monto_real_mes")}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors select-none"
                onClick={() => handleSort("monto_forecast_mes")}
              >
                <div className="flex items-center gap-2">
                  Monto Forecast
                  {getSortIcon("monto_forecast_mes")}
                </div>
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 font-medium">No se encontraron resultados</p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Intenta con otros términos de búsqueda</p>
                </td>
              </tr>
            ) : (
              paginatedData.map((p) => (
                <tr
                  key={p.id_presupuesto_mensual}
                  className="hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {p.nombre_centro}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                        {MES_LETRAS[p.mes - 1]}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-1 inline-flex">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {p.anio}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {formatCurrency(p.monto_mensual_asociado)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency(p.monto_real_mes)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                        {formatCurrency(p.monto_forecast_mes)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEdit && onEdit(p)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-150 font-medium text-sm"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                        Editar
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete && onDelete(p.id_presupuesto_mensual);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors duration-150 font-medium text-sm"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer con Pagination */}
      <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Mostrando <span className="font-semibold text-gray-900 dark:text-gray-100">{((currentPage - 1) * itemsPerPage) + 1}</span> a <span className="font-semibold text-gray-900 dark:text-gray-100">{Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)}</span> de <span className="font-semibold text-gray-900 dark:text-gray-100">{filteredAndSortedData.length}</span> registros
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex gap-1">
              {getPageNumbers().map((page, index) => (
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500 dark:text-gray-400">...</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page as number)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                )
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresupuestoMensualTableComponent;