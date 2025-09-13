'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Clock, Headphones, CheckCircle } from 'lucide-react'

export const TrustIndicators: React.FC = () => {
  const indicators = [
    {
      icon: Shield,
      title: 'SOC 2 Certified',
      description: 'Enterprise security standards'
    },
    {
      icon: CheckCircle,
      title: 'GDPR Compliant',
      description: 'Data protection certified'
    },
    {
      icon: Clock,
      title: '99.9% Uptime',
      description: 'Guaranteed reliability'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Always here to help'
    }
  ]

  return (
    <section className="py-8 bg-gray-50 border-y border-gray-200">
      <div className="container-xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {indicators.map((indicator, index) => {
            const Icon = indicator.icon
            return (
              <motion.div
                key={indicator.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center space-x-3 text-center md:text-left"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{indicator.title}</div>
                  <div className="text-xs text-gray-600">{indicator.description}</div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}