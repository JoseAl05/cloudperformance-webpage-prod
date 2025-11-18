import React, { useState, useCallback } from 'react';
import useSWR from 'swr';
import { useSession } from '@/hooks/useSession';
import { UserRole } from '@/types/db';
import EditUserModal from './EditUserModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { X, Edit, Trash2, Lock, Unlock } from 'lucide-react';

interface UserData {
    _id: string;
    email: string;
    username: string;
    client: string;
    role: UserRole;
    is_aws: boolean;
    is_azure: boolean;
    is_active: boolean;
    user_db_aws?: string;
    user_db_azure?: string;
}

const fetcher = async (url: string) => {
    const res = await fetch(url, { credentials: 'include' });

    if (!res.ok) {
        const error = new Error('An error occurred while fetching the data.');
        try {
            error.info = await res.json();
        } catch { }
        error.status = res.status;
        throw error;
    }
    return res.json();
};

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


export default function UserTable() {
    const { user: userLoggedIn, refresh: refreshSession } = useSession();

    const [selectedUserToEdit, setSelectedUserToEdit] = useState<UserData | null>(null);
    const [userToDelete, setUserToDelete] = useState<UserData | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const { data: usersData, error, isLoading, mutate: refreshUsers } = useSWR<UserData[]>(
        userLoggedIn ? '/api/perfilamiento/users' : null,
        fetcher,
        { revalidateOnFocus: false }
    );

    const canPerformAction = useCallback((targetUser: UserData): { canEdit: boolean, canDelete: boolean } => {
        const userIdLoggedIn = userLoggedIn?._id;
        const targetRole = targetUser.role;
        const userRole = userLoggedIn?.role;
        const isGlobalAdmin = userRole === 'admin_global';

        const canEditAction = isGlobalAdmin || (userRole === 'admin_empresa' && targetRole !== 'admin_global');

        return {
            canEdit: canEditAction,
            canDelete: canEditAction && targetUser._id !== userIdLoggedIn
        };
    }, [userLoggedIn]);

    // Bloquear/Habilitar
    const toggleStatus = useCallback(async (user: UserData) => {

        if (user._id === userLoggedIn?._id) {
            alert('No puedes bloquear tu propia cuenta.');
            return;
        }

        const newStatus = !user.is_active;

        if (!confirm(`¿Estás seguro de que quieres ${newStatus ? 'HABILITAR' : 'BLOQUEAR'} a ${user.username}?`)) {
            return;
        }

        try {
            const response = await fetch(`/api/perfilamiento/users/${user._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: newStatus }),
                credentials: 'include',
            });

            if (response.ok) {
                setStatusMessage({
                    message: `Usuario ${user.username} ha sido ${newStatus ? 'Habilitado' : 'Bloqueado'}.`,
                    type: 'success'
                });
                refreshUsers();
            } else {
                const data = await response.json();
                setStatusMessage({
                    message: `Error al cambiar el estado: ${data.message}`,
                    type: 'error'
                });
            }
        } catch (err) {
            setStatusMessage({
                message: 'Error de conexión al intentar cambiar el estado.',
                type: 'error'
            });
        } finally {
            setTimeout(() => setStatusMessage(null), 5000);
        }
    }, [userLoggedIn, refreshUsers]);

    // Iniciar eliminación
    const initDelete = useCallback((user: UserData) => {
        setStatusMessage(null);
        setUserToDelete(user);
    }, []);

    const confirmDelete = useCallback(async () => {
        if (!userToDelete) return;

        setDeleteLoading(true);

        try {
            const response = await fetch(`/api/perfilamiento/users/${userToDelete._id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                setStatusMessage({
                    message: `Usuario ${userToDelete.username} eliminado exitosamente.`,
                    type: 'success'
                });
                refreshUsers();
                refreshSession();
            } else {
                const data = await response.json();
                setStatusMessage({
                    message: `Error al eliminar: ${data.message}`,
                    type: 'error'
                });
            }
        } catch (err) {
            setStatusMessage({
                message: 'Error de conexión con el servidor.',
                type: 'error'
            });
        } finally {
            setUserToDelete(null);
            setDeleteLoading(false);
            setTimeout(() => setStatusMessage(null), 5000);
        }
    }, [userToDelete, refreshUsers, refreshSession]);

    const userList = (usersData || []) as UserData[];

    if (isLoading) return <div className="text-center py-6 text-gray-500">Cargando lista de usuarios...</div>;
    if (error) return <div className="bg-red-100 text-red-700 p-3 rounded">Error al cargar el listado de usuarios.</div>;
    if (userList.length === 0) return <div className="text-center py-6 text-gray-500">No hay usuarios registrados para su empresa.</div>;


    return (
        <div className="rounded-lg border bg-white shadow-lg p-4 mt-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Usuarios Registrados ({userList.length})</h3>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nubes Habilitadas</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {userList.map((user) => {
                            const { canEdit, canDelete } = canPerformAction(user);
                            const roleColor = user.role.includes('global') ? 'bg-gray-900 text-white' : user.role.includes('empresa') ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700';
                            const isActive = user.is_active !== false;

                            return (
                                <tr key={user._id} className="hover:bg-gray-50 transition duration-150">
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{user.email}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{user.username}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{user.client}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${roleColor}`}>
                                            {user.role.toUpperCase().replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {isActive ? 'ACTIVO' : 'BLOQUEADO'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                        {user.is_aws && <span className="text-xs text-amber-600 mr-1">AWS</span>}
                                        {user.is_azure && <span className="text-xs text-blue-600">Azure</span>}
                                        {(!user.is_aws && !user.is_azure) && <span className="text-xs text-gray-400">Ninguno</span>}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                        {canEdit && (
                                            <button
                                                onClick={() => toggleStatus(user)}
                                                className={`mr-3 text-sm font-medium transition ${isActive ? 'text-red-500 hover:text-red-700' : 'text-green-500 hover:text-green-700'}`}
                                                title={isActive ? 'Bloquear Acceso' : 'Habilitar Acceso'}
                                            >
                                                {isActive ? <Lock className="h-4 w-4 inline mr-1" /> : <Unlock className="h-4 w-4 inline mr-1" />}
                                            </button>
                                        )}

                                        {canEdit && (
                                            <button
                                                className="text-blue-600 hover:text-blue-800 mr-3 transition text-sm font-medium"
                                                onClick={() => setSelectedUserToEdit(user)}
                                                title="Editar"
                                            >
                                                <Edit className="h-4 w-4 inline mr-1" />
                                            </button>
                                        )}

                                        {canDelete && (
                                            <button
                                                className="text-red-600 hover:text-red-800 transition text-sm font-medium"
                                                onClick={() => initDelete(user)}
                                                title="Eliminar"
                                            >
                                                <Trash2 className="h-4 w-4 inline mr-1" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {selectedUserToEdit && (
                <EditUserModal
                    user={selectedUserToEdit}
                    onClose={() => setSelectedUserToEdit(null)}
                    refreshUserList={refreshUsers}
                />
            )}

            {userToDelete && (
                <ConfirmDeleteModal
                    username={userToDelete.username}
                    onConfirm={confirmDelete}
                    onCancel={() => setUserToDelete(null)}
                    loading={deleteLoading}
                />
            )}

            {statusMessage && (
                <ToastNotification
                    message={statusMessage.message}
                    type={statusMessage.type}
                    onClose={() => setStatusMessage(null)}
                />
            )}
        </div>
    );
}