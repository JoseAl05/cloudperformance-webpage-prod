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
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedCompany, setSelectedCompany] = useState<Empresa | null>(null);
    const [activeAzureAccountId, setActiveAzureAccountId] = useState<string | null>(null);
    const [activeAwsAccountId, setActiveAwsAccountId] = useState<string | null>(null); 


    useEffect(() => {
        setActiveAzureAccountId(null);
        setActiveAwsAccountId(null); 
    }, [selectedCompany]);

    const contextValue = useMemo(() => ({ 
        selectedCompany, 
        setSelectedCompany,
        
        activeAzureAccountId, 
        setActiveAzureAccountId,
        
        activeAwsAccountId,       
        setActiveAwsAccountId     
    }), [selectedCompany, activeAzureAccountId, activeAwsAccountId]); 
    return (
        <ClientContext.Provider value={contextValue}>
            {children}
        </ClientContext.Provider>
    );
};

export const useClientContext = () => {
    const context = useContext(ClientContext);
    if (!context) throw new Error('useClientContext must be used within a ClientContextProvider');
    return context;
};