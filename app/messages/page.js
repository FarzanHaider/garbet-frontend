'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useTranslation } from '@/hooks/useTranslation'
import { supportAPI } from '@/lib/api'
import { mockMessages, simulateApiDelay } from '@/lib/mockData'

function MessagesPage() {
  const { t } = useTranslation()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    category: 'general',
    priority: 'medium'
  })

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    const USE_MOCK_DATA = false
    
    if (USE_MOCK_DATA) {
      await simulateApiDelay(600)
      // Convert messages to tickets format for compatibility
      const tickets = mockMessages.map(msg => ({
        _id: msg._id,
        subject: msg.subject,
        message: msg.content,
        category: msg.category,
        status: msg.isRead ? 'read' : 'unread',
        priority: msg.isImportant ? 'high' : 'medium',
        createdAt: msg.createdAt,
        updatedAt: msg.createdAt
      }))
      setTickets(tickets)
      setLoading(false)
      return
    }

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        return
      }

      const response = await supportAPI.getMyTickets()
      if (response.data) {
        setTickets(response.data.tickets || [])
      }
    } catch (error) {
      // Fallback to mock data
      const tickets = mockMessages.map(msg => ({
        _id: msg._id,
        subject: msg.subject,
        message: msg.content,
        category: msg.category,
        status: msg.isRead ? 'read' : 'unread',
        priority: msg.isImportant ? 'high' : 'medium',
        createdAt: msg.createdAt,
        updatedAt: msg.createdAt
      }))
      setTickets(tickets)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTicket = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await supportAPI.createTicket(formData)
      if (response.data) {
        setShowCreateForm(false)
        setFormData({ subject: '', message: '', category: 'general', priority: 'medium' })
        fetchTickets()
      }
    } catch (error) {
      // Error handled by UI state
    }
  }

  const handleRespond = async (ticketId, message) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await supportAPI.respondToTicket(ticketId, { message })
      if (response.data) {
        fetchTickets()
        if (selectedTicket?._id === ticketId) {
          const updated = await supportAPI.getTicketById(ticketId)
          if (updated.data) {
            setSelectedTicket(updated.data.ticket)
          }
        }
      }
    } catch (error) {
      // Error handled by UI state
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-blue-500/20 text-blue-400'
      case 'in_progress':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'closed':
        return 'bg-gray-500/20 text-gray-400'
      case 'resolved':
        return 'bg-green-500/20 text-green-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-400'
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'low':
        return 'bg-green-500/20 text-green-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden font-display bg-background-light dark:bg-background-dark text-text-light">
      <div className="layout-container flex h-full grow flex-col">
        <main className="flex-1 px-4 py-8 md:px-8 lg:px-16 xl:px-24">
          <div className="mx-auto flex max-w-7xl flex-col gap-8">
            {/* Page Heading */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
                  {t('common.messagesButton')}
                </h1>
                <p className="text-text-dark text-base font-normal leading-normal">
                  Manage your support tickets and messages
                </p>
              </div>
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="flex items-center justify-center gap-2 rounded-lg h-11 px-6 bg-primary text-background-dark text-sm font-bold hover:bg-yellow-400 transition-colors"
              >
                <span className="material-symbols-outlined">add</span>
                <span>New Ticket</span>
              </button>
            </div>

            {/* Create Ticket Form */}
            {showCreateForm && (
              <div className="rounded-lg bg-surface p-6 shadow-lg">
                <h3 className="text-white text-xl font-bold mb-4">Create New Support Ticket</h3>
                <form onSubmit={handleCreateTicket} className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">Subject</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full rounded-lg bg-[#3e3e47] text-white px-4 py-2.5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full rounded-lg bg-[#3e3e47] text-white px-4 py-2.5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="general">General</option>
                      <option value="payment">Payment</option>
                      <option value="technical">Technical</option>
                      <option value="bonus">Bonus</option>
                      <option value="kyc">KYC</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full rounded-lg bg-[#3e3e47] text-white px-4 py-2.5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">Message</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      className="w-full rounded-lg bg-[#3e3e47] text-white px-4 py-2.5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 rounded-lg h-11 px-6 bg-primary text-background-dark text-sm font-bold hover:bg-yellow-400 transition-colors"
                    >
                      Submit Ticket
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="flex-1 rounded-lg h-11 px-6 bg-[#3e3e47] text-white text-sm font-bold hover:bg-[#4a4a55] transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Tickets List */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-gray-400">Loading tickets...</div>
              </div>
            ) : tickets.length === 0 ? (
                      <div className="rounded-lg bg-surface p-12 text-center">
                <span className="material-symbols-outlined text-6xl text-gray-500 mb-4">email</span>
                <h3 className="text-white text-xl font-bold mb-2">No Support Tickets</h3>
                <p className="text-gray-400 mb-6">You don&apos;t have any support tickets yet.</p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="inline-flex items-center justify-center rounded-lg h-11 px-6 bg-primary text-background-dark text-sm font-bold hover:bg-yellow-400 transition-colors"
                >
                  Create New Ticket
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {tickets.map((ticket) => (
                  <div
                    key={ticket._id}
                    className="rounded-lg bg-surface p-6 shadow-lg cursor-pointer hover:bg-surface/80 transition-colors"
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-white text-lg font-bold mb-1">{ticket.subject}</h3>
                        <p className="text-gray-400 text-sm line-clamp-2">{ticket.message}</p>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>Category: {ticket.category}</span>
                      <span>{new Date(ticket.createdAt).toLocaleDateString('tr-TR')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Ticket Detail Modal */}
            {selectedTicket && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedTicket(null)}>
                <div className="rounded-lg bg-surface p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-white text-2xl font-bold mb-2">{selectedTicket.subject}</h3>
                      <div className="flex gap-2">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(selectedTicket.status)}`}>
                          {selectedTicket.status}
                        </span>
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                          {selectedTicket.priority}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedTicket(null)}
                      className="text-gray-400 hover:text-white"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="rounded-lg bg-[#3e3e47] p-4">
                      <p className="text-white whitespace-pre-wrap">{selectedTicket.message}</p>
                      <p className="text-gray-400 text-xs mt-2">
                        {new Date(selectedTicket.createdAt).toLocaleString('tr-TR')}
                      </p>
                    </div>

                    {selectedTicket.responses && selectedTicket.responses.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-white font-bold">Responses:</h4>
                        {selectedTicket.responses.map((response, idx) => (
                          <div key={idx} className="rounded-lg bg-[#3e3e47] p-4">
                            <p className="text-white whitespace-pre-wrap">{response.message}</p>
                            <p className="text-gray-400 text-xs mt-2">
                              {new Date(response.createdAt).toLocaleString('tr-TR')}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedTicket.status !== 'closed' && selectedTicket.status !== 'resolved' && (
                      <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2">Add Response</label>
                        <textarea
                          id="response-input"
                          rows={4}
                          className="w-full rounded-lg bg-[#3e3e47] text-white px-4 py-2.5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50 mb-2"
                          placeholder="Type your response..."
                        />
                        <button
                          onClick={() => {
                            const input = document.getElementById('response-input')
                            if (input && input.value.trim()) {
                              handleRespond(selectedTicket._id, input.value)
                              input.value = ''
                            }
                          }}
                          className="rounded-lg h-10 px-6 bg-primary text-background-dark text-sm font-bold hover:bg-yellow-400 transition-colors"
                        >
                          Send Response
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function MessagesPageWrapper() {
  return (
    <ProtectedRoute>
      <MessagesPage />
    </ProtectedRoute>
  )
}

