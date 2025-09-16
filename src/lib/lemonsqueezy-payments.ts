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
// Updated with actual LemonSqueezy variant IDs
export const LEMONSQUEEZY_PRODUCTS: Record<string, LemonSqueezyProduct> = {
  freeAnalysis: {
    id: 'free-analysis',
    name: 'Free Business Analysis',
    description: 'Complete automation assessment',
    price: 0,
    variant_id: 'contact' // Free analysis redirects to contact form
  },
  consultation: {
    id: 'strategy-consultation',
    name: 'Strategy Consultation',
    description: '90-minute expert consultation',
    price: 497,
    variant_id: '637093' // Strategy consultation - one-time payment
  },
  growthMonthly: {
    id: 'growth-monthly',
    name: 'Growth Plan Monthly',
    description: 'Monthly subscription for growth plan',
    price: 249,
    monthlyPrice: 249,
    variant_id: '637093'
  },
  growthYearly: {
    id: 'growth-yearly',
    name: 'Growth Plan Yearly',
    description: 'Yearly subscription for growth plan',
    price: 2990,
    yearlyPrice: 2990,
    variant_id: '637091'
  },
  professionalMonthly: {
    id: 'professional-monthly',
    name: 'Professional Plan Monthly',
    description: 'Monthly subscription for professional plan',
    price: 666,
    monthlyPrice: 666,
    variant_id: '637094'
  },
  professionalYearly: {
    id: 'professional-yearly',
    name: 'Professional Plan Yearly',
    description: 'Yearly subscription for professional plan',
    price: 7990,
    yearlyPrice: 7990,
    variant_id: '637095'
  },
  starter: {
    id: 'starter-package',
    name: 'Starter Package',
    description: 'Complete automation setup',
    price: 7997,
    variant_id: '637094' // Using professional monthly as starter
  },
  professional: {
    id: 'professional-package',
    name: 'Professional Package',
    description: 'Enterprise automation solution',
    price: 12997,
    variant_id: '637095' // Using professional yearly as professional package
  }
}

// Initialize LemonSqueezy checkout
export const initLemonSqueezyCheckout = (variantId: string, customData?: any) => {
  // LemonSqueezy checkout URL format - use the standard checkout URL
  const checkoutUrl = `https://flowsupportai.lemonsqueezy.com/checkout/buy/${variantId}`

  // Add success and cancel URLs as parameters
  const params = new URLSearchParams({
    success_url: `${typeof window !== 'undefined' ? window.location.origin : 'https://flowsupportai.com'}/payment/success`,
    cancel_url: `${typeof window !== 'undefined' ? window.location.origin : 'https://flowsupportai.com'}/payment/failed`
  })

  // Add custom data if provided
  if (customData) {
    Object.entries(customData).forEach(([key, value]) => {
      params.append(key, String(value))
    })
  }

  return `${checkoutUrl}?${params.toString()}`
}

// Open LemonSqueezy checkout in same window (better conversion)
export const openLemonSqueezyCheckout = (productKey: keyof typeof LEMONSQUEEZY_PRODUCTS) => {
  const product = LEMONSQUEEZY_PRODUCTS[productKey]

  if (!product) {
    console.error('Product not found:', productKey)
    return
  }

  // For free products or contact variant, redirect to contact
  if (product.price === 0 || product.variant_id === 'contact') {
    window.location.href = '/contact'
    return
  }

  // Open LemonSqueezy checkout with actual variant ID
  const checkoutUrl = initLemonSqueezyCheckout(product.variant_id, {
    checkout_data: JSON.stringify({
      custom: {
        product_key: productKey,
        product_name: product.name,
        source: 'pricing_page'
      }
    })
  })

  console.log('Opening LemonSqueezy checkout:', checkoutUrl)
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