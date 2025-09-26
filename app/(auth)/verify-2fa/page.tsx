'use client';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function Verify2FAPage() {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const sp = useSearchParams();
    const userId = sp.get('userId') || '';
    const next = sp.get('next') || '/dashboard';

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        const res = await fetch('/api/auth/verify-2fa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, code })
        });
        const data = await res.json();
        setLoading(false);
        if (res.ok) router.replace(next);
        else alert(data.error || 'Código inválido');
    }

    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <div className='bg-gray-50 min-h-screen flex items-center justify-center'>
                <div className='max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center'>
                    <div className='mx-auto h-16 w-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mb-4'>
                        <svg className='h-8 w-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 12l8-4-8-4-8 4 8 4zm0 0v8' />
                        </svg>
                    </div>
                    <h2 className='text-2xl font-bold text-gray-900 mb-2'>Verificación en dos pasos</h2>
                    <p className='text-gray-600 mb-6'>Ingresa el código de 6 dígitos enviado a tu correo electrónico</p>
                    {/* {error && <div className='mb-4 text-red-600 font-medium'>{error}</div>} */}
                    <form onSubmit={onSubmit} className='space-y-6'>
                        <input type='text' value={code} onChange={e => setCode(e.target.value)} pattern='[0-9]{6}' maxLength={6} required className='w-full px-4 py-3 text-center text-2xl font-mono bg-gray-100 border border-gray-300 rounded-xl' placeholder='000000' />
                        <Button variant='default' type='submit' disabled={loading} className='w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 px-4 rounded-xl font-medium cursor-pointer'>{loading ? 'Verificando…' : 'Confirmar'}</Button>
                    </form>
                </div>
            </div>
        </Suspense>
    );
}