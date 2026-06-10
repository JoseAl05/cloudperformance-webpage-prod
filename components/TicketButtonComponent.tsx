import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react';

interface TicketButtonComponentProps {
    connectorType: string;
    onCreate: Promise<void>;
    isCreating: boolean;
    displayName: string;
}

export const TicketButtonComponent = ({ connectorType, onCreate, isCreating, displayName }: TicketButtonComponentProps) => {
    return (
        <>
            {
                displayName === 'ServiceNow' && (
                    <Button
                        key={connectorType}
                        variant='outline'
                        size='sm'
                        onClick={onCreate}
                        disabled={isCreating}
                        className='gap-2 rounded-full font-medium text-[#16241f] border border-[#293E40]/20 bg-gradient-to-b from-[#62D84E] to-[#4FC93B] shadow-sm shadow-[#62D84E]/30 hover:from-[#6FE05B] hover:to-[#52CE3E] hover:shadow-md hover:shadow-[#62D84E]/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#62D84E]/50 focus-visible:ring-offset-2 dark:border-white/10 dark:focus-visible:ring-offset-0 transition-all duration-300 ease-out disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none'
                    >
                        {isCreating ? (
                            <>
                                <Loader2 className='h-4 w-4 animate-spin' />
                                Creando ticket...
                            </>
                        ) : (
                            `Crear ticket en ${displayName}`
                        )}
                    </Button>
                )
            }
            {
                displayName === 'Jira' && (
                    <Button
                        key={connectorType}
                        variant='outline'
                        size='sm'
                        onClick={onCreate}
                        disabled={isCreating}
                        className='gap-2 rounded-full font-medium text-white hover:text-white border border-white/10 bg-gradient-to-b from-[#0052CC] to-[#0747A6] shadow-sm shadow-[#0052CC]/30 hover:from-[#0C66E4] hover:to-[#0052CC] hover:shadow-md hover:shadow-[#0052CC]/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#0052CC]/50 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-0 transition-all duration-300 ease-out disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none'
                    >
                        {isCreating ? (
                            <>
                                <Loader2 className='h-4 w-4 animate-spin' />
                                Creando ticket...
                            </>
                        ) : (
                            `Crear ticket en ${displayName}`
                        )}
                    </Button>
                )
            }
        </>
    )
}