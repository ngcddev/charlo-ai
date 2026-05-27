// Auth helpers — import only in "use client" components.
import { createClient } from '@/lib/supabase/client'

/** Sign in with email + password. Returns { data, error }. */
export async function signIn(email: string, password: string) {
  const supabase = createClient()
  return supabase.auth.signInWithPassword({ email, password })
}

/** Sign out the current session. */
export async function signOut() {
  const supabase = createClient()
  return supabase.auth.signOut()
}

/**
 * Get the current client-side session.
 * For server-side validation use supabase.auth.getUser() instead.
 */
export async function getSession() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

/**
 * Sign in immediately after onboarding account creation.
 * The account was just created server-side so credentials are always fresh.
 * Redirecting to /dashboard happens in the caller after this resolves.
 */
export async function signInAfterOnboarding(email: string, password: string) {
  const supabase = createClient()
  return supabase.auth.signInWithPassword({ email, password })
}
