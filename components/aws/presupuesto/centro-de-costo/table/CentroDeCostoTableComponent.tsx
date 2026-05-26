"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import { CircleDollarSign, Pencil, Trash2, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Tag } from "lucide-react";

interface CentroCosto {
  id_centro_costo: number;
  nombre_centro: string;
  responsable_centro: string;
  localizacion: string;
  tags?: string[];
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

export const CentroDeCostoTableComponent = ({ cloud, onEdit, onDelete }: CentroDeCostoTableComponentProps) => {
  const { data, error, isLoading } = useSWR<CentroCosto[]>(
    cloud ? `/api/presupuesto/bridge/${cloud}/centro-costo` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      revalidateIfStale: true,
    }
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleSort = (field: keyof CentroCosto) => {
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

  const getSortIcon = (field: keyof CentroCosto) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 opacity-40" />;
    }
    if (sortOrder === "asc") {
      return <ArrowUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    }
    return <ArrowDown className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
  };

  const filteredAndSortedData = useMemo(() => {
    const centros: CentroCosto[] = Array.isArray(data) ? data : [];
    
    const filtered = centros.filter((centro) => {
      const search = searchTerm.toLowerCase();
      const tagsString = centro.tags?.join(" ").toLowerCase() || "";
      return (
        centro.id_centro_costo.toString().includes(search) ||
        centro.nombre_centro.toLowerCase().includes(search) ||
        centro.responsable_centro?.toLowerCase().includes(search) ||
        centro.localizacion?.toLowerCase().includes(search) ||
        tagsString.includes(search)
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
  }, [data, searchTerm, sortField, sortOrder]);

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

  const centros: CentroCosto[] = Array.isArray(data) ? data : [];

  if (centros.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-12 text-center">
        <CircleDollarSign className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No hay centros de costo disponibles</p>
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
              placeholder="Buscar por ID, nombre, responsable, localización o tags..."
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
            Mostrando {filteredAndSortedData.length} de {centros.length} registros
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
                onClick={() => handleSort("id_centro_costo")}
              >
                <div className="flex items-center gap-2">
                  ID Centro
                  {getSortIcon("id_centro_costo")}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors select-none"
                onClick={() => handleSort("nombre_centro")}
              >
                <div className="flex items-center gap-2">
                  Nombre
                  {getSortIcon("nombre_centro")}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors select-none"
                onClick={() => handleSort("responsable_centro")}
              >
                <div className="flex items-center gap-2">
                  Responsable
                  {getSortIcon("responsable_centro")}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors select-none"
                onClick={() => handleSort("localizacion")}
              >
                <div className="flex items-center gap-2">
                  Localización
                  {getSortIcon("localizacion")}
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Tags
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
                <td colSpan={6} className="px-6 py-12 text-center">
                  <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 font-medium">No se encontraron resultados</p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Intenta con otros términos de búsqueda</p>
                </td>
              </tr>
            ) : (
              paginatedData.map((centro) => (
                <tr
                  key={centro.id_centro_costo}
                  className="hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg px-3 py-1 flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                          {centro.id_centro_costo}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{centro.nombre_centro}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600 dark:text-gray-400">{centro.responsable_centro || "-"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600 dark:text-gray-400">{centro.localizacion || "-"}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5 max-w-xs">
                      {centro.tags && centro.tags.length > 0 ? (
                        centro.tags.slice(0, 3).map((tag, index) => {
                          const [key, value] = tag.includes(':') ? tag.split(':') : [tag, null];
                          return (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-md text-xs font-medium"
                              title={tag}
                            >
                              {value ? (
                                <>
                                  <span className="font-semibold">{key}:</span>
                                  <span className="ml-1">{value.length > 10 ? value.substring(0, 10) + '...' : value}</span>
                                </>
                              ) : (
                                <span>{key.length > 15 ? key.substring(0, 15) + '...' : key}</span>
                              )}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-xs text-gray-400 dark:text-gray-500 italic">Sin tags</span>
                      )}
                      {centro.tags && centro.tags.length > 3 && (
                        <span 
                          className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md text-xs font-medium"
                          title={centro.tags.slice(3).join(', ')}
                        >
                          +{centro.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEdit && onEdit(centro)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-150 font-medium text-sm"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                        Editar
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete && onDelete(centro.id_centro_costo);
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

export default CentroDeCostoTableComponent;