'use client'

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

const DIMENSIONS_MAPPING = {
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
    "cost_center": "Centro de Costos"
} as const;

const GROUPS = [
    {
        label: "Infraestructura",
        keys: ["product", "consumed_service", "resource_location", "resource_group"] as DimensionKey[]
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

interface IntraCloudBillingDimSelectionComponentProps {
    dimension: string;
    setDimension: Dispatch<SetStateAction<string>>;
}

export const IntraCloudBillingDimSelectionComponent = ({ dimension, setDimension }: IntraCloudBillingDimSelectionComponentProps) => {
    return (
        <Select value={dimension} onValueChange={setDimension}>
            <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Seleccionar dimensión" />
            </SelectTrigger>
            <SelectContent>
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