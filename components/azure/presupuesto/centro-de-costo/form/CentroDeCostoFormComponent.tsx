"use client";

import React, { useState, useEffect } from "react";
import useSWR from "swr";

export interface CentroCosto {
  id_centro_costo: number | string;
  nombre_centro: string;
  responsable_centro: string;
  localizacion: string;
  tags?: string[];
}

interface CentroCostoFormProps {
  onSubmit: (data: CentroCosto) => void;
  onCancel?: () => void; 
  initialData?: CentroCosto | null;
  // Props para la API de tags
  dateFrom?: string;
  dateTo?: string;
  region?: string;
  regionField?: string;
  subscription?: string;
  subscriptionField?: string;
  collection?: string;
  tagColumnName?: string;
}

interface TagResponse {
  Key: string;
  Values: string[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const CentroDeCostoFormComponent: React.FC<CentroCostoFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  dateFrom,
  dateTo,
  region = "all_regions",
  regionField = "resource_location",
  subscription = "all_subscriptions",
  subscriptionField = "subscription_name",
  collection = "azure_consumption_billing_account_modern_usage_details",
  tagColumnName = "tags",
}) => {
  const [formData, setFormData] = useState<CentroCosto>({
    id_centro_costo: "",
    nombre_centro: "",
    responsable_centro: "",
    localizacion: "",
    tags: [],
  });

  const [selectedTag, setSelectedTag] = useState<string>("");
  const [searchTag, setSearchTag] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // Calcular fechas del último año solo una vez
  const dates = React.useMemo(() => {
    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(now.getFullYear() - 1);
    
    return {
      from: dateFrom || oneYearAgo.toISOString(),
      to: dateTo || now.toISOString()
    };
  }, [dateFrom, dateTo]);

  // Llamada a la API para obtener tags
  const apiUrl = `/api/azure/bridge/azure/get-all-tags?date_from=${dates.from}&date_to=${dates.to}&region=${region}&region_field=${regionField}&subscription=${subscription}&subscription_field=${subscriptionField}&collection=${collection}&tag_column_name=${tagColumnName}`;
  
  const { data: tagsData, error: tagsError, isLoading: tagsLoading } = useSWR<TagResponse[]>(
    apiUrl,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // Cache por 1 minuto
    }
  );

  // Procesar los tags de la API para obtener pares clave:valor
  const availableTags = React.useMemo(() => {
    if (!tagsData) return [];
    
    const tagPairs: string[] = [];
    tagsData.forEach((tag) => {
      // Para cada Key, crear un par clave:valor por cada Value
      tag.Values.forEach((value) => {
        // Solo agregar si el valor no está vacío
        if (value && value.trim() !== "") {
          tagPairs.push(`${tag.Key}:${value}`);
        } else {
          // Si el valor está vacío, solo agregar la clave
          tagPairs.push(tag.Key);
        }
      });
    });
    
    return tagPairs.sort();
  }, [tagsData]);

  // Filtrar tags por búsqueda y excluir ya seleccionados
  const filteredTags = availableTags.filter(
    (tag) =>
      !formData.tags?.includes(tag) &&
      tag.toLowerCase().includes(searchTag.toLowerCase())
  );

  useEffect(() => {
    if (initialData) setFormData(initialData);
    else
      setFormData({
        id_centro_costo: "",
        nombre_centro: "",
        responsable_centro: "",
        localizacion: "",
        tags: [],
      });
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTag = (tag: string) => {
    if (tag && !formData.tags?.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tag],
      }));
      setSelectedTag("");
      setSearchTag("");
      setIsDropdownOpen(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-8">
          <div className="space-y-6">
            {/* ID Centro */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                ID Centro <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="id_centro_costo"
                value={formData.id_centro_costo}
                onChange={handleChange}
                required
                placeholder="Ej: 1001"
                disabled={!!initialData}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-900"
              />
              {initialData && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  El ID no puede ser modificado
                </p>
              )}
            </div>

            {/* Nombre Centro */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Nombre Centro <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nombre_centro"
                value={formData.nombre_centro}
                onChange={handleChange}
                required
                placeholder="Ej: Departamento de IT"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none"
              />
            </div>

            {/* Responsable */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Responsable
              </label>
              <input
                type="text"
                name="responsable_centro"
                value={formData.responsable_centro}
                onChange={handleChange}
                placeholder="Ej: Juan Pérez"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none"
              />
            </div>

            {/* Localización */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Localización
              </label>
              <input
                type="text"
                name="localizacion"
                value={formData.localizacion}
                onChange={handleChange}
                placeholder="Ej: Santiago, Piso 3"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none"
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Tags
              </label>
              
              <div className="relative">
                {/* Input de búsqueda */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchTag}
                    onChange={(e) => {
                      setSearchTag(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    placeholder={tagsLoading ? "Cargando tags..." : "Buscar tag..."}
                    disabled={tagsLoading}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Mostrar error si hay */}
                {tagsError && (
                  <p className="text-xs text-red-500 mt-1">
                    Error al cargar tags. Por favor intenta de nuevo.
                  </p>
                )}

                {/* Dropdown personalizado */}
                {isDropdownOpen && !tagsLoading && filteredTags.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-64 overflow-hidden">
                    {/* Opción "Todas las tags" */}
                    <div className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
                      Tags disponibles ({filteredTags.length})
                    </div>
                    
                    {/* Lista con scroll */}
                    <div className="overflow-y-auto max-h-52">
                      {filteredTags.map((tag) => {
                        // Separar clave y valor para mejor visualización
                        const [key, value] = tag.includes(':') 
                          ? tag.split(':') 
                          : [tag, null];
                        
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => handleAddTag(tag)}
                            className="w-full px-4 py-2.5 text-left text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                          >
                            <div className="flex items-center gap-2">
                              {value ? (
                                <>
                                  <span className="font-medium text-blue-600 dark:text-blue-400">
                                    {key}:
                                  </span>
                                  <span>{value}</span>
                                </>
                              ) : (
                                <span>{key}</span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Mensaje cuando no hay resultados */}
                {isDropdownOpen && searchTag && !tagsLoading && filteredTags.length === 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No se encontraron tags
                  </div>
                )}

                {/* Click fuera para cerrar */}
                {isDropdownOpen && (
                  <div
                    className="fixed inset-0 z-0"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                )}
              </div>
              
              {/* Tags seleccionados */}
              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.tags.map((tag) => {
                    // Separar clave y valor para mejor visualización
                    const [key, value] = tag.includes(':') 
                      ? tag.split(':') 
                      : [tag, null];
                    
                    return (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-sm font-medium"
                      >
                        {value ? (
                          <>
                            <span className="font-semibold">{key}:</span>
                            <span>{value}</span>
                          </>
                        ) : (
                          <span>{key}</span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-6 py-3 rounded-lg font-medium transition shadow-sm hover:shadow-md"
            >
              {initialData ? "✓ Actualizar Centro" : "✓ Crear Centro"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 active:bg-gray-300 dark:active:bg-gray-500 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-lg font-medium transition"
            >
              ✕ Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CentroDeCostoFormComponent;