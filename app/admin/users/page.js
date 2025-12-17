'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AdminProtectedRoute from '@/components/AdminProtectedRoute'
import { adminAPI } from '@/lib/api'
import { formatDate, formatDateTime, formatAmount } from '@/utils/formatters'
import { log } from '@/utils/logger'
import { mockAdminUsers, simulateApiDelay } from '@/lib/mockData'

function UserManagement() {
  const pathname = usePathname()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [dateFilter, setDateFilter] = useState('')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [selectedUsers, setSelectedUsers] = useState([])
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [bulkStatus, setBulkStatus] = useState('')
  const [showDateRange, setShowDateRange] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', href: '/admin' },
    { id: 'users', label: 'User Management', icon: 'group', href: '/admin/users' },
    { id: 'games', label: 'Games', icon: 'stadia_controller', href: '/admin/games' },
    { id: 'transactions', label: 'Transactions', icon: 'receipt_long', href: '/admin/transactions' },
    { id: 'settings', label: 'Settings', icon: 'toggle_on', href: '/admin/settings' },
  ]

  useEffect(() => {
    fetchUsers()
  }, [currentPage, searchQuery, statusFilter, dateFilter])

  const fetchUsers = async () => {
    const USE_MOCK_DATA = false
    
    setLoading(true)
    setError('')
    
    if (USE_MOCK_DATA) {
      await simulateApiDelay(600)
      let filteredUsers = [...mockAdminUsers]
      
      // Apply search filter
      if (searchQuery) {
        filteredUsers = filteredUsers.filter(user => 
          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
      
      // Apply status filter
      if (statusFilter && statusFilter !== 'All') {
        filteredUsers = filteredUsers.filter(user => user.status === statusFilter.toLowerCase())
      }
      
      setUsers(filteredUsers)
      setTotalPages(1)
      setTotal(filteredUsers.length)
      setLoading(false)
      return
    }

    try {
      const params = {
        page: currentPage,
        limit: 50,
      }

      if (searchQuery) {
        params.search = searchQuery
      }

      if (statusFilter && statusFilter !== 'All') {
        params.status = statusFilter
      }

      if (startDate) {
        params.startDate = startDate
      }
      if (endDate) {
        params.endDate = endDate
      }

      const response = await adminAPI.getUsers(params)
      setUsers(response.data.users || [])
      setTotalPages(response.data.totalPages || 1)
      setTotal(response.data.total || 0)
    } catch (err) {
      setError(err.response?.data?.message || 'Kullanıcılar yüklenirken bir hata oluştu')
      // Fallback to mock data
      setUsers(mockAdminUsers)
      setTotalPages(1)
      setTotal(mockAdminUsers.length)
      log.apiError('/admin/users', err)
    } finally {
      setLoading(false)
    }
  }
  
  const formatBalance = (balance) => {
    return formatAmount(balance || 0)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400'
      case 'blocked':
      case 'suspended':
        return 'bg-red-500/20 text-red-400'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Active'
      case 'blocked':
        return 'Blocked'
      case 'suspended':
        return 'Suspended'
      case 'pending':
        return 'Pending'
      default:
        return status
    }
  }

  const resultsPerPage = 50
  const startResult = (currentPage - 1) * resultsPerPage + 1
  const endResult = Math.min(currentPage * resultsPerPage, total)

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await adminAPI.updateUserStatus(userId, { status: newStatus })
      setSuccess('User status updated successfully')
      fetchUsers()
      setShowStatusModal(false)
      setSelectedUser(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user status')
    }
  }

  const openStatusModal = (user) => {
    setSelectedUser(user)
    setNewStatus(user.status)
    setShowStatusModal(true)
  }

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(users.map(u => u._id))
    }
  }

  const handleBulkStatusUpdate = async () => {
    if (!bulkStatus || selectedUsers.length === 0) return

    try {
      await adminAPI.bulkUpdateUserStatus({
        userIds: selectedUsers,
        status: bulkStatus,
      })
      setSuccess(`Successfully updated ${selectedUsers.length} users`)
      setSelectedUsers([])
      setShowBulkModal(false)
      setBulkStatus('')
      fetchUsers()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update users')
      log.apiError('/admin/users/bulk-status', err)
    }
  }

  const handleExport = async () => {
    try {
      const params = {}
      if (searchQuery) params.search = searchQuery
      if (statusFilter && statusFilter !== 'All') params.status = statusFilter
      if (startDate) params.startDate = startDate
      if (endDate) params.endDate = endDate

      const response = await adminAPI.exportUsers(params)
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `users-export-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      setSuccess('Users exported successfully')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to export users')
      log.apiError('/admin/users/export', err)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full bg-background-dark">
      {/* SideNavBar */}
      <aside className="sticky top-0 h-screen w-64 flex-shrink-0 bg-[#111718] p-4 flex flex-col justify-between">
        <div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                style={{
                  backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBHyhVZQoc_rCfv7Jf7bxfztOGaidbibXcIeny1CGBS04h4GY9XITJnIz9zcySERIRToKBhPHRNRGiGx1J9iNPB4lLc9h9OxFYZc0mkM6TjHdoSv7thYvvuLrWQ_4utKmsuIL_0mu5iPKahoV4cSyFG8lK6tfsVGaARv6c8-m-k3LBHCIqJQGF83D3c6HN8mE3_DzFGfBOhI4v01mYzySyFTJCzT9aKTPdcgGWz74XgwiVf6Y3jQwYymsuYdtCP8zRuNplIyb9gR7s")'
                }}
              ></div>
              <div className="flex flex-col">
                <h1 className="text-white text-base font-medium leading-normal">Admin Name</h1>
                <p className="text-[#9cb5ba] text-sm font-normal leading-normal">Super Administrator</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-4">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    pathname === item.href
                      ? 'bg-[#0dccf2]/20 text-[#0dccf2]'
                      : 'text-white/70 hover:bg-[#0dccf2]/10 hover:text-white'
                  }`}
                >
                  <span className={`material-symbols-outlined ${pathname === item.href ? 'fill' : ''}`}>
                    {item.icon}
                  </span>
                  <p className="text-sm font-medium leading-normal">{item.label}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#0dccf2] text-[#111718] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#0dccf2]/90 transition-colors">
            <span className="truncate">Logout</span>
          </button>

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
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:bg-[#0dccf2]/10 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined">description</span>
              <p className="text-sm font-medium leading-normal">Documentation</p>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="w-full max-w-7xl mx-auto">
          {/* PageHeading */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <p className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">User Management</p>
            <div className="flex items-center gap-2">
              {selectedUsers.length > 0 && (
                <>
                  <button
                    onClick={() => setShowBulkModal(true)}
                    className="flex items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-yellow-500 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-yellow-600 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">edit</span>
                    <span className="truncate">Bulk Update ({selectedUsers.length})</span>
                  </button>
                  <button
                    onClick={() => setSelectedUsers([])}
                    className="flex items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-gray-500 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-600 transition-colors"
                  >
                    <span className="truncate">Clear Selection</span>
                  </button>
                </>
              )}
              <button
                onClick={handleExport}
                className="flex items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-green-500 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-green-600 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">download</span>
                <span className="truncate">Export CSV</span>
              </button>
              <button className="flex items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-[#0dccf2] text-[#111718] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#0dccf2]/90 transition-colors">
                <span className="material-symbols-outlined text-lg">add_circle</span>
                <span className="truncate">Add New User</span>
              </button>
            </div>
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

          {/* Controls: SearchBar and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="flex flex-col min-w-40 h-12 w-full">
                <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                  <div className="text-[#9cb5ba] flex border-none bg-[#111718] items-center justify-center pl-4 rounded-l-xl border-r-0">
                    <span className="material-symbols-outlined">search</span>
                  </div>
                  <input
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-xl text-white focus:outline-0 focus:ring-2 focus:ring-[#0dccf2]/50 border-none bg-[#111718] h-full placeholder:text-[#9cb5ba] px-4 text-base font-normal leading-normal"
                    placeholder="Search by Username, Email..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setCurrentPage(1)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        fetchUsers()
                      }
                    }}
                    type="text"
                  />
                </div>
              </label>
            </div>

            <div className="flex gap-3 items-center">
              <button
                onClick={() => setStatusFilter(statusFilter === 'All' ? '' : 'All')}
                className="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-[#111718] px-4 hover:bg-[#1b2527] transition-colors"
              >
                <span className="material-symbols-outlined text-[#9cb5ba]">tune</span>
                <p className="text-white text-sm font-medium leading-normal">Status: {statusFilter || 'All'}</p>
                <span className="material-symbols-outlined text-[#9cb5ba]">expand_more</span>
              </button>

              {showDateRange ? (
                <div className="flex gap-2 items-center">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-12 rounded-xl bg-[#111718] px-4 text-white text-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#0dccf2]/50"
                    placeholder="Start Date"
                  />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-12 rounded-xl bg-[#111718] px-4 text-white text-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#0dccf2]/50"
                    placeholder="End Date"
                  />
                  <button
                    onClick={() => {
                      setShowDateRange(false)
                      setStartDate('')
                      setEndDate('')
                    }}
                    className="h-12 w-12 rounded-xl bg-[#111718] hover:bg-[#1b2527] flex items-center justify-center transition-colors"
                  >
                    <span className="material-symbols-outlined text-[#9cb5ba]">close</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowDateRange(true)}
                  className="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-[#111718] px-4 hover:bg-[#1b2527] transition-colors"
                >
                  <span className="material-symbols-outlined text-[#9cb5ba]">calendar_month</span>
                  <p className="text-white text-sm font-medium leading-normal">Date Range</p>
                  <span className="material-symbols-outlined text-[#9cb5ba]">expand_more</span>
                </button>
              )}

              <button
                onClick={() => {
                  setSearchQuery('')
                  setStatusFilter('All')
                  setStartDate('')
                  setEndDate('')
                  setShowDateRange(false)
                }}
                className="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-transparent px-4 text-[#9cb5ba] hover:bg-[#111718] hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
                <p className="text-sm font-medium leading-normal">Clear Filters</p>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="w-full @container">
            <div className="flex overflow-hidden rounded-xl border border-[#3b5054] bg-[#111718]">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#1b2527]">
                    <th className="px-6 py-4 text-left text-white text-xs font-medium uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === users.length && users.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-white/20 bg-transparent"
                      />
                    </th>
                    <th className="table-col-username px-6 py-4 text-left text-white text-xs font-medium uppercase tracking-wider">
                      Username
                    </th>
                    <th className="table-col-email px-6 py-4 text-left text-white text-xs font-medium uppercase tracking-wider">
                      Email
                    </th>
                    <th className="table-col-regdate px-6 py-4 text-left text-white text-xs font-medium uppercase tracking-wider">
                      Registration Date
                    </th>
                    <th className="table-col-lastlogin px-6 py-4 text-left text-white text-xs font-medium uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="table-col-status px-6 py-4 text-left text-white text-xs font-medium uppercase tracking-wider">
                      Status
                    </th>
                    <th className="table-col-balance px-6 py-4 text-left text-white text-xs font-medium uppercase tracking-wider">
                      Wallet Balance
                    </th>
                    <th className="table-col-actions px-6 py-4 text-right text-white text-xs font-medium uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3b5054]">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-[#9cb5ba]">Yükleniyor...</td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-[#9cb5ba]">Kullanıcı bulunamadı.</td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user._id} className="hover:bg-[#1b2527] transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user._id)}
                            onChange={() => handleSelectUser(user._id)}
                            className="rounded border-white/20 bg-transparent"
                          />
                        </td>
                        <td className="table-col-username px-6 py-4 whitespace-nowrap text-white text-sm font-medium">
                          {user.username}
                        </td>
                        <td className="table-col-email px-6 py-4 whitespace-nowrap text-[#9cb5ba] text-sm">
                          {user.email}
                        </td>
                        <td className="table-col-regdate px-6 py-4 whitespace-nowrap text-[#9cb5ba] text-sm">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="table-col-lastlogin px-6 py-4 whitespace-nowrap text-[#9cb5ba] text-sm">
                          {formatDateTime(user.lastLogin)}
                        </td>
                        <td className="table-col-status px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                            {getStatusText(user.status)}
                          </span>
                        </td>
                        <td className="table-col-balance px-6 py-4 whitespace-nowrap text-[#9cb5ba] text-sm">
                          {formatBalance(user.balance)}
                        </td>
                      <td className="table-col-actions px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openStatusModal(user)}
                            className="text-[#0dccf2] hover:text-[#0dccf2]/80 transition-colors"
                            title="Change Status"
                          >
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button className="text-[#0dccf2] hover:text-[#0dccf2]/80 transition-colors">
                            <span className="material-symbols-outlined">more_vert</span>
                          </button>
                        </div>
                      </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <style jsx>{`
              @container (max-width: 1024px) {
                .table-col-lastlogin,
                .table-col-regdate {
                  display: none;
                }
              }
              @container (max-width: 768px) {
                .table-col-email,
                .table-col-balance {
                  display: none;
                }
              }
              @container (max-width: 480px) {
                .table-col-status {
                  display: none;
                }
              }
            `}</style>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-[#9cb5ba]">
                Showing <span className="font-medium text-white">{startResult}</span> to{' '}
                <span className="font-medium text-white">{endResult}</span> of{' '}
                <span className="font-medium text-white">{total}</span> results
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center justify-center h-9 w-9 rounded-lg bg-[#111718] text-white hover:bg-[#0dccf2]/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-xl">chevron_left</span>
                </button>
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const page = i + 1
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`flex items-center justify-center h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-[#0dccf2] text-[#111718]'
                          : 'bg-[#111718] text-white hover:bg-[#0dccf2]/20'
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}
                {totalPages > 5 && <span className="text-white">...</span>}
                {totalPages > 5 && (
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`flex items-center justify-center h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === totalPages
                        ? 'bg-[#0dccf2] text-[#111718]'
                        : 'bg-[#111718] text-white hover:bg-[#0dccf2]/20'
                    }`}
                  >
                    {totalPages}
                  </button>
                )}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center justify-center h-9 w-9 rounded-lg bg-[#111718] text-white hover:bg-[#0dccf2]/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-xl">chevron_right</span>
                </button>
              </div>
            </div>
          )}

          {/* Status Change Modal */}
          {showStatusModal && selectedUser && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-[#111718] rounded-xl p-6 max-w-md w-full mx-4 border border-white/10">
                <h3 className="text-white text-xl font-bold mb-4">Change User Status</h3>
                <div className="mb-4">
                  <p className="text-white/70 text-sm mb-2">User: {selectedUser.username || selectedUser.email}</p>
                  <p className="text-white/70 text-sm mb-4">Current Status: {getStatusText(selectedUser.status)}</p>
                </div>
                <div className="mb-4">
                  <label className="block text-white/70 text-sm mb-2">New Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full h-12 rounded-lg bg-white/5 border border-white/10 text-white px-4 focus:outline-none focus:ring-2 focus:ring-[#0dccf2]/50"
                  >
                    <option value="active">Active</option>
                    <option value="blocked">Blocked</option>
                    <option value="suspended">Suspended</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleStatusChange(selectedUser._id, newStatus)}
                    className="flex-1 px-4 py-2 bg-[#0dccf2] text-white rounded-lg hover:bg-[#0dccf2]/90 transition-colors"
                  >
                    Update Status
                  </button>
                  <button
                    onClick={() => {
                      setShowStatusModal(false)
                      setSelectedUser(null)
                      setNewStatus('')
                    }}
                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bulk Status Update Modal */}
          {showBulkModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-[#111718] rounded-xl p-6 max-w-md w-full mx-4 border border-white/10">
                <h3 className="text-white text-xl font-bold mb-4">Bulk Update Status</h3>
                <div className="mb-4">
                  <p className="text-white/70 text-sm mb-4">
                    Update status for <span className="font-bold text-white">{selectedUsers.length}</span> selected user(s)
                  </p>
                </div>
                <div className="mb-4">
                  <label className="block text-white/70 text-sm mb-2">New Status</label>
                  <select
                    value={bulkStatus}
                    onChange={(e) => setBulkStatus(e.target.value)}
                    className="w-full h-12 rounded-lg bg-white/5 border border-white/10 text-white px-4 focus:outline-none focus:ring-2 focus:ring-[#0dccf2]/50"
                  >
                    <option value="">Select Status</option>
                    <option value="active">Active</option>
                    <option value="blocked">Blocked</option>
                    <option value="suspended">Suspended</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleBulkStatusUpdate}
                    disabled={!bulkStatus}
                    className="flex-1 px-4 py-2 bg-[#0dccf2] text-white rounded-lg hover:bg-[#0dccf2]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Update {selectedUsers.length} Users
                  </button>
                  <button
                    onClick={() => {
                      setShowBulkModal(false)
                      setBulkStatus('')
                    }}
                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default function UserManagementPage() {
  return (
    <AdminProtectedRoute>
      <UserManagement />
    </AdminProtectedRoute>
  )
}

