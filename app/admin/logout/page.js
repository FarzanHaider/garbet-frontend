'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogoutPage() {
  const router = useRouter()

  useEffect(() => {
    // Clear all authentication data
    localStorage.removeItem('token')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    localStorage.removeItem('isAdmin')
    localStorage.removeItem('adminEmail')
    
    // Redirect to login
    router.push('/auth/login')
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background-dark">
      <p className="text-white">Logging out...</p>
    </div>
  )
}

