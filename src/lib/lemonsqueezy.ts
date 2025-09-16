'use client'

// LemonSqueezy Payment Integration for FlowSupport AI
// Global payment processing with excellent Korea/Asia support

export const LEMONSQUEEZY_CONFIG = {
  storeId: process.env.NEXT_PUBLIC_LEMONSQUEEZY_STORE_ID || 'your-store-id',
  apiKey: process.env.LEMONSQUEEZY_API_KEY || 'your-api-key',
}

// FlowSupport AI Product Configuration
export const LEMONSQUEEZY_PRODUCTS = {
  growthMonthly: {
    variantId: '1', // Replace with actual LemonSqueezy variant ID
    name: 'Growth Plan',
    price: 249,
    currency: 'USD',
    billing: 'monthly' as const,
    description: 'Save $8,000+ monthly in support costs'
  },
  growthYearly: {
    variantId: '2', // Replace with actual LemonSqueezy variant ID
    name: 'Growth Plan (Yearly)',
    price: 2990,
    currency: 'USD',
    billing: 'yearly' as const,
    description: 'Save $8,000+ monthly in support costs - 20% off yearly'
  },
  professionalMonthly: {
    variantId: '3', // Replace with actual LemonSqueezy variant ID
    name: 'Professional Plan',
    price: 666,
    currency: 'USD',
    billing: 'monthly' as const,
    description: 'Save $15,000+ monthly with advanced automation'
  },
  professionalYearly: {
    variantId: '4', // Replace with actual LemonSqueezy variant ID
    name: 'Professional Plan (Yearly)',
    price: 7990,
    currency: 'USD',
    billing: 'yearly' as const,
    description: 'Save $15,000+ monthly with advanced automation - 20% off yearly'
  }
}

// Open LemonSqueezy checkout
export const openLemonSqueezyCheckout = (variantId: string, productName: string) => {
  try {
    // LemonSqueezy checkout URL format
    const checkoutUrl = `https://flowsupportai.lemonsqueezy.com/checkout/buy/${variantId}?embed=1`

    // Create checkout parameters
    const params = new URLSearchParams({
      'checkout[email]': '',
      'checkout[name]': '',
      'checkout[billing_address][country]': '',
      'checkout[custom][product_name]': productName,
      'checkout[custom][plan_type]': productName.toLowerCase().includes('yearly') ? 'yearly' : 'monthly'
    })

    const fullUrl = `${checkoutUrl}&${params.toString()}`

    // Open in new window for better UX
    const popup = window.open(
      fullUrl,
      'lemonsqueezy-checkout',
      'width=800,height=800,scrollbars=yes,resizable=yes'
    )

    // Listen for checkout completion
    const checkForCompletion = setInterval(() => {
      try {
        if (popup?.closed) {
          clearInterval(checkForCompletion)
          // Redirect to success page
          window.location.href = '/payment/success?provider=lemonsqueezy'
        }
      } catch (error) {
        // Cross-origin error expected, ignore
      }
    }, 1000)

    if (!popup) {
      throw new Error('Popup blocked - please allow popups for payments')
    }

    return popup
  } catch (error) {
    console.error('LemonSqueezy checkout error:', error)
    throw new Error(`Payment checkout failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Get product by key
export const getLemonSqueezyProduct = (productKey: keyof typeof LEMONSQUEEZY_PRODUCTS) => {
  return LEMONSQUEEZY_PRODUCTS[productKey]
}

// Format price for display
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}