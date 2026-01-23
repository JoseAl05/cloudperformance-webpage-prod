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

interface SelectCurrencyComponentProps {
    currency: string;
    setCurrency: Dispatch<SetStateAction<string>>;
    payload: ReqPayload
}

export const SelectCurrencyComponent = ({ currency, setCurrency }: SelectCurrencyComponentProps) => {

    const currencyList = [
        {
            label: "Original",
            value: "original"
        },
        {
            label: "USD",
            value: "usd"
        }
    ]
    return (
        <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Seleccionar divisa" />
            </SelectTrigger>
            <SelectContent position="popper" side="bottom" avoidCollisions={false}>
                <SelectGroup>
                    <SelectLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Divisa
                    </SelectLabel>
                </SelectGroup>
                {currencyList.map((curr) => (
                    <div key={curr.label}>
                        <SelectItem value={curr.value} className="cursor-pointer">
                            {curr.label}
                        </SelectItem>
                    </div>
                ))}
            </SelectContent>
        </Select>
    )
}