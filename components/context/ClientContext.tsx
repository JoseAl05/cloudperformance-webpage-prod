'use client';
import React, { createContext, useState, useContext, useMemo } from 'react';
import { Empresa } from '@/types/db'; 


interface ClientContextType {
    // La empresa seleccionada por el Admin Global
    selectedCompany: Empresa | null;
    // Función para actualizar la empresa seleccionada
    setSelectedCompany: (data: Empresa | null) => void;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedCompany, setSelectedCompany] = useState<Empresa | null>(null);
    const contextValue = useMemo(() => ({ selectedCompany, setSelectedCompany }), [selectedCompany]);

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