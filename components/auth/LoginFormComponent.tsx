'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export const LoginFormComponent = () => {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const next = useSearchParams().get('next') || '/perfil';

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emailOrUsername, password })
        });
        const data = await res.json();
        setLoading(false);
        if (res.ok) {
            router.push(`/verify-2fa?userId=${encodeURIComponent(data.userId)}&next=${encodeURIComponent(next)}`);
        } else {
            alert(data.error || 'Error');
        }
    }
    return (
        <form onSubmit={onSubmit} className='flex flex-col gap-6'>
            <div className='flex flex-col items-center gap-2 text-center'>
                <h1 className='text-2xl font-bold'>Inicio de Sesión</h1>
                <p className='text-muted-foreground text-sm text-balance'>
                    Ingrese el correo asociado a su cuenta
                </p>
            </div>
            <div className='grid gap-6'>
                <div className='grid gap-3'>
                    <Label htmlFor='correo'>Correo</Label>
                    <Input id='email' type='email' placeholder='m@example.com' value={emailOrUsername} onChange={e => setEmailOrUsername(e.target.value)} required />
                </div>
                <div className='grid gap-3'>
                    <div className='flex items-center'>
                        <Label htmlFor='password'>Password</Label>
                    </div>
                    <Input id='password' type='password' value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                {
                    loading ? (
                        <div className='flex flex-col items-center gap-0'>
                            <Loader2 className='h-5 w-5 animate-spin' />
                            <span className='text-muted-foreground pt-2'>Enviando código...</span>
                        </div>
                    ) : (
                        <Button type='submit' className='w-full cursor-pointer'>
                            Iniciar Sesión
                        </Button>
                    )
                }
            </div>
        </form >
    )
}