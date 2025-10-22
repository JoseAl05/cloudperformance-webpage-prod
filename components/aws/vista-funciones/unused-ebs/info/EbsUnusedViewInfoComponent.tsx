'use client';

import { EbsUnusedViewInfoCardsComponent } from '@/components/aws/vista-funciones/unused-ebs/info/EbsUnusedViewInfoCardsComponent';
import { Ec2InfoConsumeViewCardsComponent } from '@/components/aws/vista-funciones/unused-ebs/info/Ec2InfoConsumeViewCardsComponent';
import { UnusedEbs } from '@/interfaces/vista-ebs-no-utilizados/ebsUnusedInterfaces';


interface EbsUnusedViewInfoComponentProps {
    ebsData: UnusedEbs[] | null;
}


export const EbsUnusedViewInfoComponent = ({ ebsData }: EbsUnusedViewInfoComponentProps) => {
    if (!ebsData || ebsData.length === 0) {
        return <div className="text-center text-gray-500 py-6">No hay volumenes para mostrar.</div>;
    }
    return (
        <>
            <EbsUnusedViewInfoCardsComponent
                ebsData={ebsData}
            />
        </>
    );
};
