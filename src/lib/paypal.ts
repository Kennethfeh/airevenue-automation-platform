'use client'

// PayPal Integration for FlowSupport AI
// Backup payment option with global coverage

export const PAYPAL_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'your-paypal-client-id',
  environment: 'production' as const, // or 'sandbox' for testing
}

// PayPal Product Configuration
export const PAYPAL_PRODUCTS = {
  growthMonthly: {
    planId: 'P-1', // Replace with actual PayPal plan ID
    name: 'Growth Plan',
    price: '249.00',
    currency: 'USD',
    billing: 'monthly' as const,
    description: 'FlowSupport AI Growth Plan - Monthly'
  },
  growthYearly: {
    planId: 'P-2', // Replace with actual PayPal plan ID
    name: 'Growth Plan (Yearly)',
    price: '2990.00',
    currency: 'USD',
    billing: 'yearly' as const,
    description: 'FlowSupport AI Growth Plan - Yearly (20% off)'
  },
  professionalMonthly: {
    planId: 'P-3', // Replace with actual PayPal plan ID
    name: 'Professional Plan',
    price: '666.00',
    currency: 'USD',
    billing: 'monthly' as const,
    description: 'FlowSupport AI Professional Plan - Monthly'
  },
  professionalYearly: {
    planId: 'P-4', // Replace with actual PayPal plan ID
    name: 'Professional Plan (Yearly)',
    price: '7990.00',
    currency: 'USD',
    billing: 'yearly' as const,
    description: 'FlowSupport AI Professional Plan - Yearly (20% off)'
  }
}

// Initialize PayPal
export const initializePayPal = () => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('PayPal can only be initialized in browser'))
      return
    }

    // Check if PayPal script is already loaded
    if ((window as any).paypal) {
      resolve((window as any).paypal)
      return
    }

    // Load PayPal script
    const script = document.createElement('script')
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CONFIG.clientId}&vault=true&intent=subscription`
    script.onload = () => resolve((window as any).paypal)
    script.onerror = () => reject(new Error('Failed to load PayPal SDK'))
    document.head.appendChild(script)
  })
}

// Create PayPal subscription
export const createPayPalSubscription = async (planId: string) => {
  try {
    const paypal = await initializePayPal() as any

    return paypal.Buttons({
      style: {
        shape: 'rect',
        color: 'blue',
        layout: 'vertical',
        label: 'subscribe'
      },
      createSubscription: function(data: any, actions: any) {
        return actions.subscription.create({
          'plan_id': planId,
          'application_context': {
            'brand_name': 'FlowSupport AI',
            'locale': 'en-US',
            'shipping_preference': 'NO_SHIPPING',
            'user_action': 'SUBSCRIBE_NOW',
            'payment_method': {
              'payer_selected': 'PAYPAL',
              'payee_preferred': 'IMMEDIATE_PAYMENT_REQUIRED'
            },
            'return_url': `${window.location.origin}/payment/success?provider=paypal`,
            'cancel_url': `${window.location.origin}/payment/failed?provider=paypal`
          }
        })
      },
      onApprove: function(data: any, actions: any) {
        console.log('PayPal subscription approved:', data.subscriptionID)
        // Redirect to success page
        window.location.href = `/payment/success?provider=paypal&subscription_id=${data.subscriptionID}`
      },
      onError: function(err: any) {
        console.error('PayPal subscription error:', err)
        window.location.href = '/payment/failed?provider=paypal'
      },
      onCancel: function(data: any) {
        console.log('PayPal subscription cancelled:', data)
        // User cancelled, do nothing or show message
      }
    })
  } catch (error) {
    console.error('PayPal initialization error:', error)
    throw new Error(`PayPal setup failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Get PayPal product by key
export const getPayPalProduct = (productKey: keyof typeof PAYPAL_PRODUCTS) => {
  return PAYPAL_PRODUCTS[productKey]
}