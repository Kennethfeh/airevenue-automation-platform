'use client'

import React, { Suspense } from 'react'
import { motion } from 'framer-motion'
import { XCircle, RefreshCw, MessageCircle, ArrowLeft, CreditCard } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { MainNav } from '@/components/navigation/main-nav'
import { MainFooter } from '@/components/footer/main-footer'
import { openSimpleCheckoutModal } from '@/lib/simple-checkout'

function PaymentFailedContent() {
  const searchParams = useSearchParams()
  const planName = searchParams?.get('plan') || 'Plan'
  const error = searchParams?.get('error') || 'Payment could not be processed'

  const commonReasons = [
    {
      title: 'Card Declined',
      description: 'Your bank declined the transaction. Try a different payment method.',
      solution: 'Contact your bank or try another card'
    },
    {
      title: 'Insufficient Funds',
      description: 'Your account doesn\'t have enough funds for this purchase.',
      solution: 'Add funds to your account or use a different card'
    },
    {
      title: 'Expired Card',
      description: 'The payment card has expired.',
      solution: 'Update your card details and try again'
    },
    {
      title: 'Security Check',
      description: 'Your bank flagged this as a suspicious transaction.',
      solution: 'Contact your bank to approve the transaction'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <MainNav />
      
      <div className="py-16">
        <div className="container-xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            
            {/* Failed Header */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Payment Failed
              </h1>
              
              <p className="text-xl text-gray-600 mb-8">
                We couldn't process your payment. Don't worry, you haven't been charged.
              </p>

              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {planName}
                </h2>
                <p className="text-gray-700 mb-4">We're here to help you complete your order</p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                <p className="text-red-800 font-medium">Error: {error}</p>
              </div>
            </motion.div>

            {/* Retry Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Try Again
              </h2>

              <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-md mx-auto">
                <CreditCard className="w-12 h-12 text-[#FF4A00] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Try Payment Again
                </h3>
                <button
                  onClick={() => window.location.href = '/pricing'}
                  className="w-full bg-gradient-to-r from-[#FF4A00] to-[#FF6B1A] text-white px-8 py-4 text-lg font-semibold rounded-lg hover:shadow-lg transition-all inline-flex items-center justify-center"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Payment Again
                </button>
              </div>
            </motion.div>

            {/* Common Reasons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
                Common Reasons & Solutions
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {commonReasons.map((reason, index) => (
                  <motion.div
                    key={reason.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * (index + 5) }}
                    className="bg-white rounded-xl border border-gray-200 p-6"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">{reason.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{reason.description}</p>
                    <div className="text-[#FF4A00] text-sm font-medium">
                      💡 {reason.solution}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Alternative Options */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gray-50 rounded-xl p-8 text-center mb-12"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Need an Alternative?
              </h3>
              <p className="text-gray-600 mb-6">
                If you continue having payment issues, we're here to help with alternative options.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/contact"
                  className="bg-[#FF4A00] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#FF3A00] transition-colors inline-flex items-center"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Sales Team
                </Link>
                
                <Link
                  href="/contact"
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center"
                >
                  Start with Free Analysis
                </Link>
              </div>
            </motion.div>

            {/* Support Information */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-center mb-12"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Payment Support
              </h3>
              
              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <MessageCircle className="w-8 h-8 text-[#FF4A00] mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Live Chat</h4>
                  <p className="text-gray-600">Available 24/7 for payment assistance</p>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <CreditCard className="w-8 h-8 text-[#FF4A00] mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Fast Response</h4>
                  <p className="text-gray-600">We respond within 2 hours</p>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <MessageCircle className="w-8 h-8 text-[#FF4A00] mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Email</h4>
                  <p className="text-gray-600">hello@flowsupportai.com</p>
                </div>
              </div>
            </motion.div>

            {/* Back to Site */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="text-center"
            >
              <Link 
                href="/"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Homepage
              </Link>
            </motion.div>

          </div>
        </div>
      </div>

      <MainFooter />
    </div>
  )
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment status...</p>
        </div>
      </div>
    }>
      <PaymentFailedContent />
    </Suspense>
  )
}