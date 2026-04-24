'use client'

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { InterCloudConfigComponent, InterCloudReqPayload } from '@/components/comp-cloud/intercloud/InterCloudConfigComponent';
import { InterCloudServiceSelectionComponent, ServiceType } from '@/components/comp-cloud/intercloud/InterCloudServiceSelectionComponent';
import { LoaderComponent } from '@/components/general_aws/LoaderComponent';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw, CloudCog } from 'lucide-react';
import { useSession } from '@/hooks/useSession';
import { CloudAccount } from '@/types/db';
import { MainViewInterCloudVmComponent } from '@/components/comp-cloud/intercloud/virtual_machines/MainViewInterCloudVmComponent';

export const InterCloudSelectionComponent = () => {
    const { user, isLoading } = useSession();
    const [selectedCloud, setSelectedCloud] = useState<string>('');
    const [reqPayload, setReqPayload] = useState<InterCloudReqPayload | null>(null);

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

    if (isLoading) return <LoaderComponent size='small' />;

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
                    reqPayload.service_type === 'vms' && (
                        <>
                            <MainViewInterCloudVmComponent payload={reqPayload} />
                            <Card className="border-l-4 border-l-green-500 shadow-sm my-5">
                                <CardHeader>
                                    <CardTitle className="text-lg text-gray-700 flex items-center gap-2">
                                        <CloudCog size={18} className="text-green-600" />
                                        Cloud Performance — Selección preparada
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-gray-600">
                                        Se ha generado el payload para la nube seleccionada.
                                    </p>
                                    <pre className="text-xs bg-slate-900 text-slate-100 rounded-md p-4 overflow-x-auto">
                                        {JSON.stringify(reqPayload, null, 2)}
                                    </pre>
                                </CardContent>
                            </Card>
                        </>
                    )
                }
            </div>
        );
    }

    const isAws = user && user.is_aws;
    const isAzure = user && user.is_azure;
    const isGcp = user && user.is_gcp;

    let activeAccounts: CloudAccount[] = [];
    let isMultiTenant = false;
    let singleTenantId: string | undefined;
    if (selectedCloud === 'Azure') {
        isMultiTenant = !!user?.is_azure_multi_tenant;
        activeAccounts = user?.azure_accounts ?? [];
        singleTenantId = user?.user_db_azure;
    } else if (selectedCloud === 'AWS') {
        isMultiTenant = !!user?.is_aws_multi_tenant;
        activeAccounts = user?.aws_accounts ?? [];
        singleTenantId = user?.user_db_aws;
    } else if (selectedCloud === 'GCP') {
        isMultiTenant = !!user?.is_gcp_multi_tenant;
        activeAccounts = user?.gcp_accounts ?? [];
        singleTenantId = user?.user_db_gcp;
    }

    const handleSingleTenantServiceSelected = (service: ServiceType) => {
        if (!singleTenantId) return;
        setReqPayload({
            tenant_id: singleTenantId,
            cloud_provider: selectedCloud,
            service_type: service,
        });
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            <Card className="border-l-4 border-l-green-500 shadow-sm animate-in fade-in zoom-in-95 duration-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg text-gray-700 flex items-center gap-2">
                        <span className="bg-green-100 text-green-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                        Selector de Nube
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
                            {isAzure && <SelectItem value='Azure'>Azure (Tenants)</SelectItem>}
                            {isAws && <SelectItem value='AWS'>AWS (Cuentas)</SelectItem>}
                            {isGcp && <SelectItem value='GCP'>GCP (Proyectos)</SelectItem>}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {selectedCloud && isMultiTenant && activeAccounts.length > 0 && (
                <InterCloudConfigComponent
                    key={selectedCloud}
                    cloudType={selectedCloud}
                    accounts={activeAccounts}
                    onReqReady={setReqPayload}
                />
            )}

            {selectedCloud && !isMultiTenant && singleTenantId && (
                <InterCloudServiceSelectionComponent
                    key={selectedCloud}
                    cloudType={selectedCloud}
                    onServiceSelected={handleSingleTenantServiceSelected}
                />
            )}
        </div>
    );
};