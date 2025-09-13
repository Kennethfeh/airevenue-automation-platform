'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, CheckCircle, Gift, TrendingUp, Zap, Users } from 'lucide-react'

export const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    // Here you would typically send the email to your backend
    console.log('Newsletter signup:', email)
    setIsSubmitted(true)
  }

  const benefits = [
    {
      icon: TrendingUp,
      text: 'Weekly automation insights & case studies'
    },
    {
      icon: Zap,
      text: 'Early access to new features & tools'
    },
    {
      icon: Users,
      text: 'Exclusive webinars with automation experts'
    },
    {
      icon: Gift,
      text: 'Free automation assessment template'
    }
  ]

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 text-center"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome aboard! 🎉</h3>
        <p className="text-gray-600 mb-4">
          You're now subscribed to our automation insights newsletter. 
          Check your email for a special welcome gift!
        </p>
        <div className="bg-white rounded-lg p-4 border border-green-200">
          <p className="text-sm text-gray-600">
            <strong>What's next?</strong> You'll receive your first newsletter this week with:
          </p>
          <ul className="text-sm text-gray-600 mt-2 space-y-1">
            <li>• Free automation assessment template</li>
            <li>• Case study: How TechCorp saved $2.4M annually</li>
            <li>• Invitation to our next live webinar</li>
          </ul>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-[#FF4A00] to-[#FF6B1A] rounded-2xl p-8 text-white relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4 w-20 h-20 border border-white rounded-full"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 border border-white rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white rounded-full"></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Join 10,000+ Business Leaders</h3>
            <p className="opacity-90">Get weekly automation insights that actually work</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <motion.div
                key={benefit.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3"
              >
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm">{benefit.text}</span>
              </motion.div>
            )
          })}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="flex-1 px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <button
            type="submit"
            className="bg-white text-[#FF4A00] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap"
          >
            Get Free Insights
          </button>
        </form>

        <p className="text-xs opacity-75 mt-4">
          No spam, ever. Unsubscribe with one click. We respect your privacy.
        </p>
      </div>
    </motion.div>
  )
}