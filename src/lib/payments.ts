'use client'

// Unified Payment System for FlowSupport AI
// Supports multiple payment providers for maximum global coverage

import { openLemonSqueezyCheckout, getLemonSqueezyProduct, LEMONSQUEEZY_PRODUCTS } from './lemonsqueezy-payments'
import { createPayPalSubscription, getPayPalProduct, PAYPAL_PRODUCTS } from './paypal'
import { openSimpleCheckoutModal } from './simple-checkout'

export type PaymentProvider = 'lemonsqueezy' | 'paypal'
export type ProductKey = keyof typeof LEMONSQUEEZY_PRODUCTS

// Payment configuration
export const PAYMENT_CONFIG = {
  preferredProvider: 'lemonsqueezy' as PaymentProvider,
  fallbackProvider: 'paypal' as PaymentProvider,
  enabledProviders: ['lemonsqueezy', 'paypal'] as PaymentProvider[]
}

// Plan configuration
export const PLANS = {
  growth: {
    name: 'Growth',
    monthlyPrice: 249,
    yearlyPrice: 2990,
    description: 'Save $8,000+ monthly in support costs',
    features: [
      'Up to 5,000 inquiries/month',
      'AI automation with GPT-4',
      'Multi-channel integration',
      'Real-time analytics dashboard',
      'Knowledge base & training',
      'Standard integrations included',
      '24/7 AI support',
      'Setup & onboarding included'
    ],
    popular: false,
    setupFee: 2500,
    savings: '$8,000+'
  },
  professional: {
    name: 'Professional',
    monthlyPrice: 666,
    yearlyPrice: 7990,
    description: 'Save $15,000+ monthly with advanced automation',
    features: [
      'Up to 15,000 inquiries/month',
      'Advanced AI with custom training',
      'All channels (email, chat, phone, social)',
      'Advanced analytics & insights',
      'All CRM & help desk integrations',
      'Priority support & success manager',
      'Team collaboration tools',
      'Custom workflows & automation'
    ],
    popular: true,
    setupFee: 3500,
    savings: '$15,000+'
  },
  enterprise: {
    name: 'Enterprise',
    monthlyPrice: 'Custom',
    yearlyPrice: 'Custom',
    description: 'Save $25,000+ monthly with unlimited scale',
    features: [
      'Unlimited inquiries',
      'Custom AI model development',
      'Advanced security & compliance',
      'Dedicated success team',
      'Unlimited custom integrations',
      'Performance SLA guarantees',
      'Advanced reporting & analytics',
      'API access & white-labeling',
      'Custom contract terms'
    ],
    popular: false,
    setupFee: 'Custom',
    savings: '$25,000+'
  }
}

// Checkout options
export interface CheckoutOptions {
  planName: 'growth' | 'professional' | 'enterprise'
  billing: 'monthly' | 'yearly'
  provider?: PaymentProvider
  customerInfo?: {
    email?: string
    name?: string
  }
}

// Main checkout function
export const processCheckout = async (options: CheckoutOptions): Promise<void> => {
  try {
    console.log('Starting checkout process:', options)

    // Handle enterprise plan
    if (options.planName === 'enterprise') {
      window.location.href = '/contact'
      return
    }

    // Determine product key
    const productKey = `${options.planName}${options.billing === 'yearly' ? 'Yearly' : 'Monthly'}` as ProductKey

    // Try preferred provider first
    const provider = options.provider || PAYMENT_CONFIG.preferredProvider

    if (provider === 'lemonsqueezy') {
      await processLemonSqueezyCheckout(productKey)
    } else if (provider === 'paypal') {
      await processPayPalCheckout(productKey)
    } else {
      throw new Error(`Unsupported payment provider: ${provider}`)
    }

  } catch (error) {
    console.error('Checkout process failed:', error)

    // Try fallback provider if primary fails
    if (!options.provider && PAYMENT_CONFIG.fallbackProvider !== PAYMENT_CONFIG.preferredProvider) {
      console.log('Trying fallback provider:', PAYMENT_CONFIG.fallbackProvider)

      try {
        await processCheckout({
          ...options,
          provider: PAYMENT_CONFIG.fallbackProvider
        })
        return
      } catch (fallbackError) {
        console.error('Fallback provider also failed:', fallbackError)
      }
    }

    // If all fails, use simple checkout system
    console.log('All payment providers failed, using simple checkout')

    const plan = PLANS[options.planName]
    const price = options.billing === 'yearly'
      ? (typeof plan.yearlyPrice === 'number' ? plan.yearlyPrice : 0)
      : (typeof plan.monthlyPrice === 'number' ? plan.monthlyPrice : 0)

    if (price > 0) {
      openSimpleCheckoutModal(plan.name, options.billing, price)
      return
    } else {
      alert(`We're experiencing payment system issues. Please contact us at hello@flowsupportai.com or try again in a few minutes.`)
      throw error
    }
  }
}

// LemonSqueezy checkout
const processLemonSqueezyCheckout = async (productKey: ProductKey): Promise<void> => {
  // Map our plan keys to LemonSqueezy product keys
  const lemonSqueezyKey = mapToLemonSqueezyKey(productKey)
  openLemonSqueezyCheckout(lemonSqueezyKey)
}

// Map our internal product keys to LemonSqueezy keys
const mapToLemonSqueezyKey = (productKey: ProductKey): keyof typeof LEMONSQUEEZY_PRODUCTS => {
  // Map from our internal keys to LemonSqueezy keys with billing cycle
  if (productKey === 'growthMonthly') return 'growthMonthly'
  if (productKey === 'growthYearly') return 'growthYearly'
  if (productKey === 'professionalMonthly') return 'professionalMonthly'
  if (productKey === 'professionalYearly') return 'professionalYearly'
  if (productKey.includes('consultation')) return 'consultation'

  // Fallbacks for legacy keys
  if (productKey.includes('growth')) return 'growthMonthly'
  if (productKey.includes('professional')) return 'professionalMonthly'
  return 'growthMonthly' // fallback
}

// Map our internal product keys to PayPal keys
const mapToPayPalKey = (productKey: ProductKey): string => {
  // Map from our internal keys to PayPal keys
  if (productKey.includes('growth')) return 'growthMonthly'
  if (productKey.includes('professional')) return 'professionalMonthly'
  return 'growthMonthly' // fallback
}

// PayPal checkout
const processPayPalCheckout = async (productKey: ProductKey): Promise<void> => {
  // Map to PayPal product key
  const paypalKey = mapToPayPalKey(productKey)
  const product = getPayPalProduct(paypalKey as any)
  if (!product) {
    throw new Error(`PayPal product not found: ${productKey}`)
  }

  // Create PayPal button container
  const containerId = 'paypal-button-container'
  let container = document.getElementById(containerId)

  if (!container) {
    container = document.createElement('div')
    container.id = containerId
    container.style.position = 'fixed'
    container.style.top = '50%'
    container.style.left = '50%'
    container.style.transform = 'translate(-50%, -50%)'
    container.style.zIndex = '10000'
    container.style.backgroundColor = 'white'
    container.style.padding = '20px'
    container.style.borderRadius = '8px'
    container.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)'
    document.body.appendChild(container)
  }

  const paypalButtons = await createPayPalSubscription(product.planId)
  paypalButtons.render(`#${containerId}`)
}

// Format price for display
export const formatPrice = (price: number | string): string => {
  if (typeof price === 'string') return price

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// Get plan information
export const getPlan = (planName: keyof typeof PLANS) => {
  return PLANS[planName]
}