import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'

export default async function AdminPage() {
  const authenticated = await isAuthenticated()
  
  if (authenticated) {
    redirect('/admin/dashboard')
  } else {
    redirect('/admin/login')
  }
}
