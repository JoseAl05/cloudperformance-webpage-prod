'use client'

import { DateFilterComponent } from '@/components/general/DateFilterComponent'
import { HeatmapQuotasComponent } from './HeatmapQuotasComponent'

export const MainViewHeatmapQuotasComponents = () => {
    return(
        <div>
            <h1 className='text-3xl text-center font-bold'>Gráfico Heatmap Quotas</h1>
            <DateFilterComponent
                Component={HeatmapQuotasComponent}
            />
        </div>
    )
}