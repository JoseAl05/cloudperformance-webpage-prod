'use client'

import useSWR from 'swr'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, Server, FolderTree, CreditCard } from 'lucide-react'
import { DataTableSingle } from '@/components/data-table/data-table-single'
import { tableServicesColumns } from '@/components/azure/tables-azure/tablas-item-azure/table/tableServicesColumns'
import { tableResourceGroupsColumns } from '@/components/azure/tables-azure/tablas-item-azure/table/tableResourceGroupsColumns'
import { tableBillingAccountsColumns } from '@/components/azure/tables-azure/tablas-item-azure/table/tableBillingAccountsColumns'

const fetcher = (url: string) =>
  fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())

export const TablasItemAzureComponent = () => {
  const apiUrl = '/api/azure/bridge/azure/tablas-item-azure'

  const { data, error, isLoading } = useSWR(apiUrl, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 2000
  })

  if (isLoading) {
    return (
      <div className="w-full min-w-0 px-4 py-6">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-muted-foreground">Cargando datos de Azure...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full min-w-0 px-4 py-6">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <AlertTriangle className="w-8 h-8 text-red-500 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-lg">Error al cargar datos</h3>
              <p className="text-sm text-muted-foreground">
                No se pudieron cargar los datos de Azure. Por favor, intente nuevamente.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const servicesData = data?.['items-azure'] || []
  const resourceGroupsData = data?.['resource-groups'] || []
  const billingAccountsData = data?.['billing-accounts'] || []

  const hasNoData = servicesData.length === 0 && resourceGroupsData.length === 0 && billingAccountsData.length === 0

  if (hasNoData) {
    return (
      <div className="w-full min-w-0 px-4 py-6">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <AlertTriangle className="w-8 h-8 text-yellow-500 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-lg">Sin datos disponibles</h3>
              <p className="text-sm text-muted-foreground">
                No se encontraron datos de recursos de Azure.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8 px-4">
      {/* Tabla 1: Lista de Servicios Registrados */}
      {servicesData.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Server className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Lista de Servicios Registrados
              </h2>
              <p className="text-sm text-muted-foreground">
                Total de servicios: {servicesData.length}
              </p>
            </div>
          </div>
          <Card className="shadow-lg rounded-2xl">
            <CardContent className="p-4">
              <DataTableSingle
                columns={tableServicesColumns}
                data={servicesData}
                filterColumn="namespace"
                filterPlaceholder="Filtrar por nombre recurso..."
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabla 2: Lista de Grupos de Recursos */}
      {resourceGroupsData.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FolderTree className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Lista de Grupos de Recursos
              </h2>
              <p className="text-sm text-muted-foreground">
                Total de grupos: {resourceGroupsData.length}
              </p>
            </div>
          </div>
          <Card className="shadow-lg rounded-2xl">
            <CardContent className="p-4">
              <DataTableSingle
                columns={tableResourceGroupsColumns}
                data={resourceGroupsData}
                filterColumn="name"
                filterPlaceholder="Filtrar por nombre de grupo..."
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabla 3: Lista de Cuentas de Facturación */}
      {billingAccountsData.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Lista de Cuentas de Facturación
              </h2>
              <p className="text-sm text-muted-foreground">
                Total de cuentas: {billingAccountsData.length}
              </p>
            </div>
          </div>
          <Card className="shadow-lg rounded-2xl">
            <CardContent className="p-4">
              <DataTableSingle
                columns={tableBillingAccountsColumns}
                data={billingAccountsData}
                filterColumn="display_name"
                filterPlaceholder="Filtrar por cuenta a nombre de..."
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}