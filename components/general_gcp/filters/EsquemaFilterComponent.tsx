import React from 'react';

// Exportación nombrada (con 'export const') para que coincida con tus llaves en el maestro
export const EsquemaFilterComponent = ({ 
    value, 
    onChange 
}: { 
    value: string; 
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void 
}) => {
    
  // Solo devuelve el select puro. El label y el estado lo maneja FiltersComponent.tsx
  return (
    <select
      id="esquema-filter"
      value={value}
      onChange={onChange}
      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      <option value="all">Todos los Esquemas</option>
      <option value="EXTERNAL">Externo (EXTERNAL)</option>
      <option value="INTERNAL">Interno (INTERNAL)</option>
      <option value="INTERNAL_MANAGED">Interno Gestionado</option>
    </select>
  );
};