
import { FiltersComponent } from '@/components/general/FiltersComponent'
import { SavingPlansViewComponent } from '@/components/aws/vista-saving-plan/SavingPlansComponent'


export const MainViewSavingPlansComponent = () => {
    return(
        <div>
            <h1 className='text-3xl text-center font-bold'>Dashboard AWS / Saving Plans</h1>
            <FiltersComponent
                Component={SavingPlansViewComponent}
                dateFilter
            />
        </div>
    )
}