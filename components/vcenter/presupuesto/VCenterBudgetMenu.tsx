'use client';

import { useRouter } from 'next/navigation';

const MODULES = [
  {
    title: '📊 Costos vs Presupuesto',
    description: 'Visualiza y compara el presupuesto con los costos reales.',
    path: '/cloud-vcenter/presupuesto/costos-vs-presupuesto',
  },
  {
    title: '🏷️ Centros de Costo',
    description: 'Carga y gestiona los centros de costo',
    path: '/cloud-vcenter/presupuesto/centro-de-costo',
  },
  {
    title: '💰 Presupuestos Anuales',
    description: 'Carga y administra los presupuestos anuales',
    path: '/cloud-vcenter/presupuesto/presupuesto-anual',
  },
  {
    title: '💰 Presupuestos Mensuales',
    description: 'Carga y administra los presupuestos mensuales',
    path: '/cloud-vcenter/presupuesto/presupuesto-mensual',
  },
  // {
  //   title: '🔗 Asignación de Recursos',
  //   description: 'Relaciona recursos vCenter con centros de costo',
  //   path: '/cloud-vcenter/presupuesto/asignacion-recursos',
  // },
] as const;

export function VCenterBudgetMenu() {
  const router = useRouter();

  return (
    <div className="w-full min-w-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {MODULES.map((module) => (
          <div
            key={module.path}
            className="bg-white shadow-md p-4 rounded-lg border cursor-pointer hover:shadow-xl transition"
            onClick={() => router.push(module.path)}
          >
            <h2 className="text-xl font-semibold mb-2">{module.title}</h2>
            <p className="text-sm text-gray-600">{module.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
