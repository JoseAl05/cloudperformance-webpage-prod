'use client'

import { useSession } from '@/hooks/useSession';
import { LoaderComponent } from '@/components/general/LoaderComponent';
import Link from 'next/link';
import { Cloud } from 'lucide-react';

export const SelectCloudComponent = () => {
    const actualSession = useSession();

    if (actualSession.isLoading) {
        return <LoaderComponent />
    }
    if (actualSession.error) {
        return <p>Error</p>
    }

    const isAzure = actualSession.user?.is_azure;
    const isAws = actualSession.user?.is_aws;

    return (
        <div className='flex justify-center items-center gap-2'>
            {
                isAzure && (
                    <div>
                        <Link className='flex items-center justify-center gap-2 text-2xl font-bold' href='/azure'>
                            <Cloud />
                            AZURE
                        </Link>
                    </div>
                )
            }
            <hr/>
            {
                isAws && (
                    <div>
                        <Link className='flex items-center justify-center gap-2 text-2xl font-bold' href='/aws'>
                            <Cloud />
                            AWS
                        </Link>
                    </div>
                )
            }
        </div>
    )
}