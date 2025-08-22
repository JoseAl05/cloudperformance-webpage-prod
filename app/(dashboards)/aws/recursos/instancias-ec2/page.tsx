import { MainViewInstancesEc2Component } from '@/components/aws/vista-recursos/instancias-ec2/MainViewInstancesEc2Component';

export default function DashboardInstanciasEc2() {
    return(
        <div className=''>
            <h1>Dashboard AWS / Instancias EC2</h1>
            <MainViewInstancesEc2Component />
        </div>
    )
}