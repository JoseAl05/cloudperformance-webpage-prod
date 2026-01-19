'use client'

import { useFeatureAccess } from '@/hooks/useFeatureAccess'
import { LoaderComponent } from '@/components/general_aws/LoaderComponent'
import ClientSelectorComponent from '@/components/profile/ClientSelectorComponent'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Cloud, ArrowRight } from 'lucide-react' 
import { cn } from '@/lib/utils'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export const SelectCloudComponent = () => {
    const router = useRouter()

    const {
        loading,
        isGlobalAdmin,
        connectionData,
        currentPlanName,

        activeAzureAccountId,
        setActiveAzureAccountId,

        activeAwsAccountId,
        setActiveAwsAccountId,

        activeGcpAccountId,
        setActiveGcpAccountId,

        swapContextToken
    } = useFeatureAccess()

    if (loading) return <LoaderComponent />

    const isAzure = connectionData.isAzureActive
    const isAws = connectionData.isAwsActive
    const isGcp = connectionData.isGcpActive

    const nothing = !isAzure && !isAws && !isGcp
    const clientName = connectionData.client

    const azureAccounts = connectionData.azureAccountsList || []
    const awsAccounts = connectionData.awsAccountsList || []
    const gcpAccounts = connectionData.gcpAccountsList || []

    const hasMultipleAzureAccounts = azureAccounts.length > 1
    const hasMultipleAwsAccounts = awsAccounts.length > 1
    const hasMultipleGcpAccounts = gcpAccounts.length > 1

    // Lógica para determinar si el usuario puede avanzar
    // NO tiene múltiples cuentas (es única) O SI tiene múltiples y ya seleccionó una.
    const isAzureReady = !hasMultipleAzureAccounts || !!activeAzureAccountId
    const isAwsReady = !hasMultipleAwsAccounts || !!activeAwsAccountId
    const isGcpReady = !hasMultipleGcpAccounts || !!activeGcpAccountId

    const handleAccountChange = (
        newId: string,
        cloud: 'azure' | 'aws' | 'gcp'
    ) => {
        const targetAccounts =
            cloud === 'azure'
                ? azureAccounts
                : cloud === 'aws'
                ? awsAccounts
                : gcpAccounts

        const selectedAccount = targetAccounts.find(acc => acc.id === newId)
        if (!selectedAccount) return

        if (cloud === 'azure') setActiveAzureAccountId(newId)
        if (cloud === 'aws') setActiveAwsAccountId(newId)
        if (cloud === 'gcp') setActiveGcpAccountId(newId)

        const client = connectionData.client

        const newDbAzure =
            cloud === 'azure'
                ? selectedAccount.db
                : connectionData.dbAzureName

        const newDbAws =
            cloud === 'aws'
                ? selectedAccount.db
                : connectionData.dbAwsName

        const newDbGcp =
            cloud === 'gcp'
                ? selectedAccount.db
                : connectionData.dbGcpName

        swapContextToken(client, newDbAzure, newDbAws, newDbGcp)
    }

    const handleEnterAzure = () => {
        // Solo permitimos navegar si está listo
        if (!isAzureReady) return

        // Si es cuenta única, aseguramos el token con la cuenta [0]
        if (!hasMultipleAzureAccounts && azureAccounts.length > 0) {
             const defaultAcc = azureAccounts[0]
             swapContextToken(clientName, defaultAcc.db, connectionData.dbAwsName, connectionData.dbGcpName)
        }
        
        router.push(`/azure?client=${clientName}`)
    }

    const handleEnterAws = () => {
        if (!isAwsReady) return

        if (!hasMultipleAwsAccounts && awsAccounts.length > 0) {
             const defaultAcc = awsAccounts[0]
             swapContextToken(clientName, connectionData.dbAzureName, defaultAcc.db, connectionData.dbGcpName)
        }

        router.push(`/aws?client=${clientName}`)
    }

    const handleEnterGcp = () => {
        if (!isGcpReady) return

        if (!hasMultipleGcpAccounts && gcpAccounts.length > 0) {
             const defaultAcc = gcpAccounts[0]
             swapContextToken(clientName, connectionData.dbAzureName, connectionData.dbAwsName, defaultAcc.db)
        }

        router.push(`/gcp?client=${clientName}`)
    }

    const stopProp = (e: React.MouseEvent) => {
        e.stopPropagation()
    }

    return (
        <section className="mx-auto max-w-5xl px-4">
            {isGlobalAdmin && (
                <div className="pb-4 mb-4 border-b">
                    <ClientSelectorComponent />
                    <p className="text-xs text-gray-500 mt-1">
                        Visualizando: {clientName} (Plan: {currentPlanName.toUpperCase()})
                    </p>
                </div>
            )}

            <header className="mb-6">
                <h2 className="text-2xl font-semibold">Nubes registradas</h2>
                <p className="text-sm text-muted-foreground">
                    Selecciona la nube para redirigirte al dashboard correspondiente.
                </p>
            </header>

            <div
                className={cn(
                    "grid gap-4",
                    (isAzure && isAws) || isGcp
                        ? "grid-cols-1 md:grid-cols-2"
                        : "grid-cols-1"
                )}
            >
                {/* ================= AZURE ================= */}
                {isAzure && (
                    <div
                        onClick={handleEnterAzure}
                        className={cn(
                            "group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition",
                            isAzureReady 
                                ? "hover:shadow-md cursor-pointer border-border" 
                                : "border-gray-200 bg-gray-50/50 cursor-default",
                            (hasMultipleAzureAccounts && isAzureReady) ? "border-blue-400" : ""
                        )}
                    >
                        <div className={cn("absolute -right-10 -top-10 h-32 w-32 rounded-full blur-2xl transition-opacity", isAzureReady ? "bg-primary/10 opacity-100" : "opacity-0")} />

                        <div className="flex items-center gap-4">
                            <div className={cn("relative h-12 w-12 rounded-xl ring-1 bg-background grid place-items-center transition-all", isAzureReady ? "ring-border grayscale-0" : "ring-gray-200 grayscale")}>
                                <Image alt="Azure" src="/azure.svg" width={26} height={26} />
                            </div>

                            <div className="flex-1 z-10">
                                <h3 className={cn("text-lg font-semibold", !isAzureReady && "text-gray-500")}>Microsoft Azure</h3>

                                {hasMultipleAzureAccounts && (
                                    <div className="mt-1 flex items-center gap-2" onClick={stopProp}>
                                        <span className="text-xs text-muted-foreground">Cuenta:</span>
                                        <Select
                                            value={activeAzureAccountId || ""}
                                            onValueChange={(val) => handleAccountChange(val, 'azure')}
                                        >
                                            <SelectTrigger className={cn("h-7 w-[180px] text-xs font-bold transition-colors", activeAzureAccountId ? "text-blue-700 bg-white/50 border-blue-200" : "text-gray-500 border-dashed border-gray-400")}>
                                                <SelectValue placeholder="Seleccione una cuenta..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {azureAccounts.map(acc => (
                                                    <SelectItem key={acc.id} value={acc.id} className="text-xs">
                                                        {acc.alias}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                {!hasMultipleAzureAccounts && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Costos, recursos, tendencias y funciones especializadas.
                                    </p>
                                )}
                            </div>

                            {/* Solo mostramos la flecha si está listo */}
                            {isAzureReady && (
                                <ArrowRight className="h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                            )}
                        </div>
                    </div>
                )}

                {/* ================= AWS ================= */}
                {isAws && (
                    <div
                        onClick={handleEnterAws}
                        className={cn(
                            "group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition",
                            isAwsReady 
                                ? "hover:shadow-md cursor-pointer border-border" 
                                : "border-gray-200 bg-gray-50/50 cursor-default",
                            (hasMultipleAwsAccounts && isAwsReady) ? "border-amber-400" : ""
                        )}
                    >
                        <div className={cn("absolute -left-10 -bottom-10 h-32 w-32 rounded-full blur-2xl transition-opacity", isAwsReady ? "bg-amber-500/10 opacity-100" : "opacity-0")} />

                        <div className="flex items-center gap-4">
                            <div className={cn("relative h-12 w-12 rounded-xl ring-1 bg-background grid place-items-center transition-all", isAwsReady ? "ring-border grayscale-0" : "ring-gray-200 grayscale")}>
                                <Image alt="AWS" src="/aws.svg" width={26} height={26} />
                            </div>

                            <div className="flex-1 z-10">
                                <h3 className={cn("text-lg font-semibold", !isAwsReady && "text-gray-500")}>Amazon Web Services</h3>

                                {hasMultipleAwsAccounts && (
                                    <div className="mt-1 flex items-center gap-2" onClick={stopProp}>
                                        <span className="text-xs text-muted-foreground">Cuenta:</span>
                                        <Select
                                            value={activeAwsAccountId || ""}
                                            onValueChange={(val) => handleAccountChange(val, 'aws')}
                                        >
                                            <SelectTrigger className={cn("h-7 w-[180px] text-xs font-bold transition-colors", activeAwsAccountId ? "text-amber-700 bg-white/50 border-amber-200" : "text-gray-500 border-dashed border-gray-400")}>
                                                <SelectValue placeholder="Seleccione una cuenta..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {awsAccounts.map(acc => (
                                                    <SelectItem key={acc.id} value={acc.id} className="text-xs">
                                                        {acc.alias}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                {!hasMultipleAwsAccounts && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        EC2, RDS, S3 y costos por región.
                                    </p>
                                )}
                            </div>

                            {isAwsReady && (
                                <ArrowRight className="h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                            )}
                        </div>
                    </div>
                )}

                {/* ================= GCP ================= */}
                {isGcp && (
                    <div
                        onClick={handleEnterGcp}
                        className={cn(
                            "group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition",
                            isGcpReady 
                                ? "hover:shadow-md cursor-pointer border-border" 
                                : "border-gray-200 bg-gray-50/50 cursor-default",
                            (hasMultipleGcpAccounts && isGcpReady) ? "border-green-400" : ""
                        )}
                    >
                        <div className={cn("absolute -right-10 -bottom-10 h-32 w-32 rounded-full blur-2xl transition-opacity", isGcpReady ? "bg-green-500/10 opacity-100" : "opacity-0")} />

                        <div className="flex items-center gap-4">
                            <div className={cn("relative h-12 w-12 rounded-xl ring-1 bg-background grid place-items-center transition-all", isGcpReady ? "ring-border grayscale-0" : "ring-gray-200 grayscale")}>
                                <Image alt="GCP" src="/gcp.svg" width={26} height={26} />
                            </div>

                            <div className="flex-1 z-10">
                                <h3 className={cn("text-lg font-semibold", !isGcpReady && "text-gray-500")}>Google Cloud Platform</h3>

                                {hasMultipleGcpAccounts && (
                                    <div className="mt-1 flex items-center gap-2" onClick={stopProp}>
                                        <span className="text-xs text-muted-foreground">Proyecto:</span>
                                        <Select
                                            value={activeGcpAccountId || ""}
                                            onValueChange={(val) => handleAccountChange(val, 'gcp')}
                                        >
                                            <SelectTrigger className={cn("h-7 w-[180px] text-xs font-bold transition-colors", activeGcpAccountId ? "text-green-700 bg-white/50 border-green-200" : "text-gray-500 border-dashed border-gray-400")}>
                                                <SelectValue placeholder="Seleccione una cuenta..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {gcpAccounts.map(acc => (
                                                    <SelectItem key={acc.id} value={acc.id} className="text-xs">
                                                        {acc.alias}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                {!hasMultipleGcpAccounts && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Compute Engine, Cloud SQL, Storage y BigQuery.
                                    </p>
                                )}
                            </div>

                            {isGcpReady && (
                                <ArrowRight className="h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                            )}
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
    )
}