'use client'
import { Dispatch, SetStateAction, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useSWR from 'swr'
import { LoaderComponent } from '../LoaderComponent'

interface SubscriptionsFilterComponentProps {
    subscription: string
    setSubscription: Dispatch<SetStateAction<string>>
}

const fetcherGet = (url: string) =>
    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            'Content-Type': 'application/json',
        },
    }).then(res => res.json());

export const SubscriptionsFilterComponent = ({
    subscription, setSubscription
}: SubscriptionsFilterComponentProps) => {
    const [open, setOpen] = useState(false);

    const url = `${process.env.NEXT_PUBLIC_API_URL}/azure/subscriptions/all-subscriptions`;
    const { data, error, isLoading } = useSWR<string[]>(url, fetcherGet);

    if (isLoading) return <LoaderComponent size='small'/>
    if (error) return <div>Error al cargar suscripciones</div>

    const subscriptions: string[] = Array.isArray(data) ? data : []
    const noSubscriptions = subscriptions.length === 0

    const selectedSubscriptionsArray = subscription ? subscription.split(',').filter(Boolean) : [];

    const getDisplayText = () => {
        if (noSubscriptions) return 'Sin suscripciones disponibles';
        if (!subscription || selectedSubscriptionsArray.includes('all_subscriptions')) return 'Todas las Suscripciones';
        if (selectedSubscriptionsArray.length === 1) return selectedSubscriptionsArray[0];
        return `${selectedSubscriptionsArray.length} suscripciones seleccionadas`;
    };

    const handleSubscriptionToggle = (subscriptionValue: string) => {
        let subs = selectedSubscriptionsArray.slice();
        if (subscriptionValue === 'all_subscriptions') {
            subs = ['all_subscriptions'];
        } else {
            subs = subs.filter((s) => s !== 'all_subscriptions');
            if (subs.includes(subscriptionValue)) subs = subs.filter((s) => s !== subscriptionValue);
            else subs.push(subscriptionValue);
        }
        setSubscription(subs.length ? subs.join(',') : '');
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-full justify-between bg-transparent'
                    disabled={noSubscriptions}
                >
                    <span className="truncate text-left max-w-[85%]">
                        {getDisplayText()}
                    </span>
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
                <Command>
                    <CommandInput placeholder='Buscar suscripción...' />
                    <CommandEmpty>
                        {noSubscriptions ? 'No hay suscripciones disponibles.' : 'No se encontró suscripción.'}
                    </CommandEmpty>
                    {!noSubscriptions && (
                        <CommandGroup className='max-h-[200px] overflow-y-auto'>
                            <CommandItem value='all_subscriptions' onSelect={() => handleSubscriptionToggle('all_subscriptions')}>
                                <Check className={cn('mr-2 h-4 w-4', selectedSubscriptionsArray.includes('all_subscriptions') ? 'opacity-100' : 'opacity-0')} />
                                Todas las Suscripciones
                            </CommandItem>
                            {subscriptions.map((sub: string) => (
                                <CommandItem key={sub} value={sub} onSelect={() => handleSubscriptionToggle(sub)}>
                                    <Check className={cn('mr-2 h-4 w-4', selectedSubscriptionsArray.includes(sub) ? 'opacity-100' : 'opacity-0')} />
                                    {sub}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                </Command>
            </PopoverContent>
        </Popover>
    );
};