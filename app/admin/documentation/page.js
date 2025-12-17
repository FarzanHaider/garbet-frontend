'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AdminProtectedRoute from '@/components/AdminProtectedRoute'

function DocumentationPage() {
  const pathname = usePathname()

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', href: '/admin' },
    { id: 'users', label: 'Users', icon: 'group', href: '/admin/users' },
    { id: 'games', label: 'Games', icon: 'casino', href: '/admin/games' },
    { id: 'finances', label: 'Deposits & Withdrawals', icon: 'credit_card', href: '/admin/finances' },
    { id: 'settings', label: 'Settings', icon: 'settings', href: '/admin/settings' },
  ]

  return (
    <div className="flex min-h-screen w-full bg-background-dark">
      <aside className="w-64 shrink-0 bg-[#1A1A2E]/30 dark:bg-black/20 p-4 flex flex-col justify-between border-r border-white/10">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 p-2 mb-4">
            <span className="material-symbols-outlined text-[#0dccf2] text-3xl">sports_esports</span>
            <h1 className="text-white text-xl font-bold leading-normal">Garbet</h1>
          </div>

          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  pathname === item.href
                    ? 'bg-[#0dccf2]/20 text-[#0dccf2]'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined" style={pathname === item.href ? { fontVariationSettings: "'FILL' 1" } : {}}>
                  {item.icon}
                </span>
                <p className="text-sm font-medium leading-normal">{item.label}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1 border-t border-white/10 pt-4">
          <Link
            href="/admin/support"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:bg-[#0dccf2]/10 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">support_agent</span>
            <p className="text-sm font-medium leading-normal">Support</p>
          </Link>
          <Link
            href="/admin/documentation"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#0dccf2] bg-[#0dccf2]/20 transition-colors"
          >
            <span className="material-symbols-outlined">description</span>
            <p className="text-sm font-medium leading-normal">Documentation</p>
          </Link>
          <Link
            href="/admin/logout"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:bg-[#0dccf2]/10 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">logout</span>
            <p className="text-sm font-medium leading-normal">Logout</p>
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-6 lg:p-10 bg-background-light dark:bg-background-dark">
        <div className="layout-content-container flex flex-col w-full max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-between gap-3 mb-6">
            <p className="text-black dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
              Documentation
            </p>
          </div>

          <div className="bg-[#1E1E2B]/50 dark:bg-black/20 rounded-xl border border-white/10 p-6 space-y-6">
            <section>
              <h2 className="text-white text-2xl font-semibold mb-4">Admin Panel Guide</h2>
              <div className="text-white/70 space-y-4">
                <div>
                  <h3 className="text-white font-semibold mb-2">User Management</h3>
                  <p>Manage user accounts, view user details, and handle user-related operations from the Users page.</p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Financial Operations</h3>
                  <p>Approve or reject deposit and withdrawal requests from the Finances page. All transactions are logged for audit purposes.</p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Game Management</h3>
                  <p>Add, edit, or remove games from the platform. Configure game settings and availability.</p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">System Settings</h3>
                  <p>Configure platform-wide settings including deposit/withdrawal limits, bonus percentages, and rollover requirements.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-white text-2xl font-semibold mb-4">API Documentation</h2>
              <p className="text-white/70">API documentation is available at /api/docs (when implemented).</p>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function DocumentationPageWrapper() {
  return (
    <AdminProtectedRoute>
      <DocumentationPage />
    </AdminProtectedRoute>
  )
}

