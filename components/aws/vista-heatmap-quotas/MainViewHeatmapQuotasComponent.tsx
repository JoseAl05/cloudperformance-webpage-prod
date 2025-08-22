import { FiltersComponent } from '@/components/general/FiltersComponent'
import { HeatmapQuotasComponent } from './HeatmapQuotasComponent'

export const MainViewHeatmapQuotasComponent = () => {
    return(
        <div>
            <h1 className='text-3xl text-center font-bold'>Gráfico Heatmap Quotas</h1>
            <FiltersComponent
                Component={HeatmapQuotasComponent}
            />
        </div>
    )
}