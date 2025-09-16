'use client'

// LemonSqueezy Payment Integration
// Global card payments for all countries including Korea

export interface LemonSqueezyProduct {
  id: string
  name: string
  description: string
  price: number
  monthlyPrice?: number
  yearlyPrice?: number
  variant_id: string // LemonSqueezy variant ID
}

// LemonSqueezy Product Configuration
// Replace these with your actual LemonSqueezy variant IDs after account setup
export const LEMONSQUEEZY_PRODUCTS: Record<string, LemonSqueezyProduct> = {
  freeAnalysis: {
    id: 'free-analysis',
    name: 'Free Business Analysis',
    description: 'Complete automation assessment',
    price: 0,
    variant_id: 'YOUR_FREE_ANALYSIS_VARIANT_ID'
  },
  consultation: {
    id: 'strategy-consultation',
    name: 'Strategy Consultation',
    description: '90-minute expert consultation',
    price: 497,
    variant_id: 'YOUR_CONSULTATION_VARIANT_ID'
  },
  starter: {
    id: 'starter-package',
    name: 'Starter Package',
    description: 'Complete automation setup',
    price: 7997,
    variant_id: 'YOUR_STARTER_VARIANT_ID'
  },
  professional: {
    id: 'professional-package',
    name: 'Professional Package',
    description: 'Enterprise automation solution',
    price: 12997,
    variant_id: 'YOUR_PROFESSIONAL_VARIANT_ID'
  }
}

// Initialize LemonSqueezy checkout
export const initLemonSqueezyCheckout = (variantId: string, customData?: any) => {
  // LemonSqueezy checkout URL format
  const checkoutUrl = `https://flowsupportai.lemonsqueezy.com/checkout/buy/${variantId}`

  // Add custom data as URL parameters if needed
  if (customData) {
    const params = new URLSearchParams(customData)
    return `${checkoutUrl}?${params.toString()}`
  }

  return checkoutUrl
}

// Open LemonSqueezy checkout in same window (better conversion)
export const openLemonSqueezyCheckout = (productKey: keyof typeof LEMONSQUEEZY_PRODUCTS) => {
  const product = LEMONSQUEEZY_PRODUCTS[productKey]

  if (!product) {
    console.error('Product not found:', productKey)
    return
  }

  // For free products, redirect to contact
  if (product.price === 0) {
    window.location.href = '/contact'
    return
  }

  // Check if variant ID is configured
  if (product.variant_id.startsWith('YOUR_')) {
    console.error('LemonSqueezy variant ID not configured for:', productKey)
    // Fallback to simple checkout during setup
    const { openSimpleCheckoutModal } = require('./simple-checkout')
    openSimpleCheckoutModal(product.name, 'one-time', product.price)
    return
  }

  // Open LemonSqueezy checkout
  const checkoutUrl = initLemonSqueezyCheckout(product.variant_id, {
    checkout_data: JSON.stringify({
      custom: {
        product_key: productKey,
        product_name: product.name,
        source: 'pricing_page'
      }
    })
  })

  window.location.href = checkoutUrl
}

// Create checkout session with billing options
export const createLemonSqueezyCheckout = (
  productKey: keyof typeof LEMONSQUEEZY_PRODUCTS,
  billing: 'monthly' | 'yearly' | 'one-time' = 'one-time'
) => {
  const product = LEMONSQUEEZY_PRODUCTS[productKey]

  if (!product) {
    throw new Error(`Product ${productKey} not found`)
  }

  // For subscription products, handle billing cycle
  let variantId = product.variant_id
  let price = product.price

  if (billing === 'monthly' && product.monthlyPrice) {
    price = product.monthlyPrice
    // Use monthly variant ID if available
    variantId = product.variant_id.replace('_yearly', '_monthly')
  } else if (billing === 'yearly' && product.yearlyPrice) {
    price = product.yearlyPrice
    // Use yearly variant ID if available
    variantId = product.variant_id.replace('_monthly', '_yearly')
  }

  return {
    product,
    variantId,
    price,
    checkoutUrl: initLemonSqueezyCheckout(variantId, {
      billing_cycle: billing,
      product_name: product.name,
      amount: price
    })
  }
}

// Get product information
export const getLemonSqueezyProduct = (productKey: keyof typeof LEMONSQUEEZY_PRODUCTS) => {
  return LEMONSQUEEZY_PRODUCTS[productKey]
}

// Format price for display
export const formatLemonSqueezyPrice = (price: number): string => {
  if (price === 0) return 'Free'
  return `$${price.toLocaleString()}`
}

// Webhook handler types (for your backend)
export interface LemonSqueezyWebhookData {
  event_name: string
  data: {
    id: string
    attributes: {
      store_id: number
      variant_id: number
      variant_name: string
      user_email: string
      user_name: string
      total: number
      status: string
      custom_data?: any
    }
  }
}

// Success/failure redirect URLs
export const LEMONSQUEEZY_URLS = {
  success: `${typeof window !== 'undefined' ? window.location.origin : 'https://flowsupportai.com'}/payment/success`,
  cancel: `${typeof window !== 'undefined' ? window.location.origin : 'https://flowsupportai.com'}/payment/failed`
}