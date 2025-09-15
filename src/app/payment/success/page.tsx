'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Download, Calendar, Mail, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { MainNav } from '@/components/navigation/main-nav'
import { MainFooter } from '@/components/footer/main-footer'
import { getProduct, PRODUCTS } from '@/lib/paddle'

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const productKey = searchParams?.get('product') as keyof typeof PRODUCTS | null
  const [customerInfo, setCustomerInfo] = useState<any>(null)

  const product = productKey ? getProduct(productKey) : null

  useEffect(() => {
    // You can fetch customer/order details here if needed
    // For now, we'll use mock data or URL parameters
    const mockCustomerInfo = {
      email: 'customer@example.com',
      orderNumber: 'ORD-' + Date.now(),
      transactionId: 'TXN-' + Math.random().toString(36).substring(7).toUpperCase()
    }
    setCustomerInfo(mockCustomerInfo)
  }, [])

  const getNextSteps = () => {
    if (!productKey) return []

    switch (productKey) {
      case 'freeAnalysis':
        return [
          {
            icon: Calendar,
            title: 'Schedule Your Analysis Call',
            description: 'Book a 30-minute call to discuss your automation needs',
            action: 'Schedule Now',
            url: '/book-demo'
          },
          {
            icon: Download,
            title: 'Download Preparation Guide',
            description: 'Get ready for your analysis with our preparation checklist',
            action: 'Download Guide',
            url: '/downloads/analysis-prep-guide.pdf'
          }
        ]
      
      case 'consultation':
        return [
          {
            icon: Calendar,
            title: 'Schedule Your Strategy Session',
            description: 'Book your 1-on-1 consultation with our automation expert',
            action: 'Schedule Session',
            url: '/book-demo'
          },
          {
            icon: Download,
            title: 'Pre-Consultation Worksheet',
            description: 'Complete this worksheet to maximize your session value',
            action: 'Download Worksheet',
            url: '/downloads/consultation-worksheet.pdf'
          }
        ]
      
      case 'starter':
      case 'professional':
        return [
          {
            icon: Calendar,
            title: 'Onboarding Call Scheduled',
            description: 'Our team will contact you within 24 hours to begin setup',
            action: 'View Calendar',
            url: '/dashboard'
          },
          {
            icon: Download,
            title: 'Welcome Package',
            description: 'Access your complete automation implementation guide',
            action: 'Access Dashboard',
            url: '/dashboard'
          },
          {
            icon: Mail,
            title: 'Dedicated Success Manager',
            description: 'Meet your assigned automation specialist',
            action: 'Contact Team',
            url: '/contact'
          }
        ]
      
      default:
        return []
    }
  }

  const nextSteps = getNextSteps()

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
                Payment Successful! 🎉
              </h1>
              
              <p className="text-xl text-gray-600 mb-8">
                Thank you for choosing AI Revenue Automation Platform. Your order has been confirmed.
              </p>

              {product && (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 mb-8">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <Sparkles className="w-6 h-6 text-green-600" />
                    <h2 className="text-2xl font-bold text-gray-900">
                      {product.name} - Confirmed
                    </h2>
                  </div>
                  <p className="text-gray-700 mb-4">{product.description}</p>
                  {customerInfo && (
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Order Number:</strong> {customerInfo.orderNumber}</p>
                      <p><strong>Transaction ID:</strong> {customerInfo.transactionId}</p>
                      <p><strong>Email:</strong> {customerInfo.email}</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            {/* Next Steps */}
            {nextSteps.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-12"
              >
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
                  What Happens Next?
                </h2>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {nextSteps.map((step, index) => {
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
                        
                        <Link 
                          href={step.url}
                          className="inline-flex items-center text-[#FF4A00] hover:text-[#FF3A00] font-medium text-sm"
                        >
                          {step.action}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* Email Confirmation */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-50 rounded-xl p-8 text-center mb-12"
            >
              <Mail className="w-8 h-8 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Confirmation Email Sent
              </h3>
              <p className="text-gray-600 mb-4">
                A detailed receipt and next steps have been sent to your email address.
                Please check your inbox (and spam folder) for important information.
              </p>
              <div className="text-sm text-gray-500">
                Didn't receive an email? Contact us at <strong>hello@airevenue.com</strong>
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
                Need Help or Have Questions?
              </h3>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/contact"
                  className="bg-[#FF4A00] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#FF3A00] transition-colors"
                >
                  Contact Support
                </Link>
                
                <Link 
                  href="/case-studies"
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  View Success Stories
                </Link>
              </div>

              <div className="mt-6 text-sm text-gray-500">
                <p>📞 Phone: +1 (555) 123-4567</p>
                <p>💬 Live chat available 24/7 on our website</p>
                <p>📧 Email: support@airevenue.com</p>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      <MainFooter />
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#FF4A00] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment confirmation...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}