'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { useTranslation } from '@/hooks/useTranslation'
import ProtectedRoute from '@/components/ProtectedRoute'
import { paymentAPI, authAPI } from '@/lib/api'
import { formatDate } from '@/utils/formatters'
import { log } from '@/utils/logger'

function WithdrawPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [user, setUser] = useState(null)
  const [withdrawalRequests, setWithdrawalRequests] = useState([])
  const [minWithdraw, setMinWithdraw] = useState(100)
  const [maxWithdraw, setMaxWithdraw] = useState(50000)

  const quickAmounts = ['100', '250', '500', '1000']

  // Fetch user data and withdrawal requests
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user info
        const userResponse = await authAPI.getMe()
        setUser(userResponse.data)
      } catch (err) {
        log.apiError('/auth/me', err)
        if (err.response?.status === 401) {
          router.push('/auth/login')
        }
      }

      try {
        // Get withdrawal requests
        const requestsResponse = await paymentAPI.getWithdrawalRequests()
        setWithdrawalRequests(requestsResponse.data.withdrawalRequests || [])
      } catch (err) {
        log.apiError('/payment/withdrawal-requests', err)
      }
    }

    fetchData()
  }, [router])

  const handleQuickAmount = (value) => {
    setAmount(value)
    setError('')
  }

  const handleMaxAmount = () => {
    if (user && user.balance) {
      setAmount(user.balance.toString())
      setError('')
    }
  }


  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
      case 'paid':
        return 'bg-green-500/20 text-green-400'
      case 'pending':
      case 'approved':
        return 'bg-orange-500/20 text-orange-400'
      case 'rejected':
      case 'cancelled':
        return 'bg-red-500/20 text-red-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Beklemede'
      case 'approved':
        return 'Onaylandı'
      case 'paid':
        return 'Ödendi'
      case 'rejected':
        return 'Reddedildi'
      case 'cancelled':
        return 'İptal Edildi'
      default:
        return status
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const amountNum = parseFloat(amount)

      if (!amount || amountNum <= 0) {
        setError('Lütfen geçerli bir tutar girin')
        setLoading(false)
        return
      }

      if (amountNum < minWithdraw) {
        setError(`Minimum çekim tutarı ₺${minWithdraw}`)
        setLoading(false)
        return
      }

      if (amountNum > maxWithdraw) {
        setError(`Maksimum çekim tutarı ₺${maxWithdraw}`)
        setLoading(false)
        return
      }

      if (!user.iban || !user.ibanHolderName) {
        setError('Lütfen önce IBAN bilgilerinizi profilinizden kaydedin.')
        setLoading(false)
        return
      }

      if (user.balance < amountNum) {
        setError('Yetersiz bakiye')
        setLoading(false)
        return
      }

      const response = await paymentAPI.createWithdrawal({
        amount: amountNum,
        description: 'IBAN Çekim Talebi',
      })

      setSuccess('Çekim talebi oluşturuldu. Admin onayından sonra IBAN\'ınıza gönderilecektir.')
      setAmount('')
      
      // Refresh user data and withdrawal requests
      const userResponse = await authAPI.getMe()
      setUser(userResponse.data)
      
      const requestsResponse = await paymentAPI.getWithdrawalRequests()
      setWithdrawalRequests(requestsResponse.data.withdrawalRequests || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Çekim talebi oluşturulurken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (id) => {
    if (!confirm('Bu çekim talebini iptal etmek istediğinizden emin misiniz?')) {
      return
    }

    try {
      await paymentAPI.cancelWithdrawal(id)
      setSuccess('Çekim talebi iptal edildi ve bakiye geri yüklendi')
      
      // Refresh data
      const userResponse = await authAPI.getMe()
      setUser(userResponse.data)
      
      const requestsResponse = await paymentAPI.getWithdrawalRequests()
      setWithdrawalRequests(requestsResponse.data.withdrawalRequests || [])
    } catch (err) {
      setError(err.response?.data?.message || 'İptal işlemi başarısız')
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-dark font-display text-[#EAEAEA]">
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-4xl flex-col gap-10">
            {/* Page Heading */}
            <div className="flex flex-wrap items-end justify-between gap-3 p-4">
              <div className="flex flex-col gap-2">
                <p className="text-white text-4xl font-bold leading-tight tracking-[-0.033em]">{t('common.withdrawTitle')}</p>
                <p className="text-white/60 text-base font-normal leading-normal">{t('common.withdrawInstructions')}</p>
                {user && (
                  <p className="text-primary text-lg font-semibold">
                    Mevcut Bakiye: ₺{user.balance?.toFixed(2) || '0.00'}
                  </p>
                )}
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="rounded-lg bg-red-500/20 border border-red-500/50 p-4">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
            {success && (
              <div className="rounded-lg bg-green-500/20 border border-green-500/50 p-4">
                <p className="text-sm text-green-400">{success}</p>
              </div>
            )}

            {/* IBAN Info Warning */}
            {user && (!user.iban || !user.ibanHolderName) && (
              <div className="rounded-lg bg-yellow-500/20 border border-yellow-500/50 p-4">
                <p className="text-sm text-yellow-400">
                  Çekim yapabilmek için önce IBAN bilgilerinizi kaydetmeniz gerekiyor. 
                  <Link href="/profile" className="underline ml-1">Profil sayfasına git</Link>
                </p>
              </div>
            )}

            {/* Withdrawal Form Section */}
            <div className="flex flex-col gap-6 rounded-xl bg-component-dark p-6 shadow-lg sm:p-8">
              <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">{t('common.newWithdrawalRequest')}</h2>
              <form action="#" className="grid grid-cols-1 gap-6 sm:grid-cols-2" method="POST" onSubmit={handleSubmit}>
                {/* Amount Input */}
                <div className="sm:col-span-2">
                  <label className="flex flex-col">
                    <p className="mb-2 text-sm font-medium leading-normal text-white">{t('common.amount')} (₺)</p>
                    <div className="relative">
                      <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">payments</span>
                      <input
                        className="h-12 w-full rounded-lg border border-[#3a3a3a] bg-[#2a2a2a] pl-10 pr-4 text-sm font-normal leading-normal text-white placeholder:text-gray-500 transition-all focus:border-primary focus:bg-[#2f2f2f] focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                        placeholder={t('common.enterAmount')}
                        type="number"
                        step="0.01"
                        min={minWithdraw}
                        max={maxWithdraw}
                        value={amount}
                        onChange={(e) => {
                          setAmount(e.target.value)
                          setError('')
                        }}
                        disabled={loading || !user?.iban}
                        aria-required="true"
                      />
                    </div>
                  </label>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {quickAmounts.map((quickAmount) => (
                      <button
                        key={quickAmount}
                        type="button"
                        onClick={() => handleQuickAmount(quickAmount)}
                        disabled={loading || !user?.iban}
                        className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-background-dark px-4 transition-colors hover:bg-white/10 disabled:opacity-50"
                      >
                        <p className="text-white/80 text-sm font-medium leading-normal">{quickAmount} ₺</p>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={handleMaxAmount}
                      disabled={loading || !user?.iban || !user?.balance}
                      className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary/20 px-4 text-primary transition-colors hover:bg-primary/30 disabled:opacity-50"
                    >
                      <p className="font-semibold leading-normal text-sm">{t('common.maximum')}</p>
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-gray-400">
                    Min: ₺{minWithdraw} - Max: ₺{maxWithdraw}
                  </p>
                </div>

                {/* IBAN Info Display */}
                {user?.iban && (
                  <div className="sm:col-span-2 rounded-lg bg-background-dark p-4">
                    <p className="text-sm font-medium text-white mb-2">IBAN Bilgileriniz:</p>
                    <p className="text-sm text-gray-300">IBAN: {user.iban}</p>
                    <p className="text-sm text-gray-300">Hesap Sahibi: {user.ibanHolderName}</p>
                    {user.bankName && <p className="text-sm text-gray-300">Banka: {user.bankName}</p>}
                  </div>
                )}

                {/* Submit Button */}
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={loading || !user?.iban || !amount}
                    className="flex w-full min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-4 bg-primary text-black text-base font-bold leading-normal tracking-[0.015em] shadow-[0_4px_14px_rgba(249,212,6,0.25)] transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <span className="material-symbols-outlined animate-spin">sync</span>
                        <span className="truncate">İşleniyor...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined">lock</span>
                        <span className="truncate">{t('common.sendWithdrawalRequest')}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Recent Withdrawals Section */}
            <div className="flex flex-col gap-4">
              <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4">{t('common.recentTransactions')}</h2>
              {withdrawalRequests.length === 0 ? (
                <div className="rounded-xl bg-component-dark shadow-lg p-8 text-center">
                  <p className="text-gray-400">Henüz çekim talebiniz bulunmamaktadır.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl bg-component-dark shadow-lg">
                  <table className="min-w-full text-left text-sm">
                    <thead className="border-b border-white/10 text-white/60">
                      <tr>
                        <th className="px-6 py-4 font-medium" scope="col">{t('common.date')}</th>
                        <th className="px-6 py-4 font-medium" scope="col">IBAN</th>
                        <th className="px-6 py-4 font-medium" scope="col">{t('common.amount')}</th>
                        <th className="px-6 py-4 font-medium" scope="col">{t('common.status')}</th>
                        <th className="px-6 py-4 font-medium text-right" scope="col">İşlem</th>
                      </tr>
                    </thead>
                    <tbody>
                      {withdrawalRequests.map((request) => (
                        <tr key={request._id} className="border-b border-white/10 transition-colors hover:bg-white/5 last:border-b-0">
                          <td className="whitespace-nowrap px-6 py-4">{formatDate(request.createdAt)}</td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-300">{request.iban?.substring(0, 8)}...</p>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 font-medium text-white">₺{request.amount?.toFixed(2)}</td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <span className={`inline-flex items-center rounded-full ${getStatusColor(request.status)} px-2.5 py-0.5 text-xs font-medium`}>
                              {getStatusText(request.status)}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-right">
                            {request.status === 'pending' && (
                              <button
                                onClick={() => handleCancel(request._id)}
                                className="text-red-400 hover:text-red-300 text-sm underline"
                              >
                                İptal Et
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-solid border-white/10">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-white/50 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p>© 2023 Garbet. Tüm hakları saklıdır.</p>
            <div className="flex items-center gap-6">
              <Link className="hover:text-white" href="/help/contact">Yardım & Destek</Link>
              <Link className="hover:text-white" href="/terms">Şartlar ve Koşullar</Link>
              <Link className="hover:text-white" href="/about/responsible-gaming">Sorumlu Oyun</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function WithdrawPageWrapper() {
  return (
    <ProtectedRoute>
      <WithdrawPage />
    </ProtectedRoute>
  )
}
