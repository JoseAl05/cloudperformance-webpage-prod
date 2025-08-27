// 'use client'
// import { useEffect, useState } from 'react';
// import { DatePicker } from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// import { RegionFilterComponent } from './RegionFilterComponent';
// import { InstancesEc2FilterComponent } from './InstancesEc2FilterComponent';
// import { TagFilterComponent } from './TagsFilterComponent';
// import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
// import { Calendar, MapPin, Server, Tag } from 'lucide-react';
// import { Input } from '../ui/input';
// import { Button } from '../ui/button';

// interface FiltersComponentProps {
//     Component: (params: { startDate: Date; endDate?: Date }) => React.JSX.Element;
//     dateFilter?: boolean;
//     regionFilter?: boolean;
//     instancesFilter?: boolean;
//     tagsFilter?: boolean;
//     collection?: string;
//     tagColumnName?: string;
// }

// export const FiltersComponent = ({
//     Component,
//     dateFilter = true,
//     regionFilter = false,
//     instancesFilter = false,
//     tagsFilter = false,
//     collection = null,
//     tagColumnName = null
// }: FiltersComponentProps) => {
//     const yesterday = new Date();
//     yesterday.setDate(yesterday.getDate() - 1);
//     const [instance, setInstance] = useState('');
//     const [startDate, setStartDate] = useState<Date>(yesterday);
//     const [endDate, setEndDate] = useState<Date>(new Date());
//     const [tempRange, setTempRange] = useState<[Date | null, Date | null]>([startDate, endDate]);
//     const [selectedRegion, setSelectedRegion] = useState('all_regions');
//     const [selectedKey, setSelectedKey] = useState<string | null>(null);
//     const [selectedValue, setSelectedValue] = useState<string | null>(null);
//     const [tagsData, setTagsData] = useState<unknown[]>([]);

//     useEffect(() => {
//         const hasTagsForRegion = tagsData?.some(item => item?.Tags?.length > 0);
//         if (!hasTagsForRegion) {
//             setSelectedKey(null);
//             setSelectedValue(null);
//         }
//     }, [selectedRegion, tagsData, setSelectedKey, setSelectedValue]);
//     useEffect(() => {
//         const [start, end] = tempRange;
//         if (start && end) {
//             setStartDate(start);
//             setEndDate(end);
//         }
//     }, [tempRange]);
//     const onChange = (dates: [Date | null, Date | null]) => {
//         setTempRange(dates);
//     };

//     return (
//         <div className='space-y-6'>
//             <Card>
//                 <CardHeader className='pb-4'>
//                     <CardTitle className='text-xl font-semibold flex items-center gap-2'>
//                         <Server className='h-5 w-5' />
//                         Filtros
//                     </CardTitle>
//                 </CardHeader>
//                 <CardContent className='space-y-6'>
//                     <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
//                         {dateFilter && (
//                             <div className='space-y-2'>
//                                 <label className='text-sm font-medium text-foreground flex items-center gap-2'>
//                                     <Calendar className='h-4 w-4' />
//                                     Período
//                                 </label>
//                                 <DatePicker
//                                     selected={tempRange[0]}
//                                     onChange={onChange}
//                                     startDate={tempRange[0]}
//                                     endDate={tempRange[1]}
//                                     selectsRange
//                                     className='w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent'
//                                     calendarClassName='dark:bg-popover dark:border-border dark:text-popover-foreground'
//                                     dayClassName={() =>
//                                         'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent dark:hover:text-accent-foreground'
//                                     }
//                                 />
//                             </div>
//                         )}
//                         {regionFilter && (
//                             <div className='space-y-2'>
//                                 <label className="text-sm font-medium text-foreground flex items-center gap-2">
//                                     <MapPin className="h-4 w-4" />
//                                     Región
//                                 </label>
//                                 <RegionFilterComponent
//                                     selectedRegion={selectedRegion}
//                                     setSelectedRegion={setSelectedRegion}
//                                 />
//                             </div>
//                         )}

//                         {tagsFilter && (
//                             <div className='space-y-2'>
//                                 <label className="text-sm font-medium text-foreground flex items-center gap-2">
//                                     <Tag className="h-4 w-4" />
//                                     Tags
//                                 </label>
//                                 <TagFilterComponent
//                                     startDate={startDate}
//                                     endDate={endDate}
//                                     region={selectedRegion}
//                                     collection={collection}
//                                     tagColumnName={tagColumnName}
//                                     selectedKey={selectedKey}
//                                     selectedValue={selectedValue}
//                                     setSelectedKey={setSelectedKey}
//                                     setSelectedValue={setSelectedValue}
//                                     setTagsData={setTagsData}
//                                 />
//                             </div>
//                         )}
//                         {instancesFilter && (
//                             <div className='space-y-2'>
//                                 <label className="text-sm font-medium text-foreground flex items-center gap-2">
//                                     <Server className="h-4 w-4" />
//                                     Instancia
//                                 </label>
//                                 <InstancesEc2FilterComponent
//                                     instance={instance}
//                                     setInstance={setInstance}
//                                     startDate={startDate}
//                                     endDate={endDate}
//                                     region={selectedRegion}
//                                     selectedKey={selectedKey ?? ''}
//                                     selectedValue={selectedValue ?? ''}
//                                 />
//                             </div>
//                         )}
//                     </div>
//                     <div className='flex items-center'>
//                         <Button className='max-w-5xl'>
//                             Aplicar Filtros
//                         </Button>
//                     </div>
//                 </CardContent>
//                 <Component startDate={startDate} endDate={endDate} instance={instance} />
//             </Card>
//         </div>
//     );
// };
'use client'
import { useEffect, useState } from 'react';
import { DatePicker } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { RegionFilterComponent } from './RegionFilterComponent';
import { InstancesEc2FilterComponent } from './InstancesEc2FilterComponent';
import { TagFilterComponent } from './TagsFilterComponent';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Calendar, MapPin, Server, Tag } from 'lucide-react';
import { Button } from '../ui/button';

interface FiltersComponentProps {
    Component: (params: {
        startDate: Date;
        endDate?: Date;
        instance: string;
        region: string;
        selectedKey?: string | null;
        selectedValue?: string | null;
    }) => React.JSX.Element;
    dateFilter?: boolean;
    regionFilter?: boolean;
    instancesFilter?: boolean;
    tagsFilter?: boolean;
    collection?: string;
    tagColumnName?: string;
}

export const FiltersComponent = ({
    Component,
    dateFilter = true,
    regionFilter = false,
    instancesFilter = false,
    tagsFilter = false,
    collection = null,
    tagColumnName = null
}: FiltersComponentProps) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const [tempRange, setTempRange] = useState<[Date | null, Date | null]>([yesterday, new Date()]);
    const [tempInstance, setTempInstance] = useState('');
    const [tempRegion, setTempRegion] = useState('all_regions');
    const [tempKey, setTempKey] = useState<string | null>(null);
    const [tempValue, setTempValue] = useState<string | null>(null);

    const [filters, setFilters] = useState({
        startDate: yesterday,
        endDate: new Date(),
        instance: '',
        region: 'all_regions',
        selectedKey: null as string | null,
        selectedValue: null as string | null
    });

    const [tagsData, setTagsData] = useState<unknown[]>([]);

    useEffect(() => {
        const hasTagsForRegion = tagsData?.some(item => (item as unknown)?.Tags?.length > 0);
        if (!hasTagsForRegion) {
            setTempKey(null);
            setTempValue(null);
        }
    }, [tempRegion, tagsData]);

    const onChange = (dates: [Date | null, Date | null]) => {
        setTempRange(dates);
    };

    const applyFilters = () => {
        const [start, end] = tempRange;
        if (start && end) {
            setFilters({
                startDate: start,
                endDate: end,
                instance: tempInstance,
                region: tempRegion,
                selectedKey: tempKey,
                selectedValue: tempValue
            });
        }
    };

    return (
        <div className='space-y-6'>
            <Card>
                <CardHeader className='pb-4'>
                    <CardTitle className='text-xl font-semibold flex items-center gap-2'>
                        <Server className='h-5 w-5' />
                        Filtros
                    </CardTitle>
                </CardHeader>
                <CardContent className='space-y-6'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                        {dateFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <Calendar className='h-4 w-4' />
                                    Período
                                </label>
                                <DatePicker
                                    selected={tempRange[0]}
                                    onChange={onChange}
                                    startDate={tempRange[0]}
                                    endDate={tempRange[1]}
                                    selectsRange
                                    className='w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent'
                                />
                            </div>
                        )}
                        {regionFilter && (
                            <div className='space-y-2'>
                                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    Región
                                </label>
                                <RegionFilterComponent
                                    selectedRegion={tempRegion}
                                    setSelectedRegion={setTempRegion}
                                />
                            </div>
                        )}
                        {tagsFilter && (
                            <div className='space-y-2'>
                                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                    <Tag className="h-4 w-4" />
                                    Tags
                                </label>
                                <TagFilterComponent
                                    startDate={filters.startDate}
                                    endDate={filters.endDate}
                                    region={tempRegion}
                                    collection={collection}
                                    tagColumnName={tagColumnName}
                                    selectedKey={tempKey}
                                    selectedValue={tempValue}
                                    setSelectedKey={setTempKey}
                                    setSelectedValue={setTempValue}
                                    setTagsData={setTagsData}
                                />
                            </div>
                        )}
                        {instancesFilter && (
                            <div className='space-y-2'>
                                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                    <Server className="h-4 w-4" />
                                    Instancia
                                </label>
                                <InstancesEc2FilterComponent
                                    instance={tempInstance}
                                    setInstance={setTempInstance}
                                    startDate={filters.startDate}
                                    endDate={filters.endDate}
                                    region={tempRegion}
                                    selectedKey={tempKey ?? ''}
                                    selectedValue={tempValue ?? ''}
                                />
                            </div>
                        )}
                    </div>
                    <div className='flex items-center'>
                        <Button onClick={applyFilters} className='max-w-5xl'>
                            Aplicar Filtros
                        </Button>
                    </div>
                </CardContent>

                {/* ✅ Renderiza el componente solo con filtros aplicados */}
                <Component
                    startDate={filters.startDate}
                    endDate={filters.endDate}
                    instance={filters.instance}
                    region={filters.region}
                    selectedKey={filters.selectedKey}
                    selectedValue={filters.selectedValue}
                />
            </Card>
        </div>
    );
};
