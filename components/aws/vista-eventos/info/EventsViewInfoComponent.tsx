'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Activity, ChevronDown, ChevronUp, Cpu, Network, Percent, TrendingUp, Zap } from 'lucide-react';
import { Ec2InfoConsumeViewCardsComponent } from './Ec2InfoConsumeViewCardsComponent';
import { EventsApiResponse } from '@/interfaces/vista-eventos/eventsViewInterfaces';
import { EventsViewInfoCardsComponent } from './EventsViewInfoCardsComponent';


interface EventsViewInfoComponentProps {
    infoData: EventsApiResponse[] | null;
}


export const EventsViewInfoComponent = ({ infoData }: EventsViewInfoComponentProps) => {
    if (!infoData || infoData.length === 0) {
        return <div className="text-center text-gray-500 py-6">No hay eventos para mostrar.</div>;
    }
    return (
        <>
            <EventsViewInfoCardsComponent
                infoData={infoData}
            />
        </>
    );
};
