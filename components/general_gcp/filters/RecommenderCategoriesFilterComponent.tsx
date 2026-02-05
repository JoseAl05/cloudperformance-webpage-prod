'use client';
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
import { gcp_recommender_categories } from '@/lib/gcp_recommender_categories';

interface RecommenderCategoriesFilterComponentProps {
    category: string;
    setCategory: Dispatch<SetStateAction<string>>;
    isRecommenderCategoryMultiSelect: boolean;
}

export const RecommenderCategoriesFilterComponent = ({
    isRecommenderCategoryMultiSelect,
    category,
    setCategory,
}: RecommenderCategoriesFilterComponentProps) => {
    const [open, setOpen] = useState(false);

    const getDisplayText = () => {
        if (!category || category.trim() === '') return 'Selecciona categoría';
        if (category === 'all_categories') return 'Todas las Categorías';
        const categoryArray = category.split(',').filter((s) => s.trim() !== '');
        if (categoryArray.length === 1) {
            const found = gcp_recommender_categories.find((r) => r.value === categoryArray[0]);
            return found ? found.label : categoryArray[0];
        }
        return `${categoryArray.length} categorías seleccionadas`;
    };

    const handleCategoryToggle = (categoryValue: string) => {
        let categoryArray = category ? category.split(',').filter(Boolean) : [];

        if (categoryValue === 'all_categories') {
            categoryArray = ['all_categories'];
        } else {
            categoryArray = categoryArray.filter((r) => r !== 'all_categories');
            if (categoryArray.includes(categoryValue)) {
                categoryArray = categoryArray.filter((r) => r !== categoryValue);
            } else {
                categoryArray.push(categoryValue);
            }
        }
        setCategory(categoryArray.length ? categoryArray.join(',') : 'all_categories');
    };

    const selectedCategoryArray = category ? category.split(',').filter(Boolean) : [];

    return !isRecommenderCategoryMultiSelect ? (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between bg-transparent">
                    {getDisplayText()}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Buscar categoría..." />
                    <CommandList>
                        <CommandEmpty>No se encontró categoría.</CommandEmpty>
                        <CommandGroup className="max-h-[250px] overflow-y-auto">
                            {gcp_recommender_categories.map((category) => (
                                <CommandItem
                                    key={category.value}
                                    value={category.value}
                                    onSelect={(currentValue) => {
                                        setCategory(currentValue);
                                        setOpen(false);
                                    }}
                                >
                                    <Check className={cn('mr-2 h-4 w-4', category === category.value ? 'opacity-100' : 'opacity-0')} />
                                    {category.label}
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
                    <CommandInput placeholder="Buscar categoría..." />
                    <CommandEmpty>No se encontró la categoría.</CommandEmpty>
                    <CommandGroup className="max-h-[200px] overflow-y-auto">
                        <CommandItem value="all_categories" onSelect={() => handleCategoryToggle('all_categories')}>
                            <Check className={`mr-2 h-4 w-4 ${category === 'all_categories' ? 'opacity-100' : 'opacity-0'}`} />
                            Todas las Categorías
                        </CommandItem>
                        {gcp_recommender_categories
                            .filter((c) => c.value !== 'all_categories')
                            .map((category) => (
                                <CommandItem key={category.value} value={category.value} onSelect={() => handleCategoryToggle(category.value)}>
                                    <Check
                                        className={`mr-2 h-4 w-4 ${selectedCategoryArray.includes(category.value) ? 'opacity-100' : 'opacity-0'}`}
                                    />
                                    {category.label}
                                </CommandItem>
                            ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
