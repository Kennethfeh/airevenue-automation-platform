'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Mail, Clock, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { MainNav } from '@/components/navigation/main-nav'
import { MainFooter } from '@/components/footer/main-footer'

function SimpleSuccessContent() {
  const searchParams = useSearchParams()
  const [orderDetails, setOrderDetails] = useState<any>(null)

  useEffect(() => {
    const details = {
      plan: searchParams?.get('plan') || 'Growth',
      billing: searchParams?.get('billing') || 'monthly',
      price: searchParams?.get('price') || '249',
      name: searchParams?.get('name') || 'Customer',
      email: searchParams?.get('email') || '',
      company: searchParams?.get('company') || '',
      order: searchParams?.get('order') || `FS-${Date.now()}`
    }
    setOrderDetails(details)
  }, [searchParams])

  if (!orderDetails) return null

  return (
    <div className="min-h-screen bg-white">
      <MainNav />

      <div className="py-16">
        <div className="container-xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">

            {/* Success Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Order Submitted Successfully! 🎉
              </h1>

              <p className="text-xl text-gray-600 mb-8">
                Thank you {orderDetails.name}! We've received your FlowSupport AI order and our team will contact you shortly.
              </p>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 mb-8">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <Sparkles className="w-6 h-6 text-green-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    {orderDetails.plan} Plan - Order Received
                  </h2>
                </div>
                <p className="text-gray-700 mb-4">
                  Your AI-powered customer service transformation is about to begin! Our team is preparing your custom setup.
                </p>
                <div className="text-sm text-gray-600 space-y-1 bg-white rounded-lg p-4">
                  <p><strong>Order Number:</strong> {orderDetails.order}</p>
                  <p><strong>Plan:</strong> {orderDetails.plan} Plan ({orderDetails.billing})</p>
                  <p><strong>Price:</strong> ${Number(orderDetails.price).toLocaleString()}{orderDetails.billing === 'yearly' ? '/year' : '/month'}</p>
                  <p><strong>Contact Email:</strong> {orderDetails.email}</p>
                  {orderDetails.company && <p><strong>Company:</strong> {orderDetails.company}</p>}
                </div>
              </div>
            </motion.div>

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
                What Happens Next?
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    icon: Clock,
                    title: 'Team Contact (2 Hours)',
                    description: 'Our specialist will email you within 2 business hours with payment details and next steps.',
                    time: '2 hours'
                  },
                  {
                    icon: Mail,
                    title: 'Payment Processing',
                    description: 'We\'ll send a secure payment link via email or schedule a quick call to process payment.',
                    time: '4 hours'
                  },
                  {
                    icon: Sparkles,
                    title: 'AI Setup Begins',
                    description: 'Once payment is complete, your dedicated success manager begins your AI implementation.',
                    time: '24 hours'
                  }
                ].map((step, index) => {
                  const Icon = step.icon
                  return (
                    <motion.div
                      key={step.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * (index + 3) }}
                      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="w-12 h-12 bg-[#FF4A00]/10 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-[#FF4A00]" />
                      </div>

                      <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{step.description}</p>

                      <div className="text-xs text-[#FF4A00] font-medium bg-orange-50 px-2 py-1 rounded">
                        Within {step.time}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* Important Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-blue-50 rounded-xl p-8 text-center mb-12 border border-blue-200"
            >
              <Mail className="w-8 h-8 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Check Your Email
              </h3>
              <p className="text-gray-600 mb-4">
                We've sent a confirmation to <strong>{orderDetails.email}</strong> with your order details.
                Please check your inbox (and spam folder) in the next few minutes.
              </p>
              <div className="text-sm text-gray-500">
                Not seeing our email? Contact us directly at <strong>hello@flowsupportai.com</strong>
              </div>
            </motion.div>

            {/* Support Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Questions About Your Order?
              </h3>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <a
                  href="mailto:hello@flowsupportai.com?subject=Order%20Question%20-%20{orderDetails.order}"
                  className="bg-[#FF4A00] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#FF3A00] transition-colors inline-flex items-center justify-center"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email Support
                </a>

                <Link
                  href="/contact"
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
                >
                  Contact Form
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>

              <div className="text-sm text-gray-500 space-y-1">
                <p>📧 Email: hello@flowsupportai.com</p>
                <p>⚡ Response time: Within 2 business hours</p>
                <p>🌍 Available: Monday-Friday, 9 AM - 6 PM EST</p>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      <MainFooter />
    </div>
  )
}

export default function SimpleSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#FF4A00] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order confirmation...</p>
        </div>
      </div>
    }>
      <SimpleSuccessContent />
    </Suspense>
  )
}