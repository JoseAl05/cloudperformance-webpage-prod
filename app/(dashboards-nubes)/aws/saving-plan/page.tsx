import { MainViewSavingPlansComponent } from '@/components/aws/vista-saving-plan/MainViewSavingPlansComponent';
import { Suspense } from 'react';
export default function DashboardSavingPlanAws() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewSavingPlansComponent />
            </Suspense>
        </div>
    )
}