'use client'
import { useEffect, useState } from 'react';
import { DatePicker } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import { RegionFilterComponent } from './RegionFilterComponent';
import { InstancesEc2FilterComponent } from './InstancesEc2FilterComponent';
import { TagFilterComponent } from './TagsFilterComponent';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Calendar, MapPin, Server } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface FiltersComponentProps {
    Component: (params: { startDate: Date; endDate?: Date }) => React.JSX.Element;
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
    const [instance, setInstance] = useState("");
    const [startDate, setStartDate] = useState<Date>(yesterday);
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [tempRange, setTempRange] = useState<[Date | null, Date | null]>([startDate, endDate]);
    const [selectedRegion, setSelectedRegion] = useState("all_regions");
    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const [selectedValue, setSelectedValue] = useState<string | null>(null);
    const [tagsData, setTagsData] = useState<unknown[]>([]);

    console.log(instance)


    useEffect(() => {
        const hasTagsForRegion = tagsData?.some(item => item?.Tags?.length > 0);
        if (!hasTagsForRegion) {
            setSelectedKey(null);
            setSelectedValue(null);
        }
    }, [selectedRegion, tagsData, setSelectedKey, setSelectedValue]);
    useEffect(() => {
        const [start, end] = tempRange;
        if (start && end) {
            setStartDate(start);
            setEndDate(end);
        }
    }, [tempRange]);
    const onChange = (dates: [Date | null, Date | null]) => {
        setTempRange(dates);
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Filtros</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Período
                            </label>
                            <div className="mt-1 relative">
                                {dateFilter && (
                                    <DatePicker
                                        selected={tempRange[0]}
                                        onChange={onChange}
                                        startDate={tempRange[0]}
                                        endDate={tempRange[1]}
                                        selectsRange
                                        className='border rounded-md p-2 bg-background text-foreground w-full focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent dark:bg-background dark:border-border dark:text-foreground'
                                        calendarClassName='dark:bg-popover dark:border-border dark:text-popover-foreground'
                                        dayClassName={(date) => 'hover:bg-accent hover:text-accent-foreground", "dark:hover:bg-accent dark:hover:text-accent-foreground'}
                                    />
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Región
                            </label>
                            <div className="mt-1 relative">
                                {regionFilter && (
                                    <RegionFilterComponent
                                        selectedRegion={selectedRegion}
                                        setSelectedRegion={setSelectedRegion}
                                    />
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Tags
                            </label>
                            <div className="mt-1 relative">
                                {tagsFilter && (
                                    <TagFilterComponent
                                        startDate={startDate}
                                        endDate={endDate}
                                        region={selectedRegion}
                                        collection={collection}
                                        tagColumnName={tagColumnName}
                                        selectedKey={selectedKey}
                                        selectedValue={selectedValue}
                                        setSelectedKey={setSelectedKey}
                                        setSelectedValue={setSelectedValue}
                                        setTagsData={setTagsData}
                                    />
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Instancia
                            </label>
                            <div className="mt-1 relative">
                                {instancesFilter && (
                                    <InstancesEc2FilterComponent
                                        instance={instance}
                                        setInstance={setInstance}
                                        startDate={startDate}
                                        endDate={endDate}
                                        region={selectedRegion}
                                        selectedKey={selectedKey ?? ""}
                                        selectedValue={selectedValue ?? ""}
                                    />
                                )}
                            </div>
                        </div>
                        <div className="flex items-end">
                            <Button className="w-full">
                                Aplicar Filtros
                            </Button>
                        </div>
                    </div>
                </CardContent>
                <Component startDate={startDate} endDate={endDate} instance={instance} />
            </Card>
        </div>
        // <div className='w-full min-w-0 pt-15'>
        //     <div className='flex justify-start gap-5'>
        // {dateFilter && (
        //     <DatePicker
        //         selected={tempRange[0]}
        //         onChange={onChange}
        //         startDate={tempRange[0]}
        //         endDate={tempRange[1]}
        //         selectsRange
        //         className='border rounded-md p-2 bg-background text-foreground w-full focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent dark:bg-background dark:border-border dark:text-foreground'
        //         calendarClassName='dark:bg-popover dark:border-border dark:text-popover-foreground'
        //         dayClassName={(date) => 'hover:bg-accent hover:text-accent-foreground", "dark:hover:bg-accent dark:hover:text-accent-foreground'}
        //     />
        // )}

        // {regionFilter && (
        //     <RegionFilterComponent
        //         selectedRegion={selectedRegion}
        //         setSelectedRegion={setSelectedRegion}
        //     />
        // )}

        // {tagsFilter && (
        //     <TagFilterComponent
        //         startDate={startDate}
        //         endDate={endDate}
        //         region={selectedRegion}
        //         collection={collection}
        //         tagColumnName={tagColumnName}
        //         selectedKey={selectedKey}
        //         selectedValue={selectedValue}
        //         setSelectedKey={setSelectedKey}
        //         setSelectedValue={setSelectedValue}
        //         setTagsData={setTagsData}
        //     />
        // )}

        // {instancesFilter && (
        //     <InstancesEc2FilterComponent
        //         instance={instance}
        //         setInstance={setInstance}
        //         startDate={startDate}
        //         endDate={endDate}
        //         region={selectedRegion}
        //         selectedKey={selectedKey ?? ""}
        //         selectedValue={selectedValue ?? ""}
        //     />
        // )}
        //     </div>

        //     <Component startDate={startDate} endDate={endDate} instance={instance} />
        // </div>
    );
};
