'use client'

import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface CopyButtonProps {
    text: string
    label?: string
}

/** Botón compacto que copia `text` al portapapeles y muestra un toast con `label`. */
export const CopyButton = ({ text, label = 'Copiado' }: CopyButtonProps) => (
    <Button
        variant="ghost"
        size="sm"
        className="h-7 px-2"
        onClick={async () => {
            try {
                await navigator.clipboard.writeText(text)
                toast.success(label)
            } catch {
                toast.error('No se pudo copiar al portapapeles')
            }
        }}
        aria-label="Copiar"
        title="Copiar"
    >
        <Copy className="h-3.5 w-3.5" />
    </Button>
)
