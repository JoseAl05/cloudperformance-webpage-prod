'use client'

import useSWR from 'swr';

interface UnusedNatGatewaysComponentProps {
    startDate: Date;
    endDate: Date;
    region: string;
    unusedNatGateway: string;
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0
const isNullish = (v: unknown) => v === null || v === undefined

export const UnusedNatGatewaysComponent = ({ startDate, endDate, region, unusedNatGateway }: UnusedNatGatewaysComponentProps) => {

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const unusedNatGw = useSWR(
        unusedNatGateway ? `/api/aws/bridge/nat_gateways/get_unused_nat_gateways?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&nat_gw_id=${unusedNatGateway}` : null,
        fetcher
    )

    const anyLoading =
        unusedNatGw.isLoading;

    const anyError =
        !!unusedNatGw.error;

    const unusedNatGwData: [] | null =
        isNonEmptyArray<>(unusedNatGw.data) ? unusedNatGw.data : null;

    const hasData = !!unusedNatGwData && unusedNatGwData.length > 0;

    return (
        <></>
    )
}