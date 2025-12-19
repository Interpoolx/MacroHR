import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase project credentials
// For now, we use placeholders to prevent initialization errors if not set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Only initialize if credentials are provided, otherwise export a proxy or null
// Using a proxy to avoid 'undefined' errors while still allowing calls to fail gracefully
// Enhanced proxy to handle nested property access (e.g., supabase.auth.getSession)
const createRecursiveProxy = (target: any = {}): any => {
    return new Proxy(target, {
        get: (t, prop) => {
            if (prop === 'then') return undefined; // Avoid blocking async/await
            if (typeof t[prop] === 'undefined') {
                // Return a function that returns the result, OR another proxy
                const mockFn = () => ({ data: { session: null }, user: null, error: null });
                return createRecursiveProxy(mockFn);
            }
            return t[prop];
        },
        apply: (t, thisArg, args) => {
            return { data: { session: null }, user: null, error: null };
        }
    });
};

export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createRecursiveProxy();

// Helper to check if Supabase is actually active
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Helper to get current session (mock capable if needed)
export async function getCurrentUser() {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) {
        // console.error("Auth error", error) // Suppress for now if no creds
        return null
    }
    return session?.user ?? null
}

export async function signInWithMagicLink(email: string, redirectTo?: string) {
    const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            emailRedirectTo: redirectTo || `${window.location.origin}/auth/callback`,
        }
    })
    return { data, error }
}

export async function signInWithGoogle(redirectTo?: string) {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: redirectTo || `${window.location.origin}/auth`
        }
    })
    return { data, error }
}

export async function signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
}
