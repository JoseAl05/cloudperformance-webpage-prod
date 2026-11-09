import { ChartLine, Info } from 'lucide-react';
import { FiltersComponent } from '@/components/general_vcenter/filters/FiltersComponent';
import { VcenterVmConsumptionComponent } from '@/components/vcenter/vista-consumo-vm/ConsumoVmComponent';

export const MainViewConsumoVmComponent = () => (
    <div className='w-full min-w-0 space-y-4'>
        <div className='mb-8 space-y-4'>
            <div className='flex items-center gap-3'>
                <div className='h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                    <ChartLine className='h-6 w-6 text-blue-600' />
                </div>
                <div>
                    <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
                        Consumo/No Consumo VMs
                    </h1>
                    <p className='text-gray-500 dark:text-gray-400'>
                        Análisis de consumo por máquina virtual de vCenter
                    </p>
                </div>
            </div>
            <div className='flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200'>
                <Info className='h-4 w-4 mt-0.5 flex-shrink-0' />
                <p>
                    Cada sincronización de vCenter es una foto: el uso de CPU y memoria corresponde al último chequeo de
                    monitoreo de cada VM, el disco a las particiones informadas por VMware Tools y el costo a la
                    prefactura (cargo fijo y variable). Sin un período seleccionado se muestra la última
                    sincronización; al elegir un rango se usa la última foto de cada VM dentro de él.
                </p>
            </div>
        </div>
        <div className='w-full min-w-0'>
            <FiltersComponent Component={VcenterVmConsumptionComponent} />
        </div>
    </div>
);
