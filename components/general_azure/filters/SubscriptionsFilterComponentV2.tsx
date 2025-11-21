'use client'
import { Dispatch, SetStateAction, useMemo, useState, useEffect } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useSWR from 'swr'
import { LoaderComponent } from '@/components/general_azure/LoaderComponent'

interface SubscriptionsFilterComponentV2Props {
    subscription: string
    setSubscription: Dispatch<SetStateAction<string>>
}

type ApiSubscription =
    | { id_subscription: string; subscription_name: string }
    | string

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

export const SubscriptionsFilterComponentV2 = ({
    subscription,
    setSubscription,
}: SubscriptionsFilterComponentV2Props) => {
    const [open, setOpen] = useState(false)

    const url = `/api/azure/bridge/azure/subscriptions/all-subscriptions-ids`
    const { data, error, isLoading } = useSWR<ApiSubscription[]>(url, fetcher)

    const subscriptions = useMemo(() => {
        if (!Array.isArray(data)) return [] as { id: string; name: string }[]
        if (data.length === 0) return []
        if (typeof data[0] === 'string') {
            return (data as string[]).map((id) => ({ id, name: id }))
        }
        return (data as { id_subscription: string; subscription_name: string }[]).map((s) => ({
            id: s.id_subscription,
            name: s.subscription_name || s.id_subscription,
        }))
    }, [data])

    const hasData = subscriptions.length > 0

    useEffect(() => {
        if (isLoading || !data) return

        if (!hasData) {
            if (subscription) setSubscription('')
            return
        }

        if (hasData && !subscription) {
            setSubscription('all_subscriptions')
        }
    }, [data, isLoading, hasData, subscription, setSubscription])

    const selectedIds = useMemo(
        () => (subscription ? subscription.split(',').filter(Boolean) : []),
        [subscription]
    )

    const idToName = useMemo(() => {
        const map = new Map<string, string>()
        for (const s of subscriptions) map.set(s.id, s.name)
        return map
    }, [subscriptions])

    if (isLoading) return <LoaderComponent size="small" />
    if (error) return <div>Error al cargar suscripciones</div>

    const getDisplayText = () => {
        if (!hasData) return 'Sin suscripciones disponibles'

        if (selectedIds.includes('all_subscriptions') || (!subscription && hasData)) return 'Todas las Suscripciones'

        if (selectedIds.length === 1) return idToName.get(selectedIds[0]) ?? selectedIds[0]
        return `${selectedIds.length} suscripciones seleccionadas`
    }

    const handleSubscriptionToggle = (subscriptionIdOrAll: string) => {
        let subs = [...selectedIds]
        if (subscriptionIdOrAll === 'all_subscriptions') {
            subs = ['all_subscriptions']
        } else {
            subs = subs.filter((s) => s !== 'all_subscriptions')
            if (subs.includes(subscriptionIdOrAll)) {
                subs = subs.filter((s) => s !== subscriptionIdOrAll)
            } else {
                subs.push(subscriptionIdOrAll)
            }
        }
        setSubscription(subs.length ? subs.join(',') : '')
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between bg-transparent"
                    disabled={!hasData}
                >
                    <span className="truncate text-left max-w-[85%]">{getDisplayText()}</span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Buscar suscripción..." />
                    <CommandEmpty>
                        {!hasData ? 'No hay suscripciones disponibles.' : 'No se encontró suscripción.'}
                    </CommandEmpty>

                    {hasData && (
                        <CommandGroup className="max-h-[200px] overflow-y-auto">
                            <CommandItem
                                value="all_subscriptions"
                                onSelect={() => handleSubscriptionToggle('all_subscriptions')}
                            >
                                <Check
                                    className={cn(
                                        'mr-2 h-4 w-4',
                                        selectedIds.includes('all_subscriptions') ? 'opacity-100' : 'opacity-0'
                                    )}
                                />
                                Todas las Suscripciones
                            </CommandItem>

                            {subscriptions.map(({ id, name }) => (
                                <CommandItem
                                    key={id}
                                    value={`${name} ${id}`}
                                    onSelect={() => handleSubscriptionToggle(id)}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            (selectedIds.includes(id) && !selectedIds.includes('all_subscriptions')) ? 'opacity-100' : 'opacity-0'
                                        )}
                                    />
                                    <span className="truncate">{name}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                </Command>
            </PopoverContent>
        </Popover>
    )
}