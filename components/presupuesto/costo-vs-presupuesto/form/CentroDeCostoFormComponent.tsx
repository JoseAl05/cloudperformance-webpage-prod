"use client";

import React, { useState, useEffect } from "react";

export interface CentroCosto {
  id_centro_costo: number | string;
  nombre_centro: string;
  responsable_centro: string;
  localizacion: string;
}

interface CentroCostoFormProps {
  onSubmit: (data: CentroCosto) => void;
  onCancel?: () => void; 
  initialData?: CentroCosto | null;
}

export const CentroDeCostoFormComponent: React.FC<CentroCostoFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
}) => {
  const [formData, setFormData] = useState<CentroCosto>({
    id_centro_costo: "",
    nombre_centro: "",
    responsable_centro: "",
    localizacion: "",
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
    else
      setFormData({
        id_centro_costo: "",
        nombre_centro: "",
        responsable_centro: "",
        localizacion: "",
      });
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
      >
        <div className="p-8">
          {/* Título del formulario */}
          {/* <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {initialData ? "Editar Centro de Costo" : "Nuevo Centro de Costo"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {initialData ? "Actualiza la información del centro de costo" : "Completa los datos para crear un nuevo centro de costo"}
            </p>
          </div> */}

          {/* Una sola columna de campos */}
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
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
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
      </form>
    </div>
  );
};

export default CentroDeCostoFormComponent;