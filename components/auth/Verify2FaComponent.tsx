'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export const Verify2FaComponent = () => {
    const [code, setCode] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const sp = useSearchParams()
    const userId = sp.get('userId') || ''
    const next = sp.get('next') || '/perfil'

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        const res = await fetch('/api/auth/verify-2fa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, code }),
        })
        const data = await res.json()
        setLoading(false)
        if (res.ok) router.replace(next)
        else alert(data.error || 'Código inválido')
    }

    return (
        <form onSubmit={onSubmit} className='flex flex-col gap-6'>
            <div className='flex flex-col items-center gap-2 text-center'>
                <h1 className='text-2xl font-bold'>Verificación en dos pasos</h1>
                <p className='text-muted-foreground text-sm text-balance'>
                    Ingresa el código de 6 dígitos enviado a tu correo electrónico
                </p>
            </div>

            <div className='grid gap-6'>
                <div className='grid gap-3'>
                    <Label htmlFor='code'>Código</Label>
                    <Input
                        id='code'
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        inputMode='numeric'
                        autoComplete='one-time-code'
                        pattern='[0-9]{6}'
                        maxLength={6}
                        placeholder='000000'
                        required
                        className='text-center tracking-[0.3em] text-lg font-mono'
                    />
                </div>

                {loading ? (
                    <div className='flex flex-col items-center gap-0'>
                        <Loader2 className='h-5 w-5 animate-spin' />
                        <span className='text-muted-foreground pt-2'>Verificando…</span>
                    </div>
                ) : (
                    <Button type='submit' className='w-full cursor-pointer'>
                        Confirmar
                    </Button>
                )}
            </div>
        </form>
    )
}
