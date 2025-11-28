'use client'

import { useFeatureAccess } from '@/hooks/useFeatureAccess'
import { LoaderComponent } from '@/components/general/LoaderComponent'
import ClientSelectorComponent from '@/components/general/ClientSelectorComponent'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Cloud, ArrowRight, Briefcase, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export const SelectCloudComponent = () => {
    const router = useRouter();
    
    const { 
        loading, 
        isGlobalAdmin, 
        connectionData, 
        currentPlanName,
        activeAzureAccountId,
        setActiveAzureAccountId,
        activeAwsAccountId,      
        setActiveAwsAccountId,   
        swapContextToken 
    } = useFeatureAccess()

    if (loading) return <LoaderComponent />
    if (loading) return <LoaderComponent />

    const isAzure = connectionData.isAzureActive
    const isAws = connectionData.isAwsActive
    const nothing = !isAzure && !isAws
    const clientName = connectionData.client

    const azureAccounts = connectionData.azureAccountsList || [];
    const awsAccounts = connectionData.awsAccountsList || []; 
    
    const hasMultipleAzureAccounts = azureAccounts.length > 1;
    const hasMultipleAwsAccounts = awsAccounts.length > 1; 

    const handleAccountChange = (
        e: React.ChangeEvent<HTMLSelectElement>,
        cloud: 'azure' | 'aws' 
    ) => {
        const newId = e.target.value;
        const targetAccounts = (cloud === 'azure') ? azureAccounts : awsAccounts;
        const selectedAccount = targetAccounts.find((acc) => acc.id === newId);

        if (!selectedAccount) return;

        if (cloud === 'azure') {
            setActiveAzureAccountId(newId);
        } else {
            setActiveAwsAccountId(newId);
        }

        // TOKEN SWAP CALL (CORRECCIÓN: Se activa si hay una cuenta seleccionada)
        if (selectedAccount) { // Se activa si seleccionamos una cuenta
            const client = connectionData.client; 
            
            // Usamos la nueva selección para la nube actual, y la antigua para la otra nube.
            const newDbConnectionAzure = (cloud === 'azure') ? selectedAccount.db : connectionData.dbAzureName; 
            const newDbConnectionAws = (cloud === 'aws') ? selectedAccount.db : connectionData.dbAwsName; 

            // Llamamos al swap con las cadenas de conexión explícitas
            swapContextToken(client, newDbConnectionAzure, newDbConnectionAws);
        }
    };
    
    // Funciones de interacción
    const handleEnterAzure = () => {
        router.push(`/azure?client=${clientName}`);
    };

    const handleEnterAws = () => {
        router.push(`/aws?client=${clientName}`);
    };

    const handleSelectClick = (e: React.MouseEvent) => {
        e.stopPropagation(); 
    };

    return (
        <section className="mx-auto max-w-5xl px-4">
            
            {/* Selector Global Admin */}
            {isGlobalAdmin && (
                <div className="pb-4 mb-4 border-b">
                    <ClientSelectorComponent />
                    <p className='text-xs text-gray-500 mt-1'>Visualizando: {clientName} (Plan: {currentPlanName.toUpperCase()})</p>
                </div>
            )}

            <header className="mb-6">
                <h2 className="text-2xl font-semibold">Nubes registradas</h2>
                <p className="text-sm text-muted-foreground">Selecciona la nube para redirigirte al dashboard correspondiente.</p>
            </header>

            <div className={cn("grid gap-4", isAzure && isAws ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1")}>
                
                {/*  TARJETA AZURE  */}
                {isAzure && (
                    <div
                        onClick={handleEnterAzure}
                        className={cn(
                            "group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition hover:shadow-md cursor-pointer",
                            hasMultipleAzureAccounts ? "border-blue-400" : ""
                        )}
                    >
                        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
                        <div className="flex items-center gap-4">
                            <div className="relative h-12 w-12 rounded-xl ring-1 ring-border bg-background grid place-items-center">
                                <Image alt="Azure" src="/azure.svg" width={26} height={26} />
                            </div>
                            <div className="flex-1 z-10">
                                <h3 className="text-lg font-semibold">Microsoft Azure</h3>
                                
                                {hasMultipleAzureAccounts && (
                                    <div className="mt-1 flex items-center gap-2" onClick={handleSelectClick}>
                                        <span className="text-xs text-muted-foreground">Cuenta:</span>
                                        <div className="relative">
                                            <select
                                                className="appearance-none bg-white/50 border border-gray-200 rounded px-2 py-1 text-xs font-bold text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-6 cursor-pointer"
                                                value={activeAzureAccountId || azureAccounts[0].id}
                                                onChange={(e) => handleAccountChange(e, 'azure')} // 🛑 LLAMADA AZURE
                                            >
                                                {azureAccounts.map((acc) => (
                                                    <option key={acc.id} value={acc.id}>
                                                        {acc.alias}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 h-3 w-3 text-blue-700 pointer-events-none" />
                                        </div>
                                    </div>
                                )}
                                {!hasMultipleAzureAccounts && (
                                    <p className="text-xs text-muted-foreground mt-1">Costos, recursos, tendencias y funciones especializadas.</p>
                                )}
                            </div>
                            <ArrowRight className="h-4 w-4 opacity-70 transition-transform group-hover:translate-x-1" />
                        </div>
                    </div>
                )}

                {/* TARJETA AWS */}
                {isAws && (
                    <div
                        onClick={handleEnterAws} 
                        className={cn(
                             "group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition hover:shadow-md cursor-pointer",
                            hasMultipleAwsAccounts ? "border-amber-400" : ""
                        )}
                    >
                        <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-amber-500/10 blur-2xl" />
                        <div className="flex items-center gap-4">
                            <div className="relative h-12 w-12 rounded-xl ring-1 ring-border bg-background grid place-items-center">
                                <Image alt="AWS" src="/aws.svg" width={26} height={26} />
                            </div>
                            <div className="flex-1 z-10">
                                <h3 className="text-lg font-semibold">Amazon Web Services</h3>
                                
                                {hasMultipleAwsAccounts && (
                                    <div className="mt-1 flex items-center gap-2" onClick={handleSelectClick}>
                                        <span className="text-xs text-muted-foreground">Cuenta:</span>
                                        <div className="relative">
                                            <select
                                                className="appearance-none bg-white/50 border border-gray-200 rounded px-2 py-1 text-xs font-bold text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 pr-6 cursor-pointer"
                                                value={activeAwsAccountId || awsAccounts[0].id}
                                                onChange={(e) => handleAccountChange(e, 'aws')} // 🛑 LLAMADA AWS
                                            >
                                                {awsAccounts.map((acc) => (
                                                    <option key={acc.id} value={acc.id}>{acc.alias}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 h-3 w-3 text-amber-700 pointer-events-none" />
                                        </div>
                                    </div>
                                )}
                                {!hasMultipleAwsAccounts && (
                                    <p className="text-xs text-muted-foreground mt-1">EC2/RDS/S3, consumos por localización y top facturaciones.</p>
                                )}
                            </div>
                            <ArrowRight className="h-4 w-4 opacity-70 transition-transform group-hover:translate-x-1" />
                        </div>
                    </div>
                )}
            </div>

            {nothing && (
                <div className="mt-8 grid place-items-center rounded-2xl border p-10 text-center">
                    <Cloud className="h-6 w-6 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                        El cliente {clientName} no tiene nubes habilitadas.
                    </p>
                </div>
            )}
        </section>
    );
};