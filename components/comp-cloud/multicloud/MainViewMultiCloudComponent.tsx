'use client';

import { useState } from 'react';
import { MultiCloudFiltersComponent } from '@/components/comp-cloud/multicloud/filters/MultiCloudFiltersComponent';
import { GlobalBillingMultiTenantDashboard } from '@/components/comp-cloud/multicloud/MultiCloudComponent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { TrendingUp, RotateCcw, ArrowRight, AlertTriangle, LayoutDashboard, Eraser } from 'lucide-react';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { useMultiTenantSelection, CloudProvider, CloudAccount } from '@/hooks/useMultiTenantSelection';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface CloudConfigOption {
    id: CloudProvider;
    active: boolean;
    label: string;
    logo: string;
    accounts: CloudAccount[];
}

export const MainViewMultiTenantComponent = () => {
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
    const [selectedClouds, setSelectedClouds] = useState<CloudProvider[]>([]);
    
    const { connectionData } = useFeatureAccess();
    const { selectedTenants, toggleTenant, autoSelectIfSingle, isTenantSelected } = useMultiTenantSelection();

    const isAzure = connectionData.isAzureActive;
    const isAws = connectionData.isAwsActive;
    const isGcp = connectionData.isGcpActive;

    const azureTenants: CloudAccount[] = connectionData.azureAccountsList || [];
    const awsTenants: CloudAccount[] = connectionData.awsAccountsList || [];
    const gcpTenants: CloudAccount[] = connectionData.gcpAccountsList || [];

    const availableCloudsCount = [isAzure, isAws, isGcp].filter(Boolean).length;
    const canCompare = availableCloudsCount >= 2;

    // Arreglo maestro tipado
    const cloudOptions: CloudConfigOption[] = [
        { id: 'azure', active: isAzure, label: 'Microsoft Azure', logo: '/azure.svg', accounts: azureTenants },
        { id: 'aws', active: isAws, label: 'Amazon Web Services', logo: '/aws.svg', accounts: awsTenants },
        { id: 'gcp', active: isGcp, label: 'Google Cloud', logo: '/gcp.svg', accounts: gcpTenants }
    ];

    const handleCloudToggle = (cloudId: CloudProvider) => {
        setSelectedClouds(prev => {
            if (prev.includes(cloudId)) {
                return prev.filter(c => c !== cloudId);
            } else {
                return [...prev, cloudId];
            }
        });
    };

    const handleGoToStep2 = () => {
        if (selectedClouds.length < 2) return;
        if (selectedClouds.includes('azure')) autoSelectIfSingle('azure', azureTenants);
        if (selectedClouds.includes('aws')) autoSelectIfSingle('aws', awsTenants);
        if (selectedClouds.includes('gcp')) autoSelectIfSingle('gcp', gcpTenants);
        setCurrentStep(2);
    };

    const handleGlobalReset = () => {
        setSelectedClouds([]);
        handleResetStep2();
        setCurrentStep(1);
    };

    const handleResetStep2 = () => {
        selectedClouds.forEach(cloud => {
            const tenants = selectedTenants[cloud];
            if (tenants && tenants.length > 0) {
                [...tenants].forEach(tenantId => {
                    toggleTenant(cloud, tenantId);
                });
            }
        });
    };

    // Validaciones seguras para TypeScript con Optional Chaining
    const allTenantsSelected = selectedClouds.length > 0 && selectedClouds.every(c => (selectedTenants[c]?.length ?? 0) > 0);
    const hasAnyTenantSelected = selectedClouds.some(c => (selectedTenants[c]?.length ?? 0) > 0);

    const finalizeAndProceed = () => {
        if (!allTenantsSelected) return;
        setCurrentStep(3);
    };

    const handleBackToConfig = () => {
        setCurrentStep(2); 
    };

    // VISTA DEL DASHBOARD (Paso 3)
    if (currentStep === 3 && canCompare) {
        return (
            <div className="w-full animate-in fade-in zoom-in-95 duration-500">
                
                {/* BOTÓN STICKY DE VOLVER */}
                <div className="sticky top-0 z-10 bg-background py-4 mb-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleBackToConfig}
                        className="gap-2 text-gray-600 dark:text-gray-300 hover:bg-slate-100 transition-colors"
                    >
                        <RotateCcw size={14} />
                        Volver a la configuración
                    </Button>
                </div>

                <div className='w-full min-w-0 space-y-4'>
                    <div className='mb-8'>
                        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                            <div>
                                <div className='flex items-center gap-3 mb-2'>
                                    <div className='h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center'>
                                        <LayoutDashboard className='h-6 w-6 text-indigo-600' />
                                    </div>
                                    <div>
                                        <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
                                            Consolidado Multi-Tenant
                                        </h1>
                                        <p className="text-sm text-gray-500">
                                            Vista agregada de múltiples cuentas. Ajusta el periodo y las etiquetas para filtrar la data multinube.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full pb-8">
                        <MultiCloudFiltersComponent
                            selectedClouds={selectedClouds}
                            selectedTenants={selectedTenants}
                            accountsList={{ azure: azureTenants, aws: awsTenants, gcp: gcpTenants }}
                            Component={GlobalBillingMultiTenantDashboard}
                        />
                    </div>
                </div>
            </div>
        );
    }

    // VISTA DE CONFIGURACIÓN (Pasos 1 y 2)
    return (
        <div className="w-full max-w-5xl mx-auto space-y-8 px-4 py-8">
            <header className="mb-10 flex items-center gap-4">
                <div className='h-14 w-14 bg-indigo-100 rounded-2xl flex items-center justify-center shadow-sm'>
                    <TrendingUp className='h-7 w-7 text-indigo-600' />
                </div>
                <div>
                    <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>Comparación Multi-Tenant Global</h1>
                    <p className='text-gray-500'>Configure su entorno de consolidación siguiendo los pasos.</p>
                </div>
            </header>

            {/* PASO 1: SELECTOR DE NUBES */}
            <Card className={cn(
                "border-l-4 shadow-sm transition-all duration-500",
                currentStep === 1 ? "border-l-green-500" : "border-l-gray-200 opacity-80"
            )}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg text-gray-700 flex items-center gap-3">
                        <span className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                            currentStep >= 1 ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                        )}>1</span>
                        Selector de Nube
                    </CardTitle>
                    {selectedClouds.length > 0 && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={handleGlobalReset} 
                            className="text-gray-400 hover:text-green-600 transition-colors h-8 w-8 p-0"
                            title="Limpiar selección de nubes y volver"
                        >
                            <RotateCcw size={16} />
                        </Button>
                    )}
                </CardHeader>
                <CardContent>
                    {!canCompare ? (
                        <div className="flex flex-col items-center justify-center p-6 text-center bg-amber-50 border border-amber-100 rounded-xl">
                            <AlertTriangle className="h-8 w-8 text-amber-500 mb-2" />
                            <p className="text-sm text-amber-700">Requiere al menos dos proveedores activos para comparar.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {cloudOptions.filter(c => c.active).map((cloud) => {
                                    const isSelected = selectedClouds.includes(cloud.id);
                                    
                                    return (
                                        <div
                                            key={cloud.id}
                                            onClick={() => currentStep === 1 && handleCloudToggle(cloud.id)}
                                            className={cn(
                                                "flex items-center space-x-3 p-4 border rounded-md cursor-pointer transition-all",
                                                isSelected 
                                                    ? "border-green-500 bg-green-50 ring-1 ring-green-500" 
                                                    : "bg-white hover:border-gray-300",
                                                currentStep !== 1 && "cursor-default opacity-80"
                                            )}
                                        >
                                            <Checkbox 
                                                checked={isSelected}
                                                onCheckedChange={() => currentStep === 1 && handleCloudToggle(cloud.id)}
                                            />
                                            <div className="flex items-center gap-2">
                                                <Image src={cloud.logo} alt={cloud.label} width={20} height={20} />
                                                <span className={cn("font-medium text-sm truncate", isSelected ? "text-green-900" : "text-zinc-600")}>
                                                    {cloud.label}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {currentStep === 1 && selectedClouds.length >= 2 && (
                                <div className="flex justify-end animate-in fade-in">
                                    <Button onClick={handleGoToStep2} className="bg-slate-900 hover:bg-slate-800 text-white gap-2">
                                        Continuar <ArrowRight size={16} />
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* PASO 2: SELECCIÓN DE TENANTS */}
            {canCompare && (
                <Card className={cn(
                    "border-l-4 shadow-sm transition-all duration-500",
                    currentStep === 2 ? "border-l-green-500" : "border-l-gray-200",
                    currentStep < 2 && "opacity-40 pointer-events-none"
                )}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg text-gray-700 flex items-center gap-3">
                            <span className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                                currentStep === 2 ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                            )}>2</span>
                            Selección de Tenant
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            {currentStep === 2 && hasAnyTenantSelected && (
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={handleResetStep2} 
                                    className="text-gray-400 hover:text-green-600 transition-colors flex gap-2 text-xs"
                                >
                                    <Eraser size={14} /> Limpiar Selección
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {currentStep >= 2 && (
                            <div className="space-y-8 animate-in slide-in-from-top-4 duration-700">
                                {cloudOptions.map((provider) => selectedClouds.includes(provider.id) && (
                                    <div key={provider.id} className="space-y-3">
                                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                            <Image src={provider.logo} alt={provider.label} width={14} height={14} />
                                            {provider.label}
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {provider.accounts.map(acc => {
                                                const isSelected = isTenantSelected(provider.id, acc.id);
                                                return (
                                                    <div
                                                        key={acc.id}
                                                        onClick={() => currentStep === 2 && toggleTenant(provider.id, acc.id)}
                                                        className={cn(
                                                            "flex items-center space-x-3 p-3 border rounded-md cursor-pointer transition-all",
                                                            isSelected ? "border-green-500 bg-green-50" : "bg-white hover:border-gray-300"
                                                        )}
                                                    >
                                                        <Checkbox 
                                                            checked={isSelected}
                                                            onCheckedChange={() => currentStep === 2 && toggleTenant(provider.id, acc.id)}
                                                        />
                                                        <span className={cn("text-sm truncate", isSelected ? "font-medium text-green-900" : "text-zinc-600")}>
                                                            {acc.alias}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}

                                {currentStep === 2 && (
                                    <div className="pt-6 border-t border-dashed flex justify-end">
                                        <Button 
                                            onClick={finalizeAndProceed} 
                                            disabled={!allTenantsSelected}
                                            className="bg-slate-900 hover:bg-slate-800 text-white px-8"
                                        >
                                            Ir a comparación
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};