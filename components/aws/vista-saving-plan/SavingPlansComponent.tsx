'use client'
import useSWR from 'swr'
import React, { useEffect, useRef } from "react"
import * as echarts from "echarts"

const fetcher = (url: string) =>
  fetch(url, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      "Content-Type": "application/json"
    }
  }).then(res => res.json())

interface SavingPlansComponentProps {
    startDate: Date,
    endDate: Date
}



export const SavingPlansViewComponent = ({ startDate, endDate }: SavingPlansComponentProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
  const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

  // Tabla de detalle
  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/saving-plans/vista-saving-plans?date_from=${startDateFormatted}&date_to=${endDateFormatted}`,
    fetcher
  )

  // Tarjetas
  const { data: stats, error: errorStats, isLoading: loadingStats } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/saving-plans/vista-saving-plans/dashboard-stats?date_from=${startDateFormatted}&date_to=${endDateFormatted}`,
    fetcher
  )

  if (isLoading || loadingStats) return <p>Cargando...</p>
  if (error || errorStats) return <p>Error cargando los datos.</p>

  return (
    <div>
      {/* Tarjetas */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="p-4 bg-white rounded-2xl shadow">
          <h3 className="text-sm font-semibold text-gray-500">Planes Registrados</h3>
          <p className="text-2xl font-bold">{stats?.planes_registrados ?? 0}</p>
        </div>
        <div className="p-4 bg-white rounded-2xl shadow">
          <h3 className="text-sm font-semibold text-gray-500">Planes Activos</h3>
          <p className="text-2xl font-bold">{stats?.planes_activos ?? 0}</p>
        </div>
        <div className="p-4 bg-white rounded-2xl shadow">
          <h3 className="text-sm font-semibold text-gray-500">Planes Retirados</h3>
          <p className="text-2xl font-bold">{stats?.planes_retirados ?? 0}</p>
        </div>
      </div>

      {/* Tabla */}
      <h2 className="text-xl font-bold my-4">Detalle de Saving Plans</h2>

      {data && data.length > 0 ? (
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-3 py-2 text-left">ARN / ID</th>
              <th className="border border-gray-300 px-3 py-2 text-left">Commitment</th>
            </tr>
          </thead>
          <tbody>
            {data.map((sp: unknown, idx: number) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-3 py-2 font-mono">{sp.savingsPlanId}</td>
                <td className="border border-gray-300 px-3 py-2">{sp.commitment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No hay detalles de Saving Plans disponibles.</p>
      )}
    </div>
  );
}