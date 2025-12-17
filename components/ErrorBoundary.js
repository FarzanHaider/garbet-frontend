'use client'

import { Component } from 'react'
import Link from 'next/link'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    // In production, you might want to log to an error reporting service
    // Example: errorTrackingService.captureException(error, { contexts: { react: errorInfo } })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background-dark p-4">
          <div className="max-w-md w-full bg-component-dark rounded-lg p-8 border border-red-500/20">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 p-4 bg-red-500/10 rounded-full">
                <span className="material-symbols-outlined text-red-400 text-4xl">error</span>
              </div>
              
              <h1 className="text-white text-2xl font-bold mb-2">Something went wrong</h1>
              <p className="text-white/70 text-sm mb-6">
                We&apos;re sorry, but something unexpected happened. Please try refreshing the page.
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="w-full mb-4 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                  <p className="text-red-400 text-xs font-mono text-left break-all">
                    {this.state.error.toString()}
                  </p>
                </div>
              )}

              <div className="flex gap-3 w-full">
                <button
                  onClick={this.handleReset}
                  className="flex-1 px-4 py-2 bg-primary text-black rounded-lg font-bold hover:bg-yellow-400 transition-colors"
                >
                  Try Again
                </button>
                <Link
                  href="/"
                  className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg font-bold hover:bg-white/20 transition-colors text-center"
                >
                  Go Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

