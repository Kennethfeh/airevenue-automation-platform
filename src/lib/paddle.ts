'use client'

import { initializePaddle, Paddle } from '@paddle/paddle-js'

// Paddle configuration
export const PADDLE_CONFIG = {
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
  vendorId: process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID || '', // You'll add this after Paddle approval
  apiKey: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || '', // Client-side token from Paddle
}

// Product configuration - you'll update these with your actual Paddle product IDs
export const PRODUCTS = {
  freeAnalysis: {
    id: 'pro_01_free_analysis', // Replace with actual Paddle product ID
    name: 'Free Analysis',
    price: 0,
    description: 'Complete business automation assessment'
  },
  consultation: {
    id: 'pro_02_consultation', // Replace with actual Paddle product ID
    name: 'Strategy Consultation',
    price: 497,
    description: '1-on-1 automation strategy session'
  },
  starter: {
    id: 'pro_03_starter', // Replace with actual Paddle product ID
    name: 'Starter Package',
    price: 7997,
    description: 'Complete automation setup for small businesses'
  },
  professional: {
    id: 'pro_04_professional', // Replace with actual Paddle product ID
    name: 'Professional Package',
    price: 12997,
    description: 'Enterprise-grade automation solution'
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
      environment: PADDLE_CONFIG.environment as 'sandbox' | 'production',
      token: PADDLE_CONFIG.apiKey,
      eventCallback: (data) => {
        // Handle Paddle events (optional)
        console.log('Paddle event:', data)
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
export const verifyPaddleWebhook = (signature: string, body: string, secret: string): boolean => {
  // This would be implemented server-side for webhook verification
  // For now, returning true as placeholder
  return true
}