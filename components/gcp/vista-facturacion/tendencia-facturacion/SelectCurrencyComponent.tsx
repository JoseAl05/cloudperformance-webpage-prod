'use client'

import { useEffect } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Dispatch, SetStateAction } from 'react';

interface SelectCurrencyComponentProps {
    currency: string;
    setCurrency: Dispatch<SetStateAction<string>>;
}

export const SelectCurrencyComponent = ({ currency, setCurrency }: SelectCurrencyComponentProps) => {

    const currencyList = [
        { label: "Original", value: "original" },
        { label: "USD", value: "usd" }
    ]

    useEffect(() => {
        if (currency !== "usd") {
            setCurrency("usd")
        }
    }, [])

    return (
        <Select
            value={currency}
            onValueChange={setCurrency}
            disabled
        >
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
                    <SelectItem key={curr.value} value={curr.value}>
                        {curr.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}