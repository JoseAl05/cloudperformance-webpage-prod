'use client'; 

import React from 'react';
import { useRouter } from 'next/navigation';


interface Module {
  title: string;
  description: string;
  path: string;
}

const MainMenuComponent: React.FC = () => {
  const router = useRouter();


  const modules: Module[] = [
    {
      title: '📊 Costos vs Presupuesto',
      description: 'Visualiza y compara el presupuesto con los costos reales.',
      path: '/gcp/presupuesto/costos-vs-presupuesto',
    },
    {
      title: '🏷️ Centros de Costo',
      description: 'Carga y gestiona los centros de costo',
      path: '/gcp/presupuesto/centro-de-costo',
    },
    {
      title: '💰 Presupuestos Anuales',
      description: 'Carga y administra los presupuestos anuales',
      path: '/gcp/presupuesto/presupuesto-anual',
    },
    {
      title: '💰 Presupuestos Mensuales',
      description: 'Carga y administra los presupuestos mensuales',
      path: '/gcp/presupuesto/presupuesto-mensual',
    },

  ];

  return (
    <div className="w-full min-w-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {modules.map((mod) => (
            <div
              key={mod.path}
              className="bg-white shadow-md p-4 rounded-lg border cursor-pointer hover:shadow-xl transition"
              onClick={() => router.push(mod.path)} // Navegación usando Next.js
            >
              <h2 className="text-xl font-semibold mb-2">{mod.title}</h2>
              <p className="text-sm text-gray-600">{mod.description}</p>
            </div>
          ))}
        </div>
    </div>
  );
};

export default MainMenuComponent;

