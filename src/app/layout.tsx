import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Providers } from '@/components/providers'
import { Toaster } from 'react-hot-toast'
import { LiveChat } from '@/components/chat/live-chat'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
  title: 'AI Revenue Automation Platform - $50K+/Month AI Customer Service Agency',
  description: 'Premium AI Customer Service Automation Agency Platform. Generate $50,000+ monthly revenue with enterprise-grade AI chatbots, multi-channel integration, and advanced analytics.',
  keywords: [
    'AI customer service',
    'chatbot automation',
    'customer support AI',
    'business automation',
    'AI agency platform',
    'enterprise chatbots',
    'customer service automation',
    'AI revenue generation'
  ],
  authors: [{ name: 'AI Revenue Automation Platform' }],
  creator: 'AI Revenue Automation Platform',
  publisher: 'AI Revenue Automation Platform',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://airevenue-platform.com',
    siteName: 'AI Revenue Automation Platform',
    title: 'Premium AI Customer Service Automation Agency Platform',
    description: 'Enterprise-grade AI chatbots and automation tools designed to generate $50K+ monthly revenue for your agency.',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Revenue Automation Platform - Enterprise AI Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Revenue Automation Platform - Enterprise AI Solutions',
    description: 'Premium AI Customer Service Automation Agency Platform for $50K+ monthly revenue.',
    images: ['/images/twitter-image.png'],
    creator: '@airevenue',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-gray-950 font-sans antialiased">
        <Providers>
          {children}
          <LiveChat />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              className: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700',
            }}
          />
        </Providers>
      </body>
    </html>
  )
}