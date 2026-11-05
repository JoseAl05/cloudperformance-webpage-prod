'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ExternalLink, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose
} from '@/components/ui/dialog'

interface ResourceBillingWrapperProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
    title?: string
    fullViewPath: string
}

export const ResourceBillingWrapper = ({
    isOpen,
    onClose,
    children,
    title = "Detalle de Facturación",
    fullViewPath
}: ResourceBillingWrapperProps) => {
    const router = useRouter()

    const handleRedirect = () => {
        onClose()
        router.push(fullViewPath)
    }

    if (!isOpen) return null

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-[90vw] lg:max-w-7xl h-[90vh] overflow-y-auto flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        {title}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 py-4">
                    {children}
                </div>

                <DialogFooter className="border-t pt-4 sm:justify-between gap-4">
                    <Button variant="outline" onClick={onClose} className="gap-2">
                        <X className="w-4 h-4" />
                        Cerrar
                    </Button>

                    <Button
                        onClick={handleRedirect}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                    >
                        Ir a vista Facturación
                        <ExternalLink className="w-4 h-4" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}