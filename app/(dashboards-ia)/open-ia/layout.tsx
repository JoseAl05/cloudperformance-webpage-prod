import React from 'react';

interface OpenIALayoutProps {
    children: React.ReactNode;
}

export default function OpenIALayout({ children }: OpenIALayoutProps) {
    return <>{children}</>;
}