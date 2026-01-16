'use client'

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dispatch, SetStateAction } from 'react';

interface IntraCloudStorageCategorySelectionComponentProps {
    category: string;
    setCategory: Dispatch<SetStateAction<string>>;
}


export const IntraCloudStorageCategorySelectionComponent = ({ category, setCategory }: IntraCloudStorageCategorySelectionComponentProps) => {
    return (
        <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Seleccionar dimensión" />
            </SelectTrigger>
            <SelectContent position="popper" side="bottom" avoidCollisions={false}>
                <SelectGroup>
                    <SelectLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Categoría
                    </SelectLabel>
                    <SelectItem value="storageService" className="cursor-pointer">
                        Servicio/s Storage
                    </SelectItem>
                    <SelectItem value="diskService" className="cursor-pointer">
                        Servicio Discos
                    </SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}