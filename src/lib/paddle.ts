'use client'

import { initializePaddle, Paddle } from '@paddle/paddle-js'

// Paddle configuration
export const PADDLE_CONFIG = {
  environment: 'production' as const,
  sellerId: '253274', // Your Paddle Seller ID
  apiKey: 'live_258982d9ee41c671665ae34b65d', // Your actual Paddle Client Token
}

// Product configuration - FlowSupport AI Pricing Tiers
export const PRODUCTS = {
  growthMonthly: {
    id: 'pri_01k59bk6ttdtkd75tbkvn1v4hc', // Growth Plan Monthly - Your actual Paddle Price ID
    name: 'Growth Plan',
    price: 249,
    description: 'Save $8,000+ monthly in support costs',
    billing: 'monthly' as const
  },
  growthYearly: {
    id: 'pri_01k59befr6ebm9j0czccppw99n', // Growth Plan Yearly - Your actual Paddle Price ID
    name: 'Growth Plan (Yearly)',
    price: 2990,
    description: 'Save $8,000+ monthly in support costs - 20% off yearly',
    billing: 'yearly' as const
  },
  professionalMonthly: {
    id: 'pri_01k59bna93cma1ssnz4x1gbpva', // Professional Plan Monthly - Your actual Paddle Price ID
    name: 'Professional Plan',
    price: 666,
    description: 'Save $15,000+ monthly with advanced automation',
    billing: 'monthly' as const
  },
  professionalYearly: {
    id: 'pri_01k59bna93cma1ssnz4x1gbpva', // Professional Plan Yearly - Your actual Paddle Price ID
    name: 'Professional Plan (Yearly)',
    price: 7990,
    description: 'Save $15,000+ monthly with advanced automation - 20% off yearly',
    billing: 'yearly' as const
  },
  enterprise: {
    id: 'enterprise', // Enterprise is custom pricing - contact sales
    name: 'Enterprise Plan',
    price: 'Custom',
    description: 'Save $25,000+ monthly with unlimited scale',
    billing: 'custom' as const
  }
}

// Initialize Paddle instance
let paddleInstance: Paddle | null = null

export const initPaddle = async (): Promise<Paddle> => {
  if (paddleInstance) {
    return paddleInstance
  }

  try {
    paddleInstance = await initializePaddle({
      environment: PADDLE_CONFIG.environment,
      token: PADDLE_CONFIG.apiKey,
      eventCallback: (data) => {
        // Handle Paddle events
        console.log('Paddle event:', data)

        // Handle successful payment
        if (data.name === 'checkout.completed') {
          console.log('Payment completed:', data)
          // Redirect to success page or show success message
          window.location.href = '/payment/success'
        }

        // Handle payment failure
        if (data.name === 'checkout.error') {
          console.error('Payment error:', data)
          // Handle error appropriately
        }
      }
    })

    return paddleInstance
  } catch (error) {
    console.error('Failed to initialize Paddle:', error)
    throw new Error('Payment system initialization failed')
  }
}

// Paddle checkout options
export interface CheckoutOptions {
  productId: string
  customData?: Record<string, any>
  customerEmail?: string
  customerName?: string
  successUrl?: string
  closeCallback?: () => void
  popupCallback?: (data: any) => void
}

// Open Paddle checkout
export const openPaddleCheckout = async (options: CheckoutOptions) => {
  try {
    const paddle = await initPaddle()
    
    const checkoutOptions = {
      items: [
        {
          priceId: options.productId,
          quantity: 1
        }
      ],
      customData: options.customData,
      customer: options.customerEmail ? {
        email: options.customerEmail,
        ...(options.customerName && { name: options.customerName })
      } : undefined,
      settings: {
        displayMode: 'overlay' as const,
        theme: 'light' as const,
        locale: 'en' as const,
        successUrl: options.successUrl || `${window.location.origin}/payment/success`,
        closeCallback: options.closeCallback,
        popupCallback: options.popupCallback
      }
    }

    paddle.Checkout.open(checkoutOptions)
  } catch (error) {
    console.error('Failed to open Paddle checkout:', error)
    throw new Error('Unable to open payment checkout')
  }
}

// Get product info
export const getProduct = (productKey: keyof typeof PRODUCTS) => {
  return PRODUCTS[productKey]
}

// Format price for display
export const formatPrice = (price: number): string => {
  if (price === 0) return 'Free'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// Paddle webhook signature verification (for server-side)
export const verifyPaddleWebhook = (_signature: string, _body: string, _secret: string): boolean => {
  // This would be implemented server-side for webhook verification
  // For now, returning true as placeholder
  return true
}