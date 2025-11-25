'use client'
import { FiltersComponent } from '@/components/general_aws/filters/FiltersComponent'
import { ChartLine } from 'lucide-react'
import { EksConsumeComponent } from '@/components/aws/vista-consumos/ec2/eks/EksConsumeComponent'

export const MainViewConsumeEksComponent = () => {
    return (
        <div className='w-full min-w-0 space-y-4'>
            <div className='mb-8'>
                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                    <div>
                        <div className='flex items-center gap-3 mb-2'>
                            <div className='h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                                <ChartLine className='h-6 w-6 text-blue-600' />
                            </div>
                            <div>
                                <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>Consumo/No Consumo Nodos de Clusters EKS</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='w-full min-w-0'>
                <FiltersComponent
                    Component={EksConsumeComponent}
                    dateFilter
                    regionFilter
                    eksFilter
                    isEksMultiSelect
                    isEksAsgMultiSelect
                    isEksAsgInstanceMultiSelect
                    tagsFilter
                    collection='aws_eks_clusters_details'
                    tagColumnName='tags'
                />
            </div>
        </div>
    )
}
