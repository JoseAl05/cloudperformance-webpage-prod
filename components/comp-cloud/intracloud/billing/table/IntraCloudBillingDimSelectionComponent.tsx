'use client'

import { ReqPayload } from '@/components/comp-cloud/intracloud/IntraCloudConfigComponent';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
    SelectSeparator
} from "@/components/ui/select"
import { Dispatch, SetStateAction } from 'react';

type DimensionKey = keyof typeof DIMENSIONS_MAPPING;

interface IntraCloudBillingDimSelectionComponentProps {
    dimension: string;
    setDimension: Dispatch<SetStateAction<string>>;
    payload: ReqPayload
}

export const IntraCloudBillingDimSelectionComponent = ({ dimension, setDimension, payload }: IntraCloudBillingDimSelectionComponentProps) => {

    let DIMENSIONS_MAPPING = {}
    let GROUPS = []
    if (payload.cloud_provider === 'Azure') {
        DIMENSIONS_MAPPING = {
            "product": "Servicio Contratado",
            "consumed_service": "Proveedor de Servicio",
            "resource_location": "Región",
            "resource_group": "Grupo de Recursos",
            "meter_category": "Tipo de Servicio",
            "meter_sub_category": "Subtipo de Recursos",
            "meter_name": "Ítem Facturable",
            "unit_of_measure": "Unidad de Cobro",
            "pricing_model": "Modelo de Compra",
            "charge_type": "Tipo de Transacción",
            "billing_profile_name": "Cuenta de Facturación",
            "customer_name": "Cliente / Titular",
            "cost_center": "Centro de Costos",
            "service_family": "Familia de Servicios"
        } as const;

        GROUPS = [
            {
                label: "Infraestructura",
                keys: ["product", "consumed_service", "resource_location", "resource_group", "service_family"] as DimensionKey[]
            },
            {
                label: "Detalle de Consumo",
                keys: ["meter_category", "meter_sub_category", "meter_name", "unit_of_measure"] as DimensionKey[]
            },
            {
                label: "Financiero",
                keys: ["pricing_model", "charge_type", "billing_profile_name"] as DimensionKey[]
            },
            {
                label: "Organización",
                keys: ["customer_name", "cost_center"] as DimensionKey[]
            }
        ];
    } else if (payload.cloud_provider === 'AWS') {
        DIMENSIONS_MAPPING = {
            "SERVICE": "Servicio AWS",
            "LINKED_ACCOUNT": "Cuenta del Proyecto",
            "REGION": "Región Geográfica",
            "AZ": "Zona de Disponibilidad",
            "USAGE_TYPE": "Detalle de Uso (SKU)",
            "OPERATION": "Acción / Operación",
            "INSTANCE_TYPE": "Tamaño de Instancia",
            "INSTANCE_TYPE_FAMILY": "Familia de Instancia",
            "PLATFORM": "Plataforma (OS)",
            "OPERATING_SYSTEM": "Sistema Operativo",
            "TENANCY": "Exclusividad de Hardware",
            "DATABASE_ENGINE": "Motor de Base de Datos",
            "CACHE_ENGINE": "Motor de Caché",
            "DEPLOYMENT_OPTION": "Opción de Despliegue",
            "PURCHASE_TYPE": "Modalidad de Compra",
            "RECORD_TYPE": "Naturaleza del Cargo",
            "BILLING_ENTITY": "Entidad de Facturación",
            "LEGAL_ENTITY_NAME": "Entidad Legal",
            "INVOICING_ENTITY": "Emisor de Factura",
            "SAVINGS_PLANS_TYPE": "Tipo de Plan de Ahorro",
            "SAVINGS_PLAN_ARN": "ID Plan de Ahorro",
            "RESERVATION_ID": "ID de Reserva"
        } as const;

        GROUPS = [
            {
                label: "General y Ubicación",
                keys: ["SERVICE", "LINKED_ACCOUNT", "REGION", "AZ"] as AwsDimensionKey[]
            },
            {
                label: "Detalle Técnico",
                keys: ["USAGE_TYPE", "OPERATION", "INSTANCE_TYPE", "INSTANCE_TYPE_FAMILY", "PLATFORM", "DATABASE_ENGINE"] as AwsDimensionKey[]
            },
            {
                label: "Facturación y Contratos",
                keys: ["PURCHASE_TYPE", "RECORD_TYPE", "BILLING_ENTITY"] as AwsDimensionKey[]
            },
            {
                label: "Ahorros y Reservas",
                keys: ["SAVINGS_PLANS_TYPE", "RESERVATION_ID"] as AwsDimensionKey[]
            }
        ];
    } else if (payload.cloud_provider === 'GCP') {
        DIMENSIONS_MAPPING = {
            "service_description": "Servicio GCP",
            "sku_description": "Detalle de Uso (SKU)",
            "location_region": "Ubicación",
            "project_id": "ID del Proyecto",
            "project_name": "Nombre del Proyecto",
            "usage_unit": "Unidad de Uso",
            "usage_billed_unit": "Unidad Facturada"
        } as const;

        GROUPS = [
            {
                label: "General y Ubicación",
                keys: ["service_description", "location_region", "project_id"] as GcpDimensionKey[]
            },
            {
                label: "Detalle Técnico",
                keys: ["sku_description", "usage_unit", "usage_billed_unit"] as GcpDimensionKey[]
            },
            {
                label: "Organización",
                keys: ["project_name"] as GcpDimensionKey[]
            }
        ];
    }
    return (
        <Select value={dimension} onValueChange={setDimension}>
            <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Seleccionar dimensión" />
            </SelectTrigger>
            <SelectContent position="popper" side="bottom" avoidCollisions={false}>
                {GROUPS.map((group, groupIndex) => (
                    <div key={group.label}>
                        <SelectGroup>
                            <SelectLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                {group.label}
                            </SelectLabel>
                            {group.keys.map((key) => (
                                <SelectItem key={key} value={key} className="cursor-pointer">
                                    {DIMENSIONS_MAPPING[key]}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                        {groupIndex < GROUPS.length - 1 && <SelectSeparator className="my-2" />}
                    </div>
                ))}
            </SelectContent>
        </Select>
    )
}