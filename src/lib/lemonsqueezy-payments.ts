'use client'

// LemonSqueezy Embedded Checkout Integration
// Global card payments with embedded overlay - customers stay on your site

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
// Updated with LemonSqueezy buy URLs for embedded checkout
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
    variant_id: 'CONSULTATION_UUID_HERE' // Replace with actual UUID
  },
  growthMonthly: {
    id: 'growth-monthly',
    name: 'Growth Plan Monthly',
    description: 'Monthly subscription for growth plan',
    price: 249,
    monthlyPrice: 249,
    variant_id: 'GROWTH_MONTHLY_UUID_HERE' // Replace with actual UUID
  },
  growthYearly: {
    id: 'growth-yearly',
    name: 'Growth Plan Yearly',
    description: 'Yearly subscription for growth plan',
    price: 2990,
    yearlyPrice: 2990,
    variant_id: '966317ea-4d59-4148-830f-8b2caee06d32' // Your actual UUID
  },
  professionalMonthly: {
    id: 'professional-monthly',
    name: 'Professional Plan Monthly',
    description: 'Monthly subscription for professional plan',
    price: 666,
    monthlyPrice: 666,
    variant_id: 'PROFESSIONAL_MONTHLY_UUID_HERE' // Replace with actual UUID
  },
  professionalYearly: {
    id: 'professional-yearly',
    name: 'Professional Plan Yearly',
    description: 'Yearly subscription for professional plan',
    price: 7990,
    yearlyPrice: 7990,
    variant_id: 'PROFESSIONAL_YEARLY_UUID_HERE' // Replace with actual UUID
  },
  starter: {
    id: 'starter-package',
    name: 'Starter Package',
    description: 'Complete automation setup',
    price: 7997,
    variant_id: 'GROWTH_MONTHLY_UUID_HERE' // Map to growth monthly
  },
  professional: {
    id: 'professional-package',
    name: 'Professional Package',
    description: 'Enterprise automation solution',
    price: 12997,
    variant_id: 'PROFESSIONAL_YEARLY_UUID_HERE' // Map to professional yearly
  }
}

// Load LemonSqueezy script
export const loadLemonSqueezyScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window is not defined'))
      return
    }

    // Check if script is already loaded
    if (document.querySelector('script[src="https://assets.lemonsqueezy.com/lemon.js"]')) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://assets.lemonsqueezy.com/lemon.js'
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load LemonSqueezy script'))

    document.head.appendChild(script)
  })
}

// Open LemonSqueezy embedded checkout overlay
export const openLemonSqueezyCheckout = async (productKey: keyof typeof LEMONSQUEEZY_PRODUCTS) => {
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

  // Check if variant ID is configured
  if (product.variant_id.includes('UUID_HERE')) {
    alert(`Payment for ${product.name} is not yet configured. Please contact hello@flowsupportai.com`)
    return
  }

  try {
    // Load LemonSqueezy script if not already loaded
    await loadLemonSqueezyScript()

    // Create the checkout URL
    const checkoutUrl = `https://flowsupportai.lemonsqueezy.com/buy/${product.variant_id}?embed=1`

    console.log('Opening LemonSqueezy embedded checkout:', checkoutUrl)

    // Open the embedded checkout overlay
    if ((window as any).createLemonSqueezyAffiliate) {
      // Use LemonSqueezy's embedded checkout
      (window as any).LemonSqueezy.Url.Open(checkoutUrl)
    } else {
      // Fallback: create a hidden link and click it (this triggers the overlay)
      const link = document.createElement('a')
      link.href = checkoutUrl
      link.className = 'lemonsqueezy-button'
      link.style.display = 'none'
      link.textContent = `Buy ${product.name}`

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

  } catch (error) {
    console.error('Failed to open LemonSqueezy checkout:', error)
    // Fallback to direct URL
    window.open(`https://flowsupportai.lemonsqueezy.com/buy/${product.variant_id}`, '_blank')
  }
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
    checkoutUrl: `https://flowsupportai.lemonsqueezy.com/buy/${variantId}?embed=1`
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

// Test function - call this from browser console to test URLs
export const testLemonSqueezyUrls = () => {
  console.log('Testing LemonSqueezy URLs:')
  Object.entries(LEMONSQUEEZY_PRODUCTS).forEach(([key, product]) => {
    if (product.variant_id !== 'contact' && !product.variant_id.includes('UUID_HERE')) {
      const url = `https://flowsupportai.lemonsqueezy.com/buy/${product.variant_id}?embed=1`
      console.log(`${key}: ${url}`)
    }
  })
}

// Make it available globally for testing
if (typeof window !== 'undefined') {
  (window as any).testLemonSqueezyUrls = testLemonSqueezyUrls
}