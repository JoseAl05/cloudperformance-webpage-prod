'use client';

import { FiltersComponent } from '@/components/general_gcp/filters/FiltersComponent';
import { TopFilestoreSubUtilizadoComponent } from './TopFilestoreSubUtilizadoComponent';

export const MainViewTopFilestoreSubUtilizadoComponent = () => {
    return (
        <>
            <div className="mb-6 px-6">
                <h1 className="text-2xl font-bold tracking-tight">Top Filestore Sub-Utilizados</h1>
                <p className="text-muted-foreground mt-1">
                    Instancias GCP Filestore con mayor desperdicio de capacidad y oportunidades de ahorro
                </p>
            </div>
            <FiltersComponent
                dateFilter={true}
                projectFilter={true}
                regionFilter={true}
                filestoreTierFilter={true}
                tagFilter={true}
                Component={TopFilestoreSubUtilizadoComponent}
            />
        </>
    );
};