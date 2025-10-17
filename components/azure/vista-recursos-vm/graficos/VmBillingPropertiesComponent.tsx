'use client';

import { Card, CardContent } from '@/components/ui/card';
import { 
  CreditCard, 
  Building2, 
  Server, 
  Tag, 
  Target, 
  MapPin, 
  FileText 
} from 'lucide-react';
import useSWR from 'swr';

interface BillingProperty {
  charge_type: string;
  provider: string;
  consumed_service: string;
  product_identifier: string;
  cost_center: string;
  resource_location_normalized: string;
  resource_name: string;
}

interface BillingPropertiesData {
  propiedades_facturacion: BillingProperty[];
}

const LoaderComponent = () => (
  <div className="flex items-center justify-center h-full py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

interface VmBillingPropertiesProps {
  data: BillingPropertiesData | null;
}

const VmBillingProperties = ({ data }: VmBillingPropertiesProps) => {
  const properties = data?.propiedades_facturacion?.[0];

  if (!properties) {
    return (
      <div className="w-full h-[200px] flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          No hay propiedades de facturación disponibles
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Tipo de Cargo */}
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">Tipo de Cargo</p>
              <p className="text-lg font-bold text-blue-600 mt-1">
                {properties.charge_type || 'No especificado'}
              </p>
            </div>
            <CreditCard className="h-6 w-6 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      {/* Proveedor */}
      <Card className="border-l-4 border-l-purple-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">Proveedor</p>
              <p className="text-lg font-bold text-purple-600 mt-1">
                {properties.provider || 'No especificado'}
              </p>
            </div>
            <Building2 className="h-6 w-6 text-purple-500" />
          </div>
        </CardContent>
      </Card>

      {/* Servicio Consumido */}
      <Card className="border-l-4 border-l-green-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">Servicio Consumido</p>
              <p className="text-lg font-bold text-green-600 mt-1">
                {properties.consumed_service || 'No especificado'}
              </p>
            </div>
            <Server className="h-6 w-6 text-green-500" />
          </div>
        </CardContent>
      </Card>

      {/* Centro de Costos */}
      <Card className="border-l-4 border-l-red-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">Centro de Costos</p>
              <p className="text-lg font-bold text-red-600 mt-1">
                {properties.cost_center || 'No especificado'}
              </p>
            </div>
            <Target className="h-6 w-6 text-red-500" />
          </div>
        </CardContent>
      </Card>

      {/* Identificador de Producto - Ancho completo o 2 columnas */}
      <Card className="border-l-4 border-l-orange-500 md:col-span-2">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground uppercase">Identificador de Producto</p>
              <p className="text-lg font-bold text-orange-600 mt-1 break-all">
                {properties.product_identifier || 'No especificado'}
              </p>
            </div>
            <Tag className="h-6 w-6 text-orange-500 flex-shrink-0 ml-4" />
          </div>
        </CardContent>
      </Card>

      {/* Ubicación del Recurso */}
      <Card className="border-l-4 border-l-cyan-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">Localización</p>
              <p className="text-lg font-bold text-cyan-600 mt-1">
                {properties.resource_location_normalized || 'No especificado'}
              </p>
            </div>
            <MapPin className="h-6 w-6 text-cyan-500" />
          </div>
        </CardContent>
      </Card>

      {/* Nombre del Recurso */}
      <Card className="border-l-4 border-l-indigo-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">Nombre del Recurso</p>
              <p className="text-lg font-bold text-indigo-600 mt-1">
                {properties.resource_name || 'No especificado'}
              </p>
            </div>
            <FileText className="h-6 w-6 text-indigo-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const fetcher = (url: string) =>
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.json());

interface VmBillingPropertiesComponentProps {
  startDate: Date;
  endDate: Date;
  instanceName: string;
}

const VmBillingPropertiesComponent = ({ 
  startDate, 
  endDate, 
  instanceName 
}: VmBillingPropertiesComponentProps) => {
  const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4)
  const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : ''

  const { data, error, isLoading } = useSWR(
    `/api/azure/bridge/azure/recursos/vm/facturacion/propiedades?date_from=${startDateFormatted}&date_to=${endDateFormatted}&instance_name=${instanceName}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  if (isLoading) return <LoaderComponent />;
  if (error) return <div className="text-red-500 p-4">Error al cargar propiedades de facturación</div>;

  return <VmBillingProperties data={data} />;
};

export { VmBillingPropertiesComponent };
export default VmBillingPropertiesComponent;