'use client'
import { useState } from 'react';
import { DatePicker } from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";

interface DateFilterComponentProps {
    Component: (params: { startDate: Date; endDate?: Date }) => React.JSX.Element;
}

export const DateFilterComponent = ({ Component }: DateFilterComponentProps) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const [startDate, setStartDate] = useState<Date>(yesterday);
    const [endDate, setEndDate] = useState<Date>(new Date());
    const onChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    };

    return (
        <div>
            <DatePicker
                selected={startDate}
                onChange={onChange}
                startDate={startDate}
                endDate={endDate}
                selectsRange
            />
            <Component
                startDate={startDate}
                endDate={endDate}
            />
        </div>
    )
}