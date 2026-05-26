"use client";

import { useState, type ComponentType } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plug, KanbanSquare, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { JiraConnectorFormComponent } from '@/components/profile/connectors/JiraConnectorFormComponent';
import { ServiceNowConnectorFormComponent } from '@/components/profile/connectors/ServiceNowConnectorFormComponent';
import { useConnector } from '@/hooks/useConnectors';

type ConnectorStatus = "configured" | "not_configured" | "coming_soon";

type ConnectorDefinition = {
    id: string;
    name: string;
    description: string;
    Icon: LucideIcon;
    status: ConnectorStatus;
    FormComponent: ComponentType | null;
};

const CONNECTORS: ConnectorDefinition[] = [
    {
        id: "jira",
        name: "Jira",
        description: "Gestión de tickets y proyectos",
        Icon: KanbanSquare,
        status: "not_configured",
        FormComponent: JiraConnectorFormComponent,
    },
    {
        id: "servicenow",
        name: "ServiceNow",
        description: "Gestión de tickets y proyectos",
        Icon: KanbanSquare,
        status: "not_configured",
        FormComponent: ServiceNowConnectorFormComponent,
    }
];

const STATUS_LABELS: Record<ConnectorStatus, string> = {
    configured: "Configurado",
    not_configured: "No configurado",
    coming_soon: "Próximamente",
};

const STATUS_CLASSES: Record<ConnectorStatus, string> = {
    configured:
        "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-400 border-transparent",
    not_configured:
        "bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/40 dark:text-amber-400 border-transparent",
    coming_soon:
        "bg-muted text-muted-foreground hover:bg-muted border-transparent",
};

export const ConnectorsManagerComponent = () => {
    const firstAvailable = CONNECTORS.find((c) => c.status !== "coming_soon");
    const [selectedId, setSelectedId] = useState<string | null>(
        firstAvailable?.id ?? null
    );
    const { connectors } = useConnector();

    const validateConnector = (connectorId: string) => {
        return connectors?.some((c) => c.connector_type === connectorId);
    }

    const selectedConnector =
        CONNECTORS.find((c) => c.id === selectedId) ?? null;
    const SelectedForm = selectedConnector?.FormComponent ?? null;

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Plug className="h-5 w-5" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold leading-tight">Conectores</h2>
                    <p className="text-sm text-muted-foreground">
                        Gestiona las integraciones de CloudPerformance con servicios externos.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-[300px_1fr]">
                <Card className="h-fit">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Disponibles
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-2">
                        <nav className="flex flex-col gap-1">
                            {CONNECTORS.map((connector) => {
                                const isSelected = connector.id === selectedId;
                                const isDisabled = connector.status === "coming_soon";
                                return (
                                    <button
                                        key={connector.id}
                                        type="button"
                                        disabled={isDisabled}
                                        onClick={() => setSelectedId(connector.id)}
                                        className={cn(
                                            "flex items-start gap-3 rounded-md px-3 py-2.5 text-left transition-colors",
                                            "hover:bg-accent hover:text-accent-foreground",
                                            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent",
                                            isSelected && "bg-accent text-accent-foreground"
                                        )}
                                    >
                                        <connector.Icon className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="truncate text-sm font-medium">
                                                    {connector.name}
                                                </span>
                                            </div>
                                            <p className="truncate text-xs text-muted-foreground">
                                                {connector.description}
                                            </p>
                                            <Badge
                                                variant="secondary"
                                                className={cn(
                                                    "mt-1.5 text-[10px] font-medium",
                                                    validateConnector(connector.id) ? STATUS_CLASSES['configured'] : STATUS_CLASSES['not_configured']
                                                )}
                                            >
                                                {
                                                    validateConnector(connector.id) ? STATUS_LABELS['configured'] : STATUS_LABELS['not_configured']
                                                }
                                            </Badge>
                                        </div>
                                    </button>
                                );
                            })}
                        </nav>
                    </CardContent>
                </Card>

                <div className="min-w-0">
                    {SelectedForm ? (
                        <SelectedForm />
                    ) : (
                        <Card className="w-full">
                            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                                <Plug className="mb-3 h-10 w-10 text-muted-foreground/40" />
                                <p className="text-sm font-medium">Selecciona un conector</p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Elige una integración del panel izquierdo para configurarla.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};