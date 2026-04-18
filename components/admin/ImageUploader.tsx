'use client'

import { useState } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'

interface ImageUploaderProps {
    value: string
    onChange: (url: string) => void
    label: string
}

export default function ImageUploader({ value, onChange, label }: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const uploadToCloudinary = async (file: File): Promise<string> => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)

        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: formData
        })

        if (!res.ok) throw new Error('Upload failed')
        const data = await res.json()
        return data.secure_url
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        setError(null)
        try {
            const url = await uploadToCloudinary(file)
            onChange(url)
        } catch (err) {
            console.error('Error uploading image:', err)
            setError('Error al subir imagen. Intenta de nuevo.')
        } finally {
            setUploading(false)
        }
    }

    const handleRemove = () => {
        onChange('')
        setError(null)
    }

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-[var(--color-primario)] mb-2">{label}</label>

            {value ? (
                <div className="relative inline-block border border-[#E8E4DF] rounded-xl overflow-hidden group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={value} alt="Preview" className="h-40 w-full object-cover rounded-xl" />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-500 rounded-full p-1 shadow-sm transition-all opacity-0 group-hover:opacity-100"
                        title="Eliminar imagen"
                    >
                        <X size={18} />
                    </button>
                </div>
            ) : (
                <div className="relative border-2 border-dashed border-[var(--color-secundario)] bg-[#F7F5F2] rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#efece5] transition-colors min-h-[160px]">
                    <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleFileChange}
                        disabled={uploading}
                    />

                    {uploading ? (
                        <div className="flex flex-col items-center space-y-2 text-[var(--color-acento)]">
                            <Loader2 className="animate-spin" size={32} />
                            <span className="text-sm font-medium">Subiendo imagen...</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center space-y-3 pointer-events-none">
                            <Upload className="text-[var(--color-secundario)]" size={32} />
                            <span className="hidden md:block text-sm text-[var(--color-primario)] font-medium text-center">
                                Arrastra una imagen o haz clic para seleccionar
                            </span>
                            <span className="md:hidden text-sm text-[var(--color-primario)] font-medium text-center">
                                Toca para elegir de tu fototeca
                            </span>
                        </div>
                    )}
                </div>
            )}

            {error && (
                <p className="mt-2 text-sm text-red-500 font-medium">
                    {error}
                </p>
            )}
        </div>
    )
}
