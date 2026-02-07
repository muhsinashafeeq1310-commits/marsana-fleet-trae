import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user role from private users table
  const { data: userData } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!userData) {
    // If user exists in Auth but not in our table, something is wrong
    // Log them out and send to login
    await supabase.auth.signOut()
    redirect('/login')
  }

  const role = userData.role

  // Role-based routing
  switch (role) {
    case 'super_admin':
    case 'hq':
      redirect('/dashboard/hq')
    case 'branch_admin':
      redirect('/dashboard/branch')
    case 'driver':
      redirect('/driver')
    case 'corporate_admin':
      redirect('/corporates')
    case 'tech':
      redirect('/maintenance')
    default:
      redirect('/dashboard/branch') // Fallback
  }
}

