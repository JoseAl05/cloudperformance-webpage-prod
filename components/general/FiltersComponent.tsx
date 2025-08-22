'use client'
import { useEffect, useState } from 'react';
import { DatePicker } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import { RegionFilterComponent } from './RegionFilterComponent';
import { InstancesEc2FilterComponent } from './InstancesEc2FilterComponent';
import { TagFilterComponent } from './TagsFilterComponent';

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
        <div className='w-full min-w-0 pt-15'>
            <div className='flex justify-center gap-5'>
                {dateFilter && (
                    <DatePicker
                        selected={tempRange[0]}
                        onChange={onChange}
                        startDate={tempRange[0]}
                        endDate={tempRange[1]}
                        selectsRange
                        className='border rounded-md p-2 bg-[color-mix(in_oklab,var(--input)_30%,transparent)] w-[13rem]'
                    />
                )}

                {regionFilter && (
                    <RegionFilterComponent
                        selectedRegion={selectedRegion}
                        setSelectedRegion={setSelectedRegion}
                    />
                )}

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

            <Component startDate={startDate} endDate={endDate} instance={instance} />
        </div>
    );
};
