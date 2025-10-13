'use client'
import useSWR from 'swr'
import React, { useEffect, useRef, useCallback } from "react"
import * as echarts from "echarts"

const LoaderComponent = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
)

interface HeatmapQuotasProps {
    startDate: Date;
    endDate: Date;
    region: string;
    subscription: string;
}

const fetcher = (url: string) =>
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())

export const HeatmapQuotasComponent = ({ startDate, endDate, region, subscription }: HeatmapQuotasProps) => {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)
  const resizeObserverRef = useRef(null)
  
  const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4)
  const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : ''

  const { data, error, isLoading } = useSWR(
    `/api/azure/bridge/azure/funcion/heatmap-quotas?date_from=${(startDateFormatted)}&date_to=${(endDateFormatted)}&location=${(region)}&subscription_id=${(subscription)}`,
    fetcher,
    { revalidateOnFocus: false }
  )

  // Transformar datos de Azure al formato del treemap
  const formattedData = React.useMemo(() => {
    if (!data || !Array.isArray(data)) return []

    // Agrupar por fecha (timestamp)
    const groupedByDate = {}
    
    data.forEach(item => {
      const date = new Date(item.timestamp.$date).toLocaleDateString()
      
      if (!groupedByDate[date]) {
        groupedByDate[date] = {}
      }
      
      const quotaName = item.quota_name || 'Unknown Quota'
      
      if (!groupedByDate[date][quotaName]) {
        groupedByDate[date][quotaName] = {
          quota_name: quotaName,
          usage_value: item.usage_value || 0,
          limit_value: item.limit_value || 1,
          porcentaje_consumo: item.porcentaje_consumo || 0,
          location: item.location_custom || location
        }
      }
    })

    // Convertir a formato treemap
    return Object.entries(groupedByDate).map(([date, quotas]) => {
      const quotasArray = Object.values(quotas)
      
      return {
        name: date,
        value: quotasArray.length,
        children: quotasArray.map(quota => ({
          name: quota.quota_name,
          value: quota.porcentaje_consumo * 100, // Convertir a porcentaje 0-100
          tooltipData: {
            usage: quota.usage_value,
            limit: quota.limit_value,
            percentage: (quota.porcentaje_consumo * 100).toFixed(2),
            location: quota.location
          }
        }))
      }
    }).sort((a, b) => new Date(a.name) - new Date(b.name))
  }, [data, region])

  const handleResize = useCallback(() => {
    if (chartInstance.current) {
      chartInstance.current.resize()
    }
  }, [])

  useEffect(() => {
    const getLevelOption = () => {
      return [
        {
          itemStyle: {
            borderWidth: 0.5,
            borderRadius: 5,
            gapWidth: 2
          },
          upperLabel: {
            show: true,
            position: 'inside',
            height: 20,
            color: '#ffffff',
            fontSize: 16,
            backgroundColor: '#0078d4',
            borderRadius: 3
          }
        },
        {
          colorSaturation: [0.5, 0.7],
          itemStyle: {
            borderWidth: 0.5,
            borderRadius: 5,
            gapWidth: 2,
            borderColorSaturation: 0.6
          },
          upperLabel: {
            show: true,
            color: '#333333',
            fontSize: 12
          }
        }
      ]
    }

    const options = {
      title: { 
        text: 'Azure Quotas Heatmap', 
        left: 'center',
        textStyle: {
          fontSize: 18,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        formatter: function (params) {
          const value = params.value
          const treePathInfo = params.treePathInfo
          const level = treePathInfo.length
          const treePath = treePathInfo.slice(1).map(v => v.name).join(' / ')
          
          if (level === 3 && params.data.tooltipData) {
            const info = params.data.tooltipData
            return `
              <div style="font-weight:bold;margin-bottom:6px">${params.name}</div>
              <div><b>Usage:</b> ${info.usage} / ${info.limit}</div>
              <div><b>Percentage:</b> ${info.percentage}%</div>
              <div><b>Location:</b> ${info.location}</div>
            `
          }
          
          let unit = level === 2 ? ' Quotas' : ' %'
          return `
            <div style="font-weight:bold">${treePath}</div>
            Valor: ${typeof value === 'number' ? value.toFixed(2) : value}${unit}
          `
        }
      },
      series: [
        {
          type: 'treemap',
          visibleMin: 0,
          itemStyle: {
            borderRadius: 5,
            borderWidth: 0.5,
            gapWidth: 2
          },
          label: {
            show: true,
            formatter: function (params) {
              const name = params.data.name
              const value = params.data.value
              const level = params.treePathInfo.length
              let unit = level === 2 ? ' Quotas' : '%'
              
              return `${name}\n${typeof value === 'number' ? value.toFixed(1) : value}${unit}`
            },
            fontSize: 12
          },
          upperLabel: {
            show: true,
            height: 20,
            formatter: function (params) {
              if (params.name === "") {
                return "Azure Quotas"
              }
              return params.name
            }
          },
          emphasis: {
            itemStyle: {
              borderRadius: 5,
              borderWidth: 1,
              shadowBlur: 10,
              shadowColor: 'rgba(0,0,0,0.3)'
            }
          },
          levels: getLevelOption(),
          data: formattedData
        }
      ],
      animation: true,
    }

    if (!chartRef.current) return

    resizeObserverRef.current = new ResizeObserver(handleResize)
    resizeObserverRef.current.observe(chartRef.current)
    
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current)
      chartInstance.current.setOption(options)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      resizeObserverRef.current?.disconnect()
      chartInstance.current?.dispose()
    }
  }, [formattedData, handleResize])

  if (isLoading) return <LoaderComponent />
  if (error) return <div className="text-red-500 p-4">Error al cargar datos de Azure</div>
  if (!data || data.length === 0) return <div className="p-4">No hay datos disponibles</div>

  return (
    <div className="w-full h-screen">
      <div ref={chartRef} className="w-full h-full" />
    </div>
  )
}