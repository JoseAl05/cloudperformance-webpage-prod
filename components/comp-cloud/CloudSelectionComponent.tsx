// 'use client'

// import { useState } from 'react';
// import { useRouter, usePathname } from 'next/navigation';
// import { IntraCloudConfigComponent, ReqPayload } from '@/components/comp-cloud/intracloud/IntraCloudConfigComponent';
// import { MainViewIntraCloudBillingComponent } from '@/components/comp-cloud/intracloud/billing/MainViewIntraCloudBillingComponent';
// import { LoaderComponent } from '@/components/general_aws/LoaderComponent';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { RotateCcw } from 'lucide-react';
// import { useSession } from '@/hooks/useSession';
// import { CloudAccount } from '@/types/db';

// export const CloudSelectionComponent = () => {
//     const { user, isLoading } = useSession();
//     const [selectedCloud, setSelectedCloud] = useState<string>('');

//     const [ReqPayload, setReqPayload] = useState<ReqPayload | null>(null);

//     const router = useRouter();
//     const pathname = usePathname();

//     const handleGlobalReset = () => {
//         setSelectedCloud('');
//         setReqPayload(null);
//         router.replace(pathname);
//     };

//     const handleBackToConfig = () => {
//         setReqPayload(null);
//         router.replace(pathname);
//     };

//     if (isLoading) return <LoaderComponent size='small' />

//     if (ReqPayload) {
//         return (
//             <div className="animate-in fade-in zoom-in-95 duration-500">
//                 <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={handleBackToConfig}
//                     className="mb-6 gap-2 text-gray-600"
//                 >
//                     <RotateCcw size={14} />
//                     Volver a la configuración
//                 </Button>
//                 <MainViewIntraCloudBillingComponent payload={ReqPayload} />
//             </div>
//         );
//     }

//     const isAwsMultitenant = user && user.is_aws_multi_tenant;
//     const isAzureMultitenant = user && user.is_azure_multi_tenant;

//     let activeAccounts: CloudAccount[] = [];
//     if (selectedCloud === 'Azure' && user?.azure_accounts) {
//         activeAccounts = user.azure_accounts;
//     } else if (selectedCloud === 'AWS' && user?.aws_accounts) {
//         activeAccounts = user.aws_accounts;
//     }

//     return (
//         <div className="w-full max-w-4xl mx-auto space-y-6">
//             <Card className="border-l-4 border-l-blue-500 shadow-sm animate-in fade-in zoom-in-95 duration-500">
//                 <CardHeader className="flex flex-row items-center justify-between pb-2">
//                     <CardTitle className="text-lg text-gray-700 flex items-center gap-2">
//                         <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
//                         Selector de Origen
//                     </CardTitle>
//                     {selectedCloud && (
//                         <Button
//                             variant="ghost" size="sm" onClick={handleGlobalReset}
//                             className="text-gray-400 hover:text-red-500 transition-colors h-8 w-8 p-0"
//                             title="Reiniciar todo"
//                         >
//                             <RotateCcw size={16} />
//                         </Button>
//                     )}
//                 </CardHeader>
//                 <CardContent>
//                     <Select onValueChange={(value) => setSelectedCloud(value)} value={selectedCloud}>
//                         <SelectTrigger className="w-full md:w-[320px]">
//                             <SelectValue placeholder='Seleccione Proveedor de Nube...' />
//                         </SelectTrigger>
//                         <SelectContent>
//                             {isAzureMultitenant && <SelectItem value='Azure'>Azure (Tenants)</SelectItem>}
//                             {isAwsMultitenant && <SelectItem value='AWS'>AWS (Cuentas)</SelectItem>}
//                         </SelectContent>
//                     </Select>
//                 </CardContent>
//             </Card>

//             {selectedCloud && activeAccounts.length > 0 && (
//                 <IntraCloudConfigComponent
//                     key={selectedCloud}
//                     cloudType={selectedCloud}
//                     accounts={activeAccounts}
//                     onAuditReady={setReqPayload}
//                 />
//             )}
//         </div>
//     )
// }
'use client'

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { IntraCloudConfigComponent, ReqPayload } from '@/components/comp-cloud/intracloud/IntraCloudConfigComponent';
import { MainViewIntraCloudBillingComponent } from '@/components/comp-cloud/intracloud/billing/MainViewIntraCloudBillingComponent';
import { LoaderComponent } from '@/components/general_aws/LoaderComponent';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { useSession } from '@/hooks/useSession';
import { CloudAccount } from '@/types/db';
import { MainViewIntraCloudComputeComponent } from '@/components/comp-cloud/intracloud/compute/MainViewIntraCloudComputeComponent';

export const CloudSelectionComponent = () => {
    const { user, isLoading } = useSession();
    const [selectedCloud, setSelectedCloud] = useState<string>('');
    const [reqPayload, setReqPayload] = useState<ReqPayload | null>(null);

    const router = useRouter();
    const pathname = usePathname();

    const handleGlobalReset = () => {
        setSelectedCloud('');
        setReqPayload(null);
        router.replace(pathname);
    };

    const handleBackToConfig = () => {
        setReqPayload(null);
        router.replace(pathname);
    };

    if (isLoading) return <LoaderComponent size='small' />

    // if (reqPayload) {
    //     return (
    //         <div className="animate-in fade-in zoom-in-95 duration-500">
    //             <Button
    //                 variant="outline"
    //                 size="sm"
    //                 onClick={handleBackToConfig}
    //                 className="mb-6 gap-2 text-gray-600"
    //             >
    //                 <RotateCcw size={14} />
    //                 Volver a la configuración
    //             </Button>
    //             <MainViewIntraCloudBillingComponent payload={reqPayload} />
    //         </div>
    //     );
    // }
    if (reqPayload) {
        return (
            <div className="animate-in fade-in zoom-in-95 duration-500">
                <div className="sticky top-0 z-10 bg-background py-4 px-4 mb-6 border-b border-border shadow-sm">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleBackToConfig}
                        className="gap-2 text-gray-600 dark:text-gray-300"
                    >
                        <RotateCcw size={14} />
                        Volver a la configuración
                    </Button>
                </div>

                {
                    reqPayload.service_type === 'billing' && (
                        <MainViewIntraCloudBillingComponent payload={reqPayload} />
                    )
                }
                {
                    reqPayload.service_type === 'compute' && (
                        <MainViewIntraCloudComputeComponent payload={reqPayload} />
                    )
                }
            </div>
        );
    }

    const isAwsMultitenant = user && user.is_aws_multi_tenant;
    const isAzureMultitenant = user && user.is_azure_multi_tenant;

    let activeAccounts: CloudAccount[] = [];
    if (selectedCloud === 'Azure' && user?.azure_accounts) {
        activeAccounts = user.azure_accounts;
    } else if (selectedCloud === 'AWS' && user?.aws_accounts) {
        activeAccounts = user.aws_accounts;
    }

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            <Card className="border-l-4 border-l-blue-500 shadow-sm animate-in fade-in zoom-in-95 duration-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg text-gray-700 flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                        Selector de Origen
                    </CardTitle>
                    {selectedCloud && (
                        <Button
                            variant="ghost" size="sm" onClick={handleGlobalReset}
                            className="text-gray-400 hover:text-red-500 transition-colors h-8 w-8 p-0"
                            title="Reiniciar todo"
                        >
                            <RotateCcw size={16} />
                        </Button>
                    )}
                </CardHeader>
                <CardContent>
                    <Select onValueChange={(value) => setSelectedCloud(value)} value={selectedCloud}>
                        <SelectTrigger className="w-full md:w-[320px]">
                            <SelectValue placeholder='Seleccione Proveedor de Nube...' />
                        </SelectTrigger>
                        <SelectContent>
                            {isAzureMultitenant && <SelectItem value='Azure'>Azure (Tenants)</SelectItem>}
                            {isAwsMultitenant && <SelectItem value='AWS'>AWS (Cuentas)</SelectItem>}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {selectedCloud && activeAccounts.length > 0 && (
                <IntraCloudConfigComponent
                    key={selectedCloud}
                    cloudType={selectedCloud}
                    accounts={activeAccounts}
                    onReqReady={setReqPayload}
                />
            )}
        </div>
    )
}