import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import LoginForm from '@/components/admin/LoginForm'
import fs from 'fs'
import path from 'path'

export default async function AdminLoginPage() {
  // Check if setup is required
  const envPath = path.join(process.cwd(), '.env')
  const envExists = fs.existsSync(envPath)
  
  if (!envExists) {
    redirect('/setup')
  }

  // Check if admin password is set
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword || adminPassword === 'admin123' || adminPassword === 'change-this-password' || adminPassword === 'auto-generated-on-first-setup') {
    redirect('/setup')
  }

  const authenticated = await isAuthenticated()
  
  if (authenticated) {
    redirect('/admin/dashboard')
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-dark-bg px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-gray-400">Giriş yaparak devam edin</p>
        </div>
        
        <div className="bg-dark-card border border-gray-800 rounded-2xl p-8 shadow-2xl">
          <LoginForm />
        </div>
      </div>
    </main>
  )
}
