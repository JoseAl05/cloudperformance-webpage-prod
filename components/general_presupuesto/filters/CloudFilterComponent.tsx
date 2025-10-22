'use client';
import { useSession } from "@/hooks/useSession";
import { Dispatch, SetStateAction, useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
interface CloudFilterComponentProps {
    selectedCloud: string;
    setSelectedCloud: Dispatch<SetStateAction<string>>;
    isCloudMultiSelect: boolean;
}

export const CloudFilterComponent = ({
    selectedCloud,
    setSelectedCloud,
    isCloudMultiSelect,
}: CloudFilterComponentProps) => {

  // [{ label: 'Cloud AWS', value: 'AWS' }, { label: 'Cloud AZURE', value: 'AZURE' },]
    const actualSession = useSession();
    const isAzure = actualSession.user?.is_azure;
    const isAws = actualSession.user?.is_aws;
  
    const cloudOptions = [
      ...(isAws ? [{ label: "Cloud AWS", value: "AWS" }] : []),
      ...(isAzure ? [{ label: "Cloud AZURE", value: "AZURE" }] : []),
    ];


    const [open, setOpen] = useState(false);

    const getDisplayText = () => {
        if (!selectedCloud || selectedCloud.trim() === '') return 'Selecciona Nube';
        if (selectedCloud === 'all_clouds') return 'Todas las nubes';
        const cloudArray = selectedCloud.split(',').filter((s) => s.trim() !== '');
        if (cloudArray.length === 1) {
            const found = cloudOptions.find((r) => r.value === cloudArray[0]);
            return found ? found.label : cloudArray[0];
        }
        return `${cloudArray.length} nubes seleccionadas`;
    };

    const handleCloudToggle = (cloudValue: string) => {
        let cloudArray = selectedCloud ? selectedCloud.split(',').filter(Boolean) : [];

        if (cloudValue === 'all_clouds') {
            cloudArray = ['all_clouds'];
        } else {
            cloudArray = cloudArray.filter((r) => r !== 'all_clouds');
            if (cloudArray.includes(cloudValue)) {
                cloudArray = cloudArray.filter((r) => r !== cloudValue);
            } else {
                cloudArray.push(cloudValue);
            }
        }
        setSelectedCloud(cloudArray.length ? cloudArray.join(',') : 'all_clouds');
    };

    const selectedCloudArray = selectedCloud ? selectedCloud.split(',').filter(Boolean) : [];

    return !isCloudMultiSelect ? (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between bg-transparent">
                    {getDisplayText()}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Buscar nube..." />
                    <CommandList>
                        <CommandEmpty>No se encontró nube.</CommandEmpty>
                        <CommandGroup className="max-h-[250px] overflow-y-auto">
                            {cloudOptions.map((cloud) => (
                                <CommandItem
                                    key={cloud.value}
                                    value={cloud.value}
                                    onSelect={(currentValue) => {
                                        setSelectedCloud(currentValue);
                                        setOpen(false);
                                    }}
                                >
                                    <Check className={cn('mr-2 h-4 w-4', selectedCloud === cloud.value ? 'opacity-100' : 'opacity-0')} />
                                    {cloud.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    ) : (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-[250px] justify-between">
                    {getDisplayText()}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandInput placeholder="Buscar nube..." />
                    <CommandEmpty>No se encontró la nube.</CommandEmpty>
                    <CommandGroup className="max-h-[200px] overflow-y-auto">
                        <CommandItem value="all_clouds" onSelect={() => handleCloudToggle('all_clouds')}>
                            <Check className={`mr-2 h-4 w-4 ${selectedCloud === 'all_clouds' ? 'opacity-100' : 'opacity-0'}`} />
                            Todas las Nubes
                        </CommandItem>
                        {cloudOptions
                            .filter((r) => r.value !== 'all_clouds')
                            .map((cloud) => (
                                <CommandItem key={cloud.value} value={cloud.value} onSelect={() => handleCloudToggle(cloud.value)}>
                                    <Check
                                        className={`mr-2 h-4 w-4 ${selectedCloudArray.includes(cloud.value) ? 'opacity-100' : 'opacity-0'}`}
                                    />
                                    {cloud.label}
                                </CommandItem>
                            ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
