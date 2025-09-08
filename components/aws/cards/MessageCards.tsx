import { cn } from '@/lib/utils'

interface MessageCardProps {
    icon: React.ElementType
    title: string
    description?: string
    tone?: 'info' | 'error' | 'warn'
    className?: string
}

export const MessageCard = ({
    icon: Icon,
    title,
    description,
    tone = 'info',
    className,
}: MessageCardProps) => {
    const toneStyles =
        tone === 'error'
            ? 'border-red-500/30 bg-red-500/10 text-red-300'
            : tone === 'warn'
                ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                : 'border-blue-500/30 bg-blue-500/10 text-blue-300'

    return (
        <div className={cn(`w-full max-w-3xl mx-auto rounded-xl border p-4 ${toneStyles}`, className)}>
            <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-background/40">
                    <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                    <h3 className="font-semibold leading-none">{title}</h3>
                    {description ? <p className="text-sm/6 opacity-90">{description}</p> : null}
                </div>
            </div>
        </div>
    )
}
