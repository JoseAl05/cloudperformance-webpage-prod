'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Loader2, CheckCircle, AlertTriangle, Eye, EyeOff } from 'lucide-react';

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const token = searchParams.get('token');

    const [tokenValidated, setTokenValidated] = useState<boolean | null>(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [strength, setStrength] = useState<'weak' | 'medium' | 'strong'>('weak');
    const [requirements, setRequirements] = useState({
        length: false,
        uppercase: false,
        special: false,
        number: false,
    });

    // VALIDAR TOKEN ANTES DE MOSTRAR FORMULARIO
    useEffect(() => {
        if (!token) {
            setTokenValidated(false);
            return;
        }

        async function validateToken() {
            try {
                const res = await fetch("/api/auth/validate-reset-token", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token })
                });

                const data = await res.json();
                setTokenValidated(data.valid ?? false);

            } catch (err) {
                setTokenValidated(false);
            }
        }

        validateToken();
    }, [token]);

    const evaluateStrength = (pwd: string) => {
        let score = 0;
        if (pwd.length >= 8) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[!@#$%^&*(),.?":{}|<>_\-]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;

        if (score <= 1) return 'weak';
        if (score === 2) return 'medium';
        return 'strong';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        if (password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres.');
            return;
        }

        if (!/[A-Z]/.test(password)) {
            setError('La contraseña debe incluir al menos una letra mayúscula.');
            return;
        }

        if (!/[!@#$%^&*(),.?":{}|<>_\-]/.test(password)) {
            setError('La contraseña debe incluir al menos un carácter especial.');
            return;
        }

        if (!/[0-9]/.test(password)) {
            setError('La contraseña debe incluir al menos un número.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al restablecer.');
            }

            setSuccess(true);
            setTimeout(() => router.push('/login'), 3000);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (tokenValidated === null) {
        return (
            <div className="text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
                <p className="text-gray-600 text-sm">Verificando enlace...</p>
            </div>
        );
    }

    // Token expirado
    if (!tokenValidated) {
        return (
            <div className="text-center space-y-4">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
                <h3 className="text-lg font-bold text-gray-900">Enlace inválido o expirado</h3>
                <p className="text-gray-500">Solicita nuevamente un correo de recuperación.</p>
                <Link href="/forgot-password" className="text-blue-600 hover:underline font-medium">
                    Volver a solicitar recuperación
                </Link>
            </div>
        );
    }

    if (success) {
        return (
            <div className="text-center space-y-6">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                <h2 className="text-2xl font-bold text-gray-900">¡Contraseña actualizada!</h2>
                <p className="text-gray-600">
                    Serás redirigido al login en unos segundos...
                </p>
                <Link href="/login" className="text-blue-600 font-medium hover:underline">
                    Ir al Login ahora
                </Link>
            </div>
        );
    }


    return (
        <>
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Nueva Contraseña</h1>
                <p className="text-sm text-gray-500 mt-2">Ingresa tu nueva contraseña segura.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Campo contraseña */}
                <div className="space-y-2">
                    <label htmlFor="pass" className="text-sm font-medium text-gray-700">Nueva Contraseña</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="pass"
                            required
                            value={password}
                            onChange={(e) => {
                                const value = e.target.value;
                                setPassword(value);
                                setStrength(evaluateStrength(value));

                                // Actualizar requisitos
                                setRequirements({
                                    length: value.length >= 8,
                                    uppercase: /[A-Z]/.test(value),
                                    special: /[!@#$%^&*(),.?":{}|<>_\-]/.test(value),
                                    number: /[0-9]/.test(value)
                                });
                            }}
                            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>

                    {/* REQUISITOS */}
                    {password && (
                        <div className="mt-3 bg-gray-50 p-3 rounded-md border border-gray-200">
                            <p className="text-xs font-medium text-gray-700 mb-2">Requisitos de la contraseña:</p>

                            <ul className="space-y-1 text-xs">
                                <li className="flex items-center gap-2">
                                    {requirements.length 
                                        ? <CheckCircle className="h-4 w-4 text-green-500" /> 
                                        : <AlertTriangle className="h-4 w-4 text-red-500" />}
                                    Al menos 8 caracteres
                                </li>

                                <li className="flex items-center gap-2">
                                    {requirements.uppercase 
                                        ? <CheckCircle className="h-4 w-4 text-green-500" /> 
                                        : <AlertTriangle className="h-4 w-4 text-red-500" />}
                                    Al menos una letra mayúscula (A-Z)
                                </li>

                                <li className="flex items-center gap-2">
                                    {requirements.special 
                                        ? <CheckCircle className="h-4 w-4 text-green-500" /> 
                                        : <AlertTriangle className="h-4 w-4 text-red-500" />}
                                    Al menos un carácter especial (!@#$%...)
                                </li>

                                <li className="flex items-center gap-2">
                                    {requirements.number 
                                        ? <CheckCircle className="h-4 w-4 text-green-500" /> 
                                        : <AlertTriangle className="h-4 w-4 text-red-500" />}
                                    Al menos un número (0-9)
                                </li>
                            </ul>
                        </div>
                    )}

                    {/* FUERZA */}
                    {password && (
                        <div className="mt-2">
                            <div className={`h-2 rounded-full transition-all 
                                ${strength === 'weak' ? 'bg-red-500 w-1/3' : 
                                strength === 'medium' ? 'bg-yellow-500 w-2/3' : 
                                'bg-green-500 w-full'}`}>
                            </div>

                            <p className="text-xs mt-1 text-gray-600">
                                {strength === 'weak' && "Contraseña débil"}
                                {strength === 'medium' && "Contraseña normal"}
                                {strength === 'strong' && "Contraseña excelente"}
                            </p>
                        </div>
                    )}
                </div>

                {/* Confirmar contraseña */}
                <div className="space-y-2">
                    <label htmlFor="confirmPass" className="text-sm font-medium text-gray-700">Confirmar Contraseña</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPass"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                </div>


                {error && (
                    <div className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-600 text-center">
                        {error}
                    </div>
                )}


                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition"
                >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Cambiar Contraseña'}
                </button>
            </form>
        </>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                <Suspense fallback={<div className="text-center p-4">Cargando...</div>}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    );
}