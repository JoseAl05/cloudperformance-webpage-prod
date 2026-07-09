import { MainViewRecommenderComponent } from '@/components/gcp/vista-recommender/MainViewRecommenderComponent';
import { Suspense } from 'react';

export default function DashboardGcpRecommender() {
    return (
        <div>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewRecommenderComponent />
            </Suspense>
        </div>
    )
}