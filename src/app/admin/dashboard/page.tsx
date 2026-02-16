import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import DashboardClient from '@/components/admin/DashboardClient'

export default async function AdminDashboardPage() {
  const authenticated = await isAuthenticated()
  
  if (!authenticated) {
    redirect('/admin/login')
  }

  const profile = await prisma.profile.findFirst()
  const links = await prisma.link.findMany({
    orderBy: { order: 'asc' },
  })

  return (
    <DashboardClient 
      initialProfile={profile} 
      initialLinks={links} 
    />
  )
}
