// 'use client'

// import { MessageCard } from '@/components/aws/cards/MessageCards';
// import { UnusedLoadbalancersCardsComponent } from '@/components/azure/vista-funciones/unused-loadbalancers/info/UnusedLoadbalancersCardsComponent';
// import { UnusedLoadbalancersTable } from '@/components/azure/vista-funciones/unused-loadbalancers/table/UnusedLoadbalancersTable';
// import { LoaderComponent } from '@/components/general/LoaderComponent';
// import { UnusedLb } from '@/interfaces/vista-unused-resources/unusedLbInterfaces';
// import { AlertCircle, Clock, Info } from 'lucide-react';
// import useSWR from 'swr';

// interface UnusedAppsGwComponentProps {
//     startDate: Date;
//     endDate: Date;
//     selectedUnusedAppG: string;
//     subscription: string;
//     region: string;
// }

// const fetcher = (url: string) =>
//     fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
//         .then(r => r.json());

// const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0

// export const UnusedAppsGwComponent = ({ startDate, endDate, selectedUnusedAppG, subscription, region }: UnusedAppsGwComponentProps) => {

//     const startDateFormatted = startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : '';
//     const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

//     const { data, isLoading, error } = useSWR(
//         selectedUnusedAppG ? `/api/azure/bridge/azure/apps_gateway/apps_gateway_unused?date_from=${startDateFormatted}&date_to=${endDateFormatted}&location=${region}&subscription_id=${subscription}&appg=${selectedUnusedAppG}` : null,
//         fetcher
//     )

//     const anyLoading =
//         isLoading

//     const anyError =
//         !!error

//     const unusedLbData: UnusedLb[] | null =
//         isNonEmptyArray<UnusedLb>(data) ? data : null;

//     const hasUnusedLbData = !!unusedLbData && unusedLbData.length > 0;
//     const hasSelectedUnusedLb = !!selectedUnusedLb && selectedUnusedLb.length > 0;

//     if (anyLoading) {
//         return <LoaderComponent />
//     }

//     if (!hasSelectedUnusedLb) {
//         return (
//             <div className="w-full min-w-0 px-4 py-6">
//                 <MessageCard
//                     icon={Info}
//                     title="Loadbalancer no seleccionada"
//                     description="Seleccione un loadbalancer..."
//                     tone="info"
//                 />
//             </div>
//         )
//     }

//     if (anyError) {
//         return (
//             <div className="w-full min-w-0 px-4 py-10 flex flex-col items-center gap-4">
//                 <MessageCard
//                     icon={AlertCircle}
//                     title="Error al cargar datos"
//                     description="Ocurrió un problema al obtener la información desde la API. Intenta nuevamente o ajusta el rango de fechas."
//                     tone="error"
//                 />
//             </div>
//         )
//     }
//     const noneHasData = !hasUnusedLbData;
//     if (noneHasData) {
//         return (
//             <div className="w-full min-w-0 px-4 py-6">
//                 <MessageCard
//                     icon={Info}
//                     title="Sin datos para mostrar"
//                     description="No encontramos métricas ni información del/los loadbalancer/s en el rango seleccionado."
//                     tone="warn"
//                 />
//             </div>
//         )
//     }

//     return (
//         <div className='w-full min-w-0 px-4 py-6'>
//             <div className="flex-1 space-y-6 min-w-0 overflow-hidden">
//                 <UnusedLoadbalancersCardsComponent
//                     data={unusedLbData}
//                 />
//             </div>
//             <div className="flex flex-col gap-5 mt-10">
//                 <div className="flex items-center gap-3 my-5">
//                     <Clock className="h-8 w-8 text-blue-500" />
//                     <h1 className="text-3xl font-bold text-foreground">Detalle Loadbalancers Infrautilizados</h1>
//                 </div>
//                 <UnusedLoadbalancersTable
//                     data={unusedLbData}
//                 />
//             </div>
//         </div>
//     )
// }