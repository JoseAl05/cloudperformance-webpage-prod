'use client'

import { ModalResourceBillingComponent } from '@/components/aws/facturacion-recurso/ModalResourceBillingComponent';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { useState } from 'react';

export const ResourceBillingActionCell = ({ resourceId, startDateHistory }: { resourceId: string, startDateHistory?:string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex items-center">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(true)}
                className="h-8 px-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
            >
                <FileText className="mr-2 h-4 w-4" />
                Ver Costos
            </Button>
            <ModalResourceBillingComponent
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                resourceId={resourceId}
                startDateHistory={startDateHistory}
            />
        </div>
    );
};