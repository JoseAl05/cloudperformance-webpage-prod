'use client';

import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { Empresa } from '@/types/db';

interface ClientContextType {
    selectedCompany: Empresa | null;
    setSelectedCompany: (data: Empresa | null) => void;

    // Multi-Tenant Azure
    activeAzureAccountId: string | null;
    setActiveAzureAccountId: (id: string | null) => void;

    // Multi-Tenant AWS
    activeAwsAccountId: string | null;
    setActiveAwsAccountId: (id: string | null) => void;

    // Multi-Tenant GCP
    activeGcpAccountId: string | null;
    setActiveGcpAccountId: (id: string | null) => void;

    // Multi-Tenant OpenAI
    activeOpenaiAccountId: string | null;
    setActiveOpenaiAccountId: (id: string | null) => void;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedCompany, setSelectedCompany] = useState<Empresa | null>(null);

    const [activeAzureAccountId, setActiveAzureAccountId] = useState<string | null>(null);
    const [activeAwsAccountId, setActiveAwsAccountId] = useState<string | null>(null);
    const [activeGcpAccountId, setActiveGcpAccountId] = useState<string | null>(null);
    const [activeOpenaiAccountId, setActiveOpenaiAccountId] = useState<string | null>(null);

    useEffect(() => {
        setActiveAzureAccountId(null);
        setActiveAwsAccountId(null);
        setActiveGcpAccountId(null);
        setActiveOpenaiAccountId(null);
    }, [selectedCompany]);

    const contextValue = useMemo(() => ({
        selectedCompany,
        setSelectedCompany,

        activeAzureAccountId,
        setActiveAzureAccountId,

        activeAwsAccountId,
        setActiveAwsAccountId,

        activeGcpAccountId,
        setActiveGcpAccountId,

        activeOpenaiAccountId,
        setActiveOpenaiAccountId
    }), [
        selectedCompany,
        activeAzureAccountId,
        activeAwsAccountId,
        activeGcpAccountId,
        activeOpenaiAccountId
    ]);

    return (
        <ClientContext.Provider value={contextValue}>
            {children}
        </ClientContext.Provider>
    );
};

export const useClientContext = () => {
    const context = useContext(ClientContext);
    if (!context) {
        throw new Error('useClientContext must be used within a ClientContextProvider');
    }
    return context;
};
