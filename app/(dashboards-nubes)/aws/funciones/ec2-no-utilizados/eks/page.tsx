import { MainViewUnusedEksComponent } from '@/components/aws/vista-funciones/unused-ec2/MainViewUnusedEksComponent';
import { Suspense } from 'react';

export default function DashboardAwsEksEc2Unused() {
    return (
        <div>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewUnusedEksComponent />
            </Suspense>
        </div>
    )
}