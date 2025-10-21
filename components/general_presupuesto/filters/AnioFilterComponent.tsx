'use client'

import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AnioFilterComponentProps {
  selectedAnio: string;
  setSelectedAnio: (anio: string) => void;
  startYear?: number;
  endYear?: number;
}

export const AnioFilterComponent = ({
  selectedAnio,
  setSelectedAnio,
  startYear = 2020,
  endYear = new Date().getFullYear() + 1,
}: AnioFilterComponentProps) => {
  const [years, setYears] = useState<number[]>([]);

  useEffect(() => {
    const yearList: number[] = [];
    for (let year = endYear; year >= startYear; year--) {
      yearList.push(year);
    }
    setYears(yearList);
  }, [startYear, endYear]);

  const handleYearChange = (value: string) => {
    setSelectedAnio(value);
  };

  return (
    <Select value={selectedAnio} onValueChange={handleYearChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Selecciona un año" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};