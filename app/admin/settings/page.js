'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AdminProtectedRoute from '@/components/AdminProtectedRoute'
import { adminAPI } from '@/lib/api'
import { log } from '@/utils/logger'

function SettingsPage() {
  const pathname = usePathname()
  const [settings, setSettings] = useState({
    minDeposit: 100,
    maxDeposit: 50000,
    minWithdrawal: 100,
    maxWithdrawal: 50000,
    depositBonusPercent: 20,
    lossBonusPercent: 20,
    rolloverMultiplier: 5,
    bonusEnabled: true,
    siteName: 'Garbet',
    currency: 'TRY',
    maintenanceMode: false,
    maintenanceMessage: '',
    companyIban: '',
    companyBankName: '',
    companyAccountHolder: '',
    companyBranchCode: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchSettings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchSettings = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await adminAPI.getSettings()
      // Handle different response formats
      const data = response?.data || response
      
      if (data && typeof data === 'object') {
        setSettings({
          minDeposit: data.minDeposit ?? 100,
          maxDeposit: data.maxDeposit ?? 50000,
          minWithdrawal: data.minWithdrawal ?? 100,
          maxWithdrawal: data.maxWithdrawal ?? 50000,
          depositBonusPercent: data.depositBonusPercent ?? 20,
          lossBonusPercent: data.lossBonusPercent ?? 20,
          rolloverMultiplier: data.rolloverMultiplier ?? 5,
          bonusEnabled: data.bonusEnabled ?? true,
          siteName: data.siteName || 'Garbet',
          currency: data.currency || 'TRY',
          maintenanceMode: data.maintenanceMode ?? false,
          maintenanceMessage: data.maintenanceMessage || '',
          companyIban: data.companyIban || '',
          companyBankName: data.companyBankName || '',
          companyAccountHolder: data.companyAccountHolder || '',
          companyBranchCode: data.companyBranchCode || '',
        })
      } else {
        console.warn('Settings data format unexpected:', data)
        setError('Settings data format is invalid')
      }
    } catch (err) {
      console.error('Error fetching settings:', err)
      const errorMsg = err.response?.data?.message || err.message || 'Failed to load settings'
      setError(errorMsg)
      log.apiError('/settings', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')
    
    try {
      // Validate settings
      if (settings.minDeposit < 0 || settings.maxDeposit < settings.minDeposit) {
        setError('Invalid deposit limits')
        setSaving(false)
        return
      }
      if (settings.minWithdrawal < 0 || settings.maxWithdrawal < settings.minWithdrawal) {
        setError('Invalid withdrawal limits')
        setSaving(false)
        return
      }
      if (settings.depositBonusPercent < 0 || settings.depositBonusPercent > 100) {
        setError('Deposit bonus percent must be between 0 and 100')
        setSaving(false)
        return
      }
      if (settings.lossBonusPercent < 0 || settings.lossBonusPercent > 100) {
        setError('Loss bonus percent must be between 0 and 100')
        setSaving(false)
        return
      }
      if (settings.rolloverMultiplier < 1) {
        setError('Rollover multiplier must be at least 1')
        setSaving(false)
        return
      }

      const response = await adminAPI.updateSettings(settings)
      // Handle different response formats
      const responseData = response?.data || response
      const successMessage = responseData?.message || responseData?.settings?.message || 'Settings saved successfully!'
      setSuccess(successMessage)
      log.info('Settings updated successfully')
      
      // Refresh settings to get updated values
      await fetchSettings()
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Error saving settings:', err)
      const errorMsg = err.response?.data?.message || err.message || 'Failed to save settings'
      setError(errorMsg)
      log.apiError('/settings', err)
    } finally {
      setSaving(false)
    }
  }

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
      </aside>

      <main className="flex-1 p-6 lg:p-10 bg-background-light dark:bg-background-dark">
        <div className="layout-content-container flex flex-col w-full max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-between gap-3 mb-6">
            <p className="text-black dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
              Settings
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 rounded-lg bg-red-500/20 border border-red-500/50 p-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 rounded-lg bg-green-500/20 border border-green-500/50 p-4">
              <p className="text-sm text-green-400">{success}</p>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="size-8 animate-spin rounded-full border-4 border-[#0dccf2] border-t-transparent"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Deposit & Withdrawal Limits */}
              <div className="bg-[#1E1E2B]/50 dark:bg-black/20 rounded-xl border border-white/10 p-6">
                <h2 className="text-white text-xl font-semibold mb-6">Deposit & Withdrawal Limits</h2>
                
                <div className="space-y-6">
              <div>
                <label className="block text-white mb-2">Minimum Deposit (₺)</label>
                <input
                  type="number"
                  value={settings.minDeposit}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0
                    setSettings({...settings, minDeposit: value})
                  }}
                  className="w-full h-12 rounded-lg bg-white/5 border border-white/10 text-white px-4 focus:outline-none focus:ring-2 focus:ring-[#0dccf2]/50"
                />
              </div>

              <div>
                <label className="block text-white mb-2">Maximum Deposit (₺)</label>
                <input
                  type="number"
                  value={settings.maxDeposit}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0
                    setSettings({...settings, maxDeposit: value})
                  }}
                  className="w-full h-12 rounded-lg bg-white/5 border border-white/10 text-white px-4 focus:outline-none focus:ring-2 focus:ring-[#0dccf2]/50"
                />
              </div>

              <div>
                <label className="block text-white mb-2">Minimum Withdrawal (₺)</label>
                <input
                  type="number"
                  value={settings.minWithdrawal}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0
                    setSettings({...settings, minWithdrawal: value})
                  }}
                  className="w-full h-12 rounded-lg bg-white/5 border border-white/10 text-white px-4 focus:outline-none focus:ring-2 focus:ring-[#0dccf2]/50"
                />
              </div>

              <div>
                <label className="block text-white mb-2">Maximum Withdrawal (₺)</label>
                <input
                  type="number"
                  value={settings.maxWithdrawal}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0
                    setSettings({...settings, maxWithdrawal: value})
                  }}
                  className="w-full h-12 rounded-lg bg-white/5 border border-white/10 text-white px-4 focus:outline-none focus:ring-2 focus:ring-[#0dccf2]/50"
                />
              </div>

              <div>
                <label className="block text-white mb-2">Deposit Bonus Percent (%)</label>
                <input
                  type="number"
                  value={settings.depositBonusPercent}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0
                    setSettings({...settings, depositBonusPercent: value})
                  }}
                  className="w-full h-12 rounded-lg bg-white/5 border border-white/10 text-white px-4 focus:outline-none focus:ring-2 focus:ring-[#0dccf2]/50"
                />
              </div>

              <div>
                <label className="block text-white mb-2">Loss Bonus Percent (%)</label>
                <input
                  type="number"
                  value={settings.lossBonusPercent}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0
                    setSettings({...settings, lossBonusPercent: value})
                  }}
                  className="w-full h-12 rounded-lg bg-white/5 border border-white/10 text-white px-4 focus:outline-none focus:ring-2 focus:ring-[#0dccf2]/50"
                />
              </div>

                </div>
              </div>

              {/* Bonus Settings */}
              <div className="bg-[#1E1E2B]/50 dark:bg-black/20 rounded-xl border border-white/10 p-6">
                <h2 className="text-white text-xl font-semibold mb-6">Bonus Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="flex items-center gap-3 mb-2">
                      <input
                        type="checkbox"
                        checked={settings.bonusEnabled}
                        onChange={(e) => setSettings({...settings, bonusEnabled: e.target.checked})}
                        className="size-5 rounded border-2 border-white/20 bg-white/5 text-[#0dccf2] focus:ring-2 focus:ring-[#0dccf2]/50"
                      />
                      <span className="text-white">Enable Bonus System</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-white mb-2">Deposit Bonus Percent (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={settings.depositBonusPercent}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0
                        setSettings({...settings, depositBonusPercent: value})
                      }}
                      className="w-full h-12 rounded-lg bg-white/5 border border-white/10 text-white px-4 focus:outline-none focus:ring-2 focus:ring-[#0dccf2]/50"
                    />
                  </div>

                  <div>
                    <label className="block text-white mb-2">Loss Bonus Percent (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={settings.lossBonusPercent}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0
                        setSettings({...settings, lossBonusPercent: value})
                      }}
                      className="w-full h-12 rounded-lg bg-white/5 border border-white/10 text-white px-4 focus:outline-none focus:ring-2 focus:ring-[#0dccf2]/50"
                    />
                  </div>

                  <div>
                    <label className="block text-white mb-2">Rollover Multiplier</label>
                    <input
                      type="number"
                      min="1"
                      value={settings.rolloverMultiplier}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1
                        setSettings({...settings, rolloverMultiplier: value})
                      }}
                      className="w-full h-12 rounded-lg bg-white/5 border border-white/10 text-white px-4 focus:outline-none focus:ring-2 focus:ring-[#0dccf2]/50"
                    />
                    <p className="text-gray-400 text-sm mt-1">Multiplier for bonus rollover requirement</p>
                  </div>
                </div>
              </div>

              {/* Site Settings */}
              <div className="bg-[#1E1E2B]/50 dark:bg-black/20 rounded-xl border border-white/10 p-6">
                <h2 className="text-white text-xl font-semibold mb-6">Site Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-white mb-2">Site Name</label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                      className="w-full h-12 rounded-lg bg-white/5 border border-white/10 text-white px-4 focus:outline-none focus:ring-2 focus:ring-[#0dccf2]/50"
                    />
                  </div>

                  <div>
                    <label className="block text-white mb-2">Default Currency</label>
                    <select
                      value={settings.currency}
                      onChange={(e) => setSettings({...settings, currency: e.target.value})}
                      className="w-full h-12 rounded-lg bg-white/5 border border-white/10 text-white px-4 focus:outline-none focus:ring-2 focus:ring-[#0dccf2]/50"
                    >
                      <option value="TRY" className="bg-[#1E1E2B]">TRY (₺)</option>
                      <option value="USD" className="bg-[#1E1E2B]">USD ($)</option>
                      <option value="EUR" className="bg-[#1E1E2B]">EUR (€)</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-3 mb-2">
                      <input
                        type="checkbox"
                        checked={settings.maintenanceMode}
                        onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                        className="size-5 rounded border-2 border-white/20 bg-white/5 text-[#0dccf2] focus:ring-2 focus:ring-[#0dccf2]/50"
                      />
                      <span className="text-white">Maintenance Mode</span>
                    </label>
                  </div>

                  {settings.maintenanceMode && (
                    <div>
                      <label className="block text-white mb-2">Maintenance Message</label>
                      <textarea
                        value={settings.maintenanceMessage}
                        onChange={(e) => setSettings({...settings, maintenanceMessage: e.target.value})}
                        rows={3}
                        className="w-full rounded-lg bg-white/5 border border-white/10 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0dccf2]/50"
                        placeholder="Enter maintenance message..."
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Company Banking Info */}
              <div className="bg-[#1E1E2B]/50 dark:bg-black/20 rounded-xl border border-white/10 p-6">
                <h2 className="text-white text-xl font-semibold mb-6">Company Banking Information</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-white mb-2">Company IBAN</label>
                    <input
                      type="text"
                      value={settings.companyIban}
                      onChange={(e) => setSettings({...settings, companyIban: e.target.value})}
                      className="w-full h-12 rounded-lg bg-white/5 border border-white/10 text-white px-4 focus:outline-none focus:ring-2 focus:ring-[#0dccf2]/50"
                      placeholder="TR00 0000 0000 0000 0000 0000 00"
                    />
                  </div>

                  <div>
                    <label className="block text-white mb-2">Bank Name</label>
                    <input
                      type="text"
                      value={settings.companyBankName}
                      onChange={(e) => setSettings({...settings, companyBankName: e.target.value})}
                      className="w-full h-12 rounded-lg bg-white/5 border border-white/10 text-white px-4 focus:outline-none focus:ring-2 focus:ring-[#0dccf2]/50"
                    />
                  </div>

                  <div>
                    <label className="block text-white mb-2">Account Holder Name</label>
                    <input
                      type="text"
                      value={settings.companyAccountHolder}
                      onChange={(e) => setSettings({...settings, companyAccountHolder: e.target.value})}
                      className="w-full h-12 rounded-lg bg-white/5 border border-white/10 text-white px-4 focus:outline-none focus:ring-2 focus:ring-[#0dccf2]/50"
                    />
                  </div>

                  <div>
                    <label className="block text-white mb-2">Branch Code</label>
                    <input
                      type="text"
                      value={settings.companyBranchCode}
                      onChange={(e) => setSettings({...settings, companyBranchCode: e.target.value})}
                      className="w-full h-12 rounded-lg bg-white/5 border border-white/10 text-white px-4 focus:outline-none focus:ring-2 focus:ring-[#0dccf2]/50"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-[#0dccf2] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#0bb5d9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">save</span>
                      <span>Save Settings</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default function SettingsPageWrapper() {
  return (
    <AdminProtectedRoute>
      <SettingsPage />
    </AdminProtectedRoute>
  )
}

