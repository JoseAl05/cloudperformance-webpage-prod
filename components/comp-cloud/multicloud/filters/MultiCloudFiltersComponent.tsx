'use client'

import { useEffect, useState, ComponentType } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Filter, XCircle, Tags } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { MultiCloudTagFilter } from '@/components/comp-cloud/multicloud/filters/MultiCloudTagFilter';
import { CloudProvider, CloudAccount, MultiTenantSelection } from '@/hooks/useMultiTenantSelection';

export interface AppliedMultiCloudFilters {
    startDate: Date;
    endDate: Date;
    dateMode: 'monthly';
    selectedMonths: string[];
    azTagKey: string | null;
    azTagValue: string | null;
    awsTagKey: string | null;
    awsTagValue: string | null;
    gcpTagKey: string | null;
    gcpTagValue: string | null;
}

interface MultiCloudFiltersComponentProps {
    selectedClouds: CloudProvider[];
    selectedTenants: MultiTenantSelection;
    accountsList: {
        azure: CloudAccount[];
        aws: CloudAccount[];
        gcp: CloudAccount[];
    };
    Component: ComponentType<AppliedMultiCloudFilters & {
        selectedClouds: CloudProvider[];
        selectedTenants: MultiTenantSelection;
        accountsList: {
            azure: CloudAccount[];
            aws: CloudAccount[];
            gcp: CloudAccount[];
        };
    }>;
}

export const MultiCloudFiltersComponent = ({
    selectedClouds,
    selectedTenants,
    accountsList,
    Component
}: MultiCloudFiltersComponentProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const getInitialFilters = () => {
        const monthParam = searchParams.get('month');
        const yearParam = searchParams.get('year');
        const today = new Date();
        
        let singleMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        let startDate = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0);
        let endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

        if (monthParam && yearParam) {
            singleMonth = new Date(Number(yearParam), Number(monthParam) - 1, 1);
            startDate = new Date(Number(yearParam), Number(monthParam) - 1, 1, 0, 0, 0);
            endDate = new Date(Number(yearParam), Number(monthParam), 0, 23, 59, 59);
        }

        return {
            startDate,
            endDate,
            singleMonth,
            azTagKey: searchParams.get('az_key') || 'allKeys',
            azTagValue: searchParams.get('az_val') || 'allValues',
            awsTagKey: searchParams.get('aws_key') || 'allKeys',
            awsTagValue: searchParams.get('aws_val') || 'allValues',
            gcpTagKey: searchParams.get('gcp_key') || 'allKeys',
            gcpTagValue: searchParams.get('gcp_val') || 'allValues',
        };
    };

    const [filters, setFilters] = useState(getInitialFilters);

    const [tempSingleMonth, setTempSingleMonth] = useState<Date | null>(filters.singleMonth);
    const [tempAzTag, setTempAzTag] = useState({ key: filters.azTagKey, val: filters.azTagValue });
    const [tempAwsTag, setTempAwsTag] = useState({ key: filters.awsTagKey, val: filters.awsTagValue });
    const [tempGcpTag, setTempGcpTag] = useState({ key: filters.gcpTagKey, val: filters.gcpTagValue });

    useEffect(() => {
        const newFilters = getInitialFilters();
        setFilters(newFilters);
        setTempSingleMonth(newFilters.singleMonth);
        setTempAzTag({ key: newFilters.azTagKey, val: newFilters.azTagValue });
        setTempAwsTag({ key: newFilters.awsTagKey, val: newFilters.awsTagValue });
        setTempGcpTag({ key: newFilters.gcpTagKey, val: newFilters.gcpTagValue });
    }, [searchParams]);

    const applyFilters = () => {
        const query = new URLSearchParams(searchParams.toString());
        
        if (tempSingleMonth) {
            query.set('month', String(tempSingleMonth.getMonth() + 1));
            query.set('year', String(tempSingleMonth.getFullYear()));
            
            const start = new Date(tempSingleMonth.getFullYear(), tempSingleMonth.getMonth(), 1, 0, 0, 0);
            const end = new Date(tempSingleMonth.getFullYear(), tempSingleMonth.getMonth() + 1, 0, 23, 59, 59);
            query.set('startDate', start.toISOString());
            query.set('endDate', end.toISOString());
        }

        const setQueryTag = (prefix: string, tag: { key: string | null, val: string | null }) => {
            if (tag.key && tag.key !== 'allKeys' && tag.val && tag.val !== 'allValues') {
                query.set(`${prefix}_key`, tag.key);
                query.set(`${prefix}_val`, tag.val);
            } else {
                query.delete(`${prefix}_key`);
                query.delete(`${prefix}_val`);
            }
        };

        setQueryTag('az', tempAzTag);
        setQueryTag('aws', tempAwsTag);
        setQueryTag('gcp', tempGcpTag);

        router.push(`${window.location.pathname}?${query.toString()}`, { scroll: false });
    };

    const clearFilters = () => {
        router.push(window.location.pathname, { scroll: false });
    };

    const getDbParams = (cloud: CloudProvider): string => {
        const selectedIds = selectedTenants[cloud] || [];
        const accounts = accountsList[cloud] || [];
        return selectedIds.map(id => accounts.find(acc => acc.id === id)?.db).filter(Boolean).join(',');
    };

    return (
        <div className='space-y-8'>
            <Card className="w-full min-w-0 shadow-sm border-slate-200 dark:border-slate-700 bg-white dark:bg-white">
                <CardContent className='p-6'>
                    <div className='flex flex-col xl:flex-row gap-6 items-start'>
                        <div className='space-y-2 w-full xl:w-[250px] shrink-0'>
                            <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                <Calendar className='h-4 w-4 text-gray-400' /> Periodo
                            </label>
                            <DatePicker
                                selected={tempSingleMonth}
                                onChange={(date: Date | null) => setTempSingleMonth(date)}
                                dateFormat="MMMM yyyy"
                                showMonthYearPicker
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                className='w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm shadow-sm'
                                placeholderText="Seleccione mes y año"
                            />
                        </div>

                        <div className="flex-1 space-y-2">
                            <label className='text-sm font-medium text-foreground flex items-center gap-2 mb-2'>
                                <Tags className='h-4 w-4 text-gray-400' /> Tags
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {selectedClouds.includes('azure') && getDbParams('azure') && (
                                    <MultiCloudTagFilter 
                                        provider="azure" dbs={getDbParams('azure')} 
                                        startDate={filters.startDate} endDate={filters.endDate}
                                        selectedKey={tempAzTag.key} selectedValue={tempAzTag.val}
                                        onChange={(k, v) => setTempAzTag({ key: k, val: v })}
                                    />
                                )}
                                {selectedClouds.includes('aws') && getDbParams('aws') && (
                                    <MultiCloudTagFilter 
                                        provider="aws" dbs={getDbParams('aws')} 
                                        startDate={filters.startDate} endDate={filters.endDate}
                                        selectedKey={tempAwsTag.key} selectedValue={tempAwsTag.val}
                                        onChange={(k, v) => setTempAwsTag({ key: k, val: v })}
                                    />
                                )}
                                {selectedClouds.includes('gcp') && getDbParams('gcp') && (
                                    <MultiCloudTagFilter 
                                        provider="gcp" dbs={getDbParams('gcp')} 
                                        startDate={filters.startDate} endDate={filters.endDate}
                                        selectedKey={tempGcpTag.key} selectedValue={tempGcpTag.val}
                                        onChange={(k, v) => setTempGcpTag({ key: k, val: v })}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className='flex items-center gap-4 mt-8 pt-4 border-t border-slate-200 dark:border-slate-800'>
                        <Button onClick={applyFilters} className='flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-white shadow-md transition-all'>
                            <Filter className="h-4 w-4" /> Aplicar Filtros
                        </Button>
                        <Button onClick={clearFilters} variant="outline" className='flex items-center gap-2 hover:bg-gray-100 text-gray-700'>
                            <XCircle className="h-4 w-4" /> Limpiar
                        </Button>
                    </div>
                </CardContent>

                <div className='p-6 bg-white dark:bg-slate-900 border-t'>
                    <Component
                        startDate={filters.startDate}
                        endDate={filters.endDate}
                        dateMode="monthly"
                        selectedMonths={[]}
                        azTagKey={filters.azTagKey}
                        azTagValue={filters.azTagValue}
                        awsTagKey={filters.awsTagKey}
                        awsTagValue={filters.awsTagValue}
                        gcpTagKey={filters.gcpTagKey}
                        gcpTagValue={filters.gcpTagValue}
                        selectedClouds={selectedClouds}
                        selectedTenants={selectedTenants}
                        accountsList={accountsList}
                    />
                </div>
            </Card>
        </div>
    );
};