'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Play, CheckCircle, Sparkles } from 'lucide-react'
import Link from 'next/link'

export const LandingHero: React.FC = () => {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // This will trigger the AI audit generation
    try {
      const response = await fetch('/api/prospects/capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source: 'hero_cta',
          utm_params: {
            utm_source: 'landing',
            utm_medium: 'hero',
            utm_campaign: 'ai_audit'
          }
        }),
      })

      if (response.ok) {
        setIsSubmitted(true)
        // Redirect to audit form
        window.location.href = `/audit?email=${encodeURIComponent(email)}`
      }
    } catch (error) {
      console.error('Error capturing prospect:', error)
    }
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 dark:bg-primary-800/20"
          animate={{ 
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-200/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 dark:bg-secondary-800/20"
          animate={{ 
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div
          className="absolute top-40 left-40 w-60 h-60 bg-success-200/30 rounded-full mix-blend-multiply filter blur-xl opacity-50 dark:bg-success-800/20"
          animate={{ 
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>

      <div className="container-xl relative z-10">
        <motion.div
          className="text-center max-w-5xl mx-auto"
          variants={staggerChildren}
          initial="initial"
          animate="animate"
        >
          {/* Badge */}
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center space-x-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-primary-200/50 dark:border-primary-800/50 shadow-lg"
          >
            <Sparkles className="w-5 h-5 text-primary-600" />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Trusted by 500+ businesses • SOC 2 Certified
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={fadeInUp}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight max-w-6xl mx-auto"
          >
            Cut Customer Service Costs by{' '}
            <span className="text-gradient-primary">
              60%
            </span>{' '}
            While Improving Response Times to{' '}
            <span className="text-gradient-primary">
              Under 30 Seconds
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeInUp}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed"
          >
            AI-powered automation handles routine inquiries instantly, freeing your team for complex issues that drive revenue.
            <strong className="text-primary-600 dark:text-primary-400"> Most clients save $12,000+ monthly.</strong>
          </motion.p>

          {/* Value Props */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap items-center justify-center gap-6 mb-12 text-sm md:text-base"
          >
            {[
              '24/7 automated customer support',
              'Handles 80% of inquiries instantly',
              'Reduces response time to 30 seconds',
              'Integrates with your existing systems'
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                <CheckCircle className="w-5 h-5 text-success-500" />
                <span>{item}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Form */}
          <motion.div
            variants={fadeInUp}
            className="max-w-2xl mx-auto"
          >
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 p-2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your work email to calculate savings"
                  className="flex-1 px-6 py-4 text-lg bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  required
                />
                <button
                  type="submit"
                  className="btn btn-primary btn-lg px-8 py-4 text-lg font-semibold rounded-xl hover-lift focus-ring whitespace-nowrap"
                >
                  Get My Free Savings Calculator
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </form>
            ) : (
              <div className="p-8 bg-success-50 dark:bg-success-900/20 rounded-2xl border border-success-200 dark:border-success-800">
                <CheckCircle className="w-12 h-12 text-success-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-success-800 dark:text-success-200 mb-2">
                  Analysis Request Submitted!
                </h3>
                <p className="text-success-600 dark:text-success-300">
                  We're calculating your potential cost savings. Check your email in 2 minutes.
                </p>
              </div>
            )}

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              🔒 No spam, ever. Free detailed analysis of your cost saving opportunities.
            </p>
          </motion.div>

          {/* Demo Video CTA */}
          <motion.div
            variants={fadeInUp}
            className="mt-12"
          >
            <button className="group flex items-center space-x-3 mx-auto text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
              <div className="flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full group-hover:bg-primary-200 dark:group-hover:bg-primary-900/50 transition-colors">
                <Play className="w-5 h-5 ml-1" />
              </div>
              <span className="text-lg font-medium">Watch 2-min demo: How businesses save $8K+/month</span>
            </button>
          </motion.div>

          {/* Trust Stats */}
          <motion.div
            variants={fadeInUp}
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <div className="text-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/20 dark:border-gray-700/20">
              <div className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400">Trusted by 500+ businesses</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">From startups to Fortune 500</div>
            </div>
            <div className="text-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/20 dark:border-gray-700/20">
              <div className="text-2xl md:text-3xl font-bold text-success-600 dark:text-success-400">Average savings: $12,000/month</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">Verified ROI across all clients</div>
            </div>
            <div className="text-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/20 dark:border-gray-700/20">
              <div className="text-2xl md:text-3xl font-bold text-warning-600 dark:text-warning-400">Setup in 24 hours</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">Full implementation guarantee</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full flex justify-center">
          <div className="w-1 h-2 bg-gray-400 dark:bg-gray-600 rounded-full mt-2"></div>
        </div>
      </motion.div>
    </div>
  )
}