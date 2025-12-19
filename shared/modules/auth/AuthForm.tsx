import { useState } from 'react'
import { Loader2, ArrowRight, Mail } from 'lucide-react'
import { signInWithMagicLink } from '../../lib/supabase'

interface AuthFormProps {
    buttonText: string
    onSubmitStart?: () => void
    onSuccess?: (email: string) => void
}

export function AuthForm({ buttonText, onSubmitStart, onSuccess }: AuthFormProps) {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)
        if (onSubmitStart) onSubmitStart()

        try {
            const { error } = await signInWithMagicLink(email)
            if (error) throw error
            if (onSuccess) onSuccess(email)
        } catch (err: any) {
            console.error(err)
            setError(err.message || 'Failed to send magic link')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="p-3 bg-red-500/10 text-red-400 text-sm rounded-lg border border-red-500/20">
                    {error}
                </div>
            )}
            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-muted-foreground">Email Address</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-muted-foreground/30"
                    />
                </div>
            </div>
            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
                {isLoading ? <Loader2 className="animate-spin" /> : (
                    <>
                        {buttonText} <ArrowRight size={18} />
                    </>
                )}
            </button>
        </form>
    )
}
