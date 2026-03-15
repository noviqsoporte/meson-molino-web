'use client'

import { useState } from 'react'

export default function LoginForm() {
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            })

            if (res.ok) {
                window.location.reload()
            } else {
                const data = await res.json()
                setError(data.error || 'Contraseña incorrecta')
            }
        } catch {
            setError('Error al conectar con el servidor')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#F7F5F2] flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-[0_2px_8px_rgba(31,61,43,0.08)] max-w-md w-full border border-[#E8E4DF]">
                <h1 className="font-playfair text-3xl text-center text-[var(--color-primario)] mb-2">Panel Administrativo</h1>
                <p className="text-center text-[#5C5C5C] mb-8 font-inter">Mesón del Molino</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-primario)] mb-2 font-inter">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-[#E8E4DF] focus:outline-none focus:ring-2 focus:ring-[var(--color-acento)] focus:border-transparent font-inter"
                            placeholder="Ingresa la contraseña"
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm font-inter text-center">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[var(--color-primario)] text-white py-3 rounded-lg font-medium hover:bg-[var(--color-acento)] transition-colors disabled:opacity-50 font-inter"
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    )
}
