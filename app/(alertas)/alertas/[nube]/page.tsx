import AlertsManager from '@/components/alertas/AlertsManager';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const PROVIDER_NAMES: Record<string, string> = {
    azure: 'Microsoft Azure',
    aws: 'Amazon Web Services',
    gcp: 'Google Cloud Platform'
};

export default async function AlertasNubePage({ params }: { params: Promise<{ nube: string }> }) {
    const { nube } = await params;

    if (!['azure', 'aws', 'gcp'].includes(nube)) {
        return <div>Nube no válida</div>;
    }

    const formattedProviderName = PROVIDER_NAMES[nube.toLowerCase()] || nube;

    return (
        <div className="p-6 max-w-7xl mx-auto w-full">
            <div className="mb-6 flex flex-col gap-4">
                <Link href="/alertas" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors w-fit">
                    <ArrowLeft className="w-4 h-4" /> Volver a selección de nubes
                </Link>
                
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Alertas de {formattedProviderName}
                        </h1>
                        <div className="flex items-center justify-center bg-white border border-gray-100 rounded-md px-2.5 py-1 shadow-sm h-8">
                            <img 
                                src={`/${nube.toLowerCase()}.svg`} 
                                alt={`Logo de ${formattedProviderName}`} 
                                className="h-5 w-auto object-contain" 
                            />
                        </div>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">
                        Gestiona los umbrales de presupuesto para tus recursos de {formattedProviderName}.
                    </p>
                </div>
            </div>
            
            <AlertsManager provider={nube} />
        </div>
    );
}