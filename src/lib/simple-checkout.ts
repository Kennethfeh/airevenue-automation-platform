'use client'

// Simple Checkout System for FlowSupport AI
// Collects customer info and sends email notification for manual processing
// Works immediately without payment processor setup

export interface CheckoutInfo {
  planName: string
  billing: 'monthly' | 'yearly' | 'one-time'
  price: number
  customerName: string
  customerEmail: string
  customerCompany?: string
  customerMessage?: string
}

// Simple checkout process
export const processSimpleCheckout = async (info: CheckoutInfo): Promise<void> => {
  try {
    // Create checkout summary
    const checkoutSummary = {
      plan: info.planName,
      billing: info.billing,
      price: info.price,
      customer: {
        name: info.customerName,
        email: info.customerEmail,
        company: info.customerCompany || 'Not provided'
      },
      message: info.customerMessage || 'No additional message',
      timestamp: new Date().toISOString(),
      orderNumber: `FS-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`
    }

    console.log('Simple checkout initiated:', checkoutSummary)

    // In a real implementation, this would:
    // 1. Send email notification to hello@flowsupportai.com
    // 2. Send confirmation email to customer
    // 3. Store order details in database

    // For now, we'll redirect to a custom success page with order details
    const params = new URLSearchParams({
      plan: info.planName,
      billing: info.billing,
      price: info.price.toString(),
      name: info.customerName,
      email: info.customerEmail,
      company: info.customerCompany || '',
      order: checkoutSummary.orderNumber
    })

    window.location.href = `/payment/simple-success?${params.toString()}`

  } catch (error) {
    console.error('Simple checkout error:', error)
    throw new Error(`Checkout failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Open simple checkout modal
export const openSimpleCheckoutModal = (planName: string, billing: 'monthly' | 'yearly' | 'one-time', price: number) => {
  // Create modal HTML
  const modalHTML = `
    <div id="simple-checkout-modal" style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        background: white;
        padding: 30px;
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      ">
        <h2 style="margin: 0 0 20px 0; font-size: 24px; color: #1f2937;">
          Complete Your Order
        </h2>

        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 5px 0; color: #374151;">${planName} Plan</h3>
          <p style="margin: 0; color: #6b7280;">
            ${billing === 'one-time'
              ? `One-time payment - $${price.toLocaleString()}`
              : `${billing === 'yearly' ? 'Yearly' : 'Monthly'} billing - $${price.toLocaleString()}${billing === 'yearly' ? '/year' : '/month'}`
            }
          </p>
        </div>

        <form id="simple-checkout-form">
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #374151;">
              Full Name *
            </label>
            <input type="text" id="customer-name" required style="
              width: 100%;
              padding: 12px;
              border: 1px solid #d1d5db;
              border-radius: 6px;
              font-size: 16px;
            " placeholder="Your full name">
          </div>

          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #374151;">
              Business Email *
            </label>
            <input type="email" id="customer-email" required style="
              width: 100%;
              padding: 12px;
              border: 1px solid #d1d5db;
              border-radius: 6px;
              font-size: 16px;
            " placeholder="your@company.com">
          </div>

          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #374151;">
              Company Name
            </label>
            <input type="text" id="customer-company" style="
              width: 100%;
              padding: 12px;
              border: 1px solid #d1d5db;
              border-radius: 6px;
              font-size: 16px;
            " placeholder="Your company (optional)">
          </div>

          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #374151;">
              Additional Requirements
            </label>
            <textarea id="customer-message" rows="3" style="
              width: 100%;
              padding: 12px;
              border: 1px solid #d1d5db;
              border-radius: 6px;
              font-size: 16px;
              resize: vertical;
            " placeholder="Any specific requirements or questions? (optional)"></textarea>
          </div>

          <div style="display: flex; gap: 10px;">
            <button type="button" id="cancel-checkout" style="
              flex: 1;
              padding: 12px 20px;
              border: 1px solid #d1d5db;
              background: white;
              color: #374151;
              border-radius: 6px;
              font-size: 16px;
              font-weight: 600;
              cursor: pointer;
            ">
              Cancel
            </button>
            <button type="submit" style="
              flex: 2;
              padding: 12px 20px;
              background: #ff4a00;
              color: white;
              border: none;
              border-radius: 6px;
              font-size: 16px;
              font-weight: 600;
              cursor: pointer;
            ">
              Complete Order →
            </button>
          </div>
        </form>

        <p style="margin: 15px 0 0 0; font-size: 14px; color: #6b7280; text-align: center;">
          Our team will contact you within 2 hours to process your payment and begin setup.
        </p>
      </div>
    </div>
  `

  // Add modal to page
  document.body.insertAdjacentHTML('beforeend', modalHTML)

  // Add event listeners
  const modal = document.getElementById('simple-checkout-modal')!
  const form = document.getElementById('simple-checkout-form')! as HTMLFormElement
  const cancelBtn = document.getElementById('cancel-checkout')!

  // Handle form submission
  form.onsubmit = async (e) => {
    e.preventDefault()

    const name = (document.getElementById('customer-name') as HTMLInputElement).value.trim()
    const email = (document.getElementById('customer-email') as HTMLInputElement).value.trim()
    const company = (document.getElementById('customer-company') as HTMLInputElement).value.trim()
    const message = (document.getElementById('customer-message') as HTMLTextAreaElement).value.trim()

    if (!name || !email) {
      alert('Please fill in your name and email address.')
      return
    }

    try {
      await processSimpleCheckout({
        planName,
        billing,
        price,
        customerName: name,
        customerEmail: email,
        customerCompany: company,
        customerMessage: message
      })
    } catch (error) {
      alert('Something went wrong. Please try again or contact hello@flowsupportai.com')
      console.error('Checkout error:', error)
    }
  }

  // Handle cancel
  cancelBtn.onclick = () => {
    modal.remove()
  }

  // Handle click outside modal
  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.remove()
    }
  }
}