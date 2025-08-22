import { FiltersComponent } from '@/components/general/FiltersComponent'
import { InstanceEc2CpuMetricsComponent } from './InstanceEc2CpuMetricsComponent'

export const MainViewInstancesEc2Component = () => {
    return(
        <div>
            <h1 className='text-3xl text-center font-bold'>Instancias EC2</h1>
            <FiltersComponent
                Component={InstanceEc2CpuMetricsComponent}
                dateFilter
                regionFilter
                instancesFilter
                tagsFilter
                collection='aws_ec2_instances'
                tagColumnName='Tags'
            />
        </div>
    )
}