import React, { useState } from 'react';
import useSWR from 'swr';
import { Trash2, Edit, X } from 'lucide-react';
import EditLicenseModal from './EditLicenseModal';

interface EmpresaData {
    _id: string;
    name: string;
    userLimit: number;
    currentUsers: number;
    is_aws: boolean;
    is_azure: boolean;
    is_gcp: boolean; 
    planName: string;
}

const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(res => res.json());

const ToastNotification = ({ message, type, onClose }) => {
    const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';
    const borderColor = type === 'success' ? 'border-green-800' : 'border-red-800';

    return (
        <div
            className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-xl text-white border-l-4 ${bgColor} ${borderColor}`}
            style={{ minWidth: '300px', zIndex: 1200 }}
        >
            <div className="flex justify-between items-center">
                <span>{message}</span>
                <button onClick={onClose} className="ml-4 text-white opacity-80 hover:opacity-100">
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

export default function LicenseTable() {
    const [selectedEmpresa, setSelectedEmpresa] = useState<EmpresaData | null>(null);
    const [statusMessage, setStatusMessage] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
    const [loadingAction, setLoadingAction] = useState(false);

    // Fetch de licencias (GET /api/perfilamiento/empresas)
    const { data: empresas, error, isLoading, mutate: refreshEmpresas } = useSWR<EmpresaData[]>(
        '/api/perfilamiento/empresas',
        fetcher
    );

    const empresaList: EmpresaData[] = (empresas || []) as EmpresaData[];


    const handleDelete = async (empresa: EmpresaData) => {
        if (!confirm(`ADVERTENCIA: ¿Seguro que desea eliminar la licencia de ${empresa.name}? Esto desvinculará a ${empresa.currentUsers ?? 0} usuarios.`)) {
            return;
        }

        setLoadingAction(true);

        try {
            // LLAMADA A LA API DELETE
            const response = await fetch(`/api/perfilamiento/empresas/${empresa._id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                setStatusMessage({
                    message: `Licencia de ${empresa.name} y sus usuarios eliminados exitosamente.`,
                    type: 'success'
                });
                refreshEmpresas();
            } else {
                const data = await response.json();
                setStatusMessage({
                    message: `Error al eliminar: ${data.message}`,
                    type: 'error'
                });
            }
        } catch (err) {
            setStatusMessage({
                message: 'Error de conexión con la API de eliminación.',
                type: 'error'
            });
        } finally {
            setLoadingAction(false);
            setTimeout(() => setStatusMessage(null), 5000);
        }
    };

    const handleEdit = (empresa: EmpresaData) => {
        setSelectedEmpresa(empresa);
    };


    if (isLoading) return <div className="text-center py-6 text-gray-500">Cargando listado de licencias...</div>;
    if (error) return <div className="bg-red-100 text-red-700 p-3 rounded">Error al cargar el listado de empresas.</div>;
    if (empresaList.length === 0) return <div className="text-center py-6 text-gray-500">No hay licencias registradas. Utilice la opción Crear Nueva Licencia.</div>;

    return (
        <>
            <div className="rounded-lg border bg-white shadow-lg p-4 mt-4">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Clientes Registrados ({empresaList.length})</h3>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa (Cliente)</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuarios (Activos/Límite)</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nubes Habilitadas</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {empresaList.map((empresa) => {
                                const activeUsers = empresa.currentUsers ?? 0;
                                const isOverLimit = activeUsers > empresa.userLimit;
                                const limitColor = isOverLimit ? 'text-red-600 font-bold' : 'text-green-600';
                                const cloudStatus = [
                                    empresa.is_aws && 'AWS',
                                    empresa.is_azure && 'Azure',
                                    empresa.is_gcp && 'GCP',
                                ].filter(Boolean).join(' | ');


                                return (
                                    <tr key={empresa._id} className="hover:bg-gray-50 transition duration-150">
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{empresa.name}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{empresa.planName}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                            <span className={limitColor}>
                                                {activeUsers}
                                            </span>
                                            <span> / </span>
                                            <span className="text-gray-500">
                                                {empresa.userLimit}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                            {cloudStatus || <span className="text-gray-400">Ninguna</span>}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                            <button
                                                onClick={() => handleEdit(empresa)}
                                                className="text-blue-600 hover:text-blue-800 transition"
                                                disabled={loadingAction}
                                            >
                                                <Edit className="h-4 w-4 inline mr-1" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(empresa)}
                                                className="text-red-600 hover:text-red-800 transition"
                                                disabled={loadingAction}
                                            >
                                                <Trash2 className="h-4 w-4 inline mr-1" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedEmpresa && (
                <EditLicenseModal
                    empresa={selectedEmpresa}
                    onClose={() => setSelectedEmpresa(null)}
                    refreshList={refreshEmpresas}
                />
            )}

            {statusMessage && (
                <ToastNotification
                    message={statusMessage.message}
                    type={statusMessage.type}
                    onClose={() => setStatusMessage(null)}
                />
            )}
        </>
    );
}