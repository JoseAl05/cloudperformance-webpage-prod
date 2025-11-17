import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmDeleteModalProps {
    onConfirm: () => void;
    onCancel: () => void;
    username: string;
    loading: boolean;
}

export default function ConfirmDeleteModal({ onConfirm, onCancel, username, loading }: ConfirmDeleteModalProps) {
    
    return (
        <div 
            className="fixed inset-0 z-[1100] flex justify-center items-center transition-opacity duration-300"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }} 
        >
            <div className="relative w-full max-w-sm mx-4 transform transition-all duration-300 scale-100">
                <div className="bg-white rounded-xl shadow-2xl border border-red-300">
                    
                    <div className="p-5 text-center border-b border-red-200">
                        <AlertTriangle className="h-10 w-10 text-red-600 mx-auto mb-4" />
                        <h5 className="text-xl font-bold text-gray-800">Confirmar Eliminación</h5>
                        <p className="text-sm text-gray-600 mt-2">
                            ¿Estás seguro de que deseas eliminar al usuario <strong>{username}</strong>?
                        </p>
                        <p className="text-xs text-red-500 mt-1 font-semibold">
                            Esta acción es irreversible y decrementará la licencia.
                        </p>
                    </div>
                    
                    <div className="flex justify-end space-x-3 p-4 bg-gray-50 rounded-b-xl">
                        <button 
                            type="button" 
                            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100 transition" 
                            onClick={onCancel} 
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button 
                            type="button" 
                            className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 transition" 
                            onClick={onConfirm} 
                            disabled={loading}
                        >
                            {loading ? 'Eliminando...' : 'Eliminar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}