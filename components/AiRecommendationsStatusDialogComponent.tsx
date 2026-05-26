'use client'

import useSWR from 'swr';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { RecommendationStatusGroup } from '@/interfaces/ai-recommendations/aiRecommendations';
import { Loader2, AlertTriangle, History } from 'lucide-react';
import { AiRecommendationStatusHistoryComponent } from '@/components/AiRecommendationStatusHistoryComponent';

interface AiRecommendationsStatusDialogComponentProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    recGroupId: string | null;
    cloud: string;
}



type FetcherError = Error & { status?: number };

const historyFetcher = async (url: string): Promise<RecommendationStatusGroup[]> => {
    const response = await fetch(url);
    if (!response.ok) {
        const err: FetcherError = new Error(`Request failed with status ${response.status}`);
        err.status = response.status;
        throw err;
    }
    return response.json();
};

export const AiRecommendationsStatusDialogComponent = ({
    open,
    onOpenChange,
    recGroupId,
    cloud,
}: AiRecommendationsStatusDialogComponentProps) => {
    let HISTORY_ENDPOINT = '/api/azure/bridge/azure/get_recommendation_execution_status_history';

    switch (cloud) {
        case 'azure':
            HISTORY_ENDPOINT = '/api/azure/bridge/azure/get_recommendation_execution_status_history';
            break;
        case 'aws':
            HISTORY_ENDPOINT = '/api/aws/bridge/advisor/get_recommendation_execution_status_history';
            break;
        case 'gcp':
            HISTORY_ENDPOINT = '/api/gcp/bridge/gcp/ai_recommendations/get_recommendation_execution_status_history';
             break;
        default:
            break;
    }
    const swrKey = open && recGroupId
        ? `${HISTORY_ENDPOINT}?rec_group_id=${encodeURIComponent(recGroupId)}`
        : null;

    const { data, error, isLoading } = useSWR<RecommendationStatusGroup[]>(swrKey, historyFetcher);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] sm:max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-base">
                        <History className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        Seguimiento de Recomendación
                    </DialogTitle>
                </DialogHeader>

                {isLoading && (
                    <div className="py-16 flex flex-col items-center justify-center text-slate-600 dark:text-slate-400">
                        <Loader2 className="h-8 w-8 animate-spin mb-3" />
                        <span className="text-sm">Cargando historial...</span>
                    </div>
                )}

                {error && !isLoading && (
                    <div className="py-12 flex flex-col items-center justify-center text-center">
                        <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400 mb-3" />
                        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                            Error al cargar el historial
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            No fue posible obtener el seguimiento de la recomendación.
                        </p>
                    </div>
                )}

                {data && !isLoading && !error && (
                    <AiRecommendationStatusHistoryComponent data={data} />
                )}
            </DialogContent>
        </Dialog>
    );
};