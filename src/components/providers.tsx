'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
})

// App Configuration Context
interface AppConfig {
  apiUrl: string
  version: string
  environment: 'development' | 'staging' | 'production'
  features: {
    whiteLabel: boolean
    analytics: boolean
    voiceBot: boolean
    mobileApp: boolean
  }
}

const AppConfigContext = createContext<AppConfig | null>(null)

export const useAppConfig = () => {
  const context = useContext(AppConfigContext)
  if (!context) {
    throw new Error('useAppConfig must be used within AppConfigProvider')
  }
  return context
}

// Global State Context for real-time features
interface GlobalState {
  notifications: any[]
  isOnline: boolean
  lastSync: string | null
  unreadCount: number
}

interface GlobalStateContextType {
  state: GlobalState
  updateNotifications: (notifications: any[]) => void
  markAsRead: (notificationId: string) => void
  updateSyncStatus: (timestamp: string) => void
}

const GlobalStateContext = createContext<GlobalStateContextType | null>(null)

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext)
  if (!context) {
    throw new Error('useGlobalState must be used within GlobalStateProvider')
  }
  return context
}

// Global State Provider
const GlobalStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GlobalState>({
    notifications: [],
    isOnline: true,
    lastSync: null,
    unreadCount: 0,
  })

  useEffect(() => {
    // Online/offline status
    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }))
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }))

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const updateNotifications = (notifications: any[]) => {
    setState(prev => ({
      ...prev,
      notifications,
      unreadCount: notifications.filter(n => !n.read).length,
    }))
  }

  const markAsRead = (notificationId: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, prev.unreadCount - 1),
    }))
  }

  const updateSyncStatus = (timestamp: string) => {
    setState(prev => ({ ...prev, lastSync: timestamp }))
  }

  const value: GlobalStateContextType = {
    state,
    updateNotifications,
    markAsRead,
    updateSyncStatus,
  }

  return (
    <GlobalStateContext.Provider value={value}>
      {children}
    </GlobalStateContext.Provider>
  )
}

// App Configuration Provider
const AppConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const config: AppConfig = {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    environment: (process.env.NODE_ENV as AppConfig['environment']) || 'development',
    features: {
      whiteLabel: process.env.NEXT_PUBLIC_ENABLE_WHITE_LABEL === 'true',
      analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
      voiceBot: process.env.NEXT_PUBLIC_ENABLE_VOICE_BOT === 'true',
      mobileApp: process.env.NEXT_PUBLIC_ENABLE_MOBILE_APP === 'true',
    },
  }

  return (
    <AppConfigContext.Provider value={config}>
      {children}
    </AppConfigContext.Provider>
  )
}

// Error Boundary
interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo)
    
    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      // Send to Sentry or other error tracking service
      // Sentry.captureException(error, { contexts: { react: errorInfo } })
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="mt-3 text-center sm:mt-5">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                Something went wrong
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  We apologize for the inconvenience. Please refresh the page or contact support if the problem persists.
                </p>
              </div>
            </div>
            <div className="mt-5 sm:mt-6">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Main Providers Component - Simplified for initial setup
export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary>
      <AppConfigProvider>
        <QueryClientProvider client={queryClient}>
          <GlobalStateProvider>
            {children}
          </GlobalStateProvider>
        </QueryClientProvider>
      </AppConfigProvider>
    </ErrorBoundary>
  )
}