'use client'
import { Dispatch, SetStateAction, useState } from 'react'
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import useSWR from 'swr'
import { Value } from '@radix-ui/react-select'

interface InstancesEc2FilterComponentProps {
    instance:string,
    setInstance:Dispatch<SetStateAction<string>>,
    startDate: Date,
    endDate: Date,
    region: string,
    selectedKey: string,
    selectedValue: string
}

const fetcherPost = (url: string, tags: { Key: string; Value: string } | null = null) =>
    fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: tags ? JSON.stringify([tags]) : null, // enviar lista de tags
    }).then(res => res.json());
export const InstancesEc2FilterComponent = ({ instance, setInstance, startDate, endDate, region, selectedKey, selectedValue }: InstancesEc2FilterComponentProps) => {
    const [open, setOpen] = useState(false);    
    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';
    const url = `${process.env.NEXT_PUBLIC_API_URL}/vm/all-instances-ec2?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}`;

    const tagsBody = selectedKey && selectedValue ? { Key: selectedKey, Value: selectedValue } : null;

    const { data, error, isLoading } = useSWR([url, tagsBody], ([url, tags]) => fetcherPost(url, tags));


    if (isLoading) return <div>Cargando...</div>
    if (error) return <div>Error al cargar datos</div>
    console.log(data);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    size='lg'
                    aria-expanded={open}
                    className="w-[300px] justify-between"
                >
                    {instance
                        ? data.find((i:unknown) => i === instance)
                        : "Seleccione una instancia..."}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandInput placeholder="Buscar Instancia..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>No se encontró Instancia.</CommandEmpty>
                        <CommandGroup>
                            {data && data?.map((i:unknown) => (
                                <CommandItem
                                    key={i}
                                    value={i}
                                    onSelect={(currentValue) => {
                                        setInstance(currentValue === instance ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    {i}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            instance === i ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}