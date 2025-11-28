'use client';

import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Ocurrió un error.');
            }

            // Éxito: Cambiamos a la vista de confirmación
            setSubmitted(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Recuperar Contraseña</h1>
                    {!submitted && (
                        <p className="text-sm text-gray-500 mt-2">
                            Ingresa tu correo y te enviaremos un enlace para restablecer tu acceso.
                        </p>
                    )}
                </div>

                {submitted ? (
                    <div className="text-center space-y-6">
                        <div className="flex justify-center">
                            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-medium text-gray-900">¡Correo Enviado!</h3>
                            <p className="text-sm text-gray-600">
                                Si existe una cuenta asociada a <strong>{email}</strong>, recibirás las instrucciones en breve. Revisa tu bandeja de entrada o spam.
                            </p>
                        </div>
                        <Link 
                            href="/login" 
                            className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
                        >
                            Volver al Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-gray-700">Correo Electrónico</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="ejemplo@empresa.com"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-md bg-red-50 border border-red-200">
                                <p className="text-sm text-red-600 text-center">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                    Enviando...
                                </>
                            ) : (
                                'Enviar Enlace'
                            )}
                        </button>

                        <div className="text-center mt-4">
                            <Link href="/login" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition">
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Volver al inicio de sesión
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}