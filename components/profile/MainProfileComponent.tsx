'use client'

import { useSession } from '@/hooks/useSession';
import { LoaderComponent } from '@/components/general_aws/LoaderComponent';
export const MainProfileComponent = () => {
    const actualSession = useSession();

    if (actualSession.isLoading) {
        return <LoaderComponent />
    }
    if (actualSession.error) {
        return <p>Error</p>
    }

    const isAzure = actualSession.user?.is_azure;
    const isAws = actualSession.user?.is_aws;
    const username = actualSession.user?.username;

    return (
        <div className='flex justify-center items-center gap-2'>
            <h1 className='text-2xl font-semibold'>Bienvenido! {username}</h1>
        </div>
    )
}