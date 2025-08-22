import { FiltersComponent } from '@/components/general/FiltersComponent'
import { InstanceEc2CpuMetricsComponent } from './InstanceEc2CpuMetricsComponent'

export const MainViewInstancesEc2Component = () => {
    return (
        <div className="w-full min-w-0 space-y-4">
            <h1 className='text-3xl text-center font-bold'>Instancias EC2</h1>
            <div className="w-full min-w-0">
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
        </div>

    )
}