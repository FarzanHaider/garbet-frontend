'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLoginPage() {
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { authAPI } = await import('@/lib/api')
      const response = await authAPI.login(email, password)

      // backend returns { token, user, redirectPath }
      const { token, user, redirectPath } = response.data || {}

      if (!user) {
        setError('Login failed. Invalid server response.')
        setLoading(false)
        return
      }

      // Check if user has admin role
      if (!['admin', 'super_admin', 'operator'].includes(user.role)) {
        setError('Access denied. Admin credentials required.')
        setLoading(false)
        return
      }

      // Store token and user data (non-sensitive)
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('isAdmin', 'true')
        localStorage.setItem('adminEmail', user.email)
      }

      // Redirect to admin dashboard
      router.push(redirectPath || '/admin')
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background-dark p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        <header className="mb-8 flex flex-col items-center gap-4 text-white">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#0dccf2] text-4xl">sports_esports</span>
            <h1 className="text-white text-2xl font-bold leading-tight tracking-[-0.015em]">Garbet</h1>
          </div>
          <p className="text-white/70 text-sm">Administrator Login</p>
        </header>

        <main className="w-full rounded-xl bg-[#1E1E1E] p-6 sm:p-8 shadow-[0_0_20px_rgba(13,204,242,0.1)] border border-white/10">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-white">Admin Access</h2>
            <p className="mt-2 text-sm text-gray-400">Enter your administrator credentials</p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-500/20 border border-red-500/50 p-3">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium leading-normal text-white" htmlFor="admin-email">
                Email Address
              </label>
              <input
                id="admin-email"
                className="h-12 w-full rounded-lg border border-[#3a3a3a] bg-[#2a2a2a] px-4 text-sm font-normal leading-normal text-white placeholder:text-gray-500 transition-all focus:border-primary focus:bg-[#2f2f2f] focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="admin@casino.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                aria-required="true"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium leading-normal text-white" htmlFor="admin-password">
                Password
              </label>
              <div className="relative flex w-full items-center">
                <input
                  id="admin-password"
                  className="h-12 w-full rounded-lg border border-[#3a3a3a] bg-[#2a2a2a] px-4 pr-12 text-sm font-normal leading-normal text-white placeholder:text-gray-500 transition-all focus:border-primary focus:bg-[#2f2f2f] focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  aria-required="true"
                />
                <button
                  className="absolute right-3 flex items-center justify-center text-gray-400 transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 rounded disabled:opacity-50"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={0}
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <button
              className="mt-2 flex h-12 w-full items-center justify-center rounded-lg bg-primary text-center text-sm font-bold text-black transition-all hover:brightness-110 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[#1E1E1E] disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Demo: Use admin@casino.com or admin@example.com
            </p>
            <Link className="mt-4 inline-block text-sm font-medium text-[#0dccf2] hover:underline" href="/">
              Back to Home
            </Link>
          </div>
        </main>
      </div>
    </div>
  )
}
