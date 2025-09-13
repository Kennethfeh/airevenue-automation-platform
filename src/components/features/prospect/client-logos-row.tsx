'use client'

import React from 'react'
import { motion } from 'framer-motion'

export const ClientLogosRow: React.FC = () => {
  const logos = [
    { 
      name: 'Shopify', 
      width: 120,
      svg: (
        <svg viewBox="0 0 120 40" className="w-full h-8">
          <text x="60" y="25" textAnchor="middle" className="fill-current font-bold text-lg">Shopify</text>
        </svg>
      )
    },
    { 
      name: 'Stripe', 
      width: 100,
      svg: (
        <svg viewBox="0 0 100 40" className="w-full h-8">
          <text x="50" y="25" textAnchor="middle" className="fill-current font-bold text-lg">Stripe</text>
        </svg>
      )
    },
    { 
      name: 'Zendesk', 
      width: 120,
      svg: (
        <svg viewBox="0 0 120 40" className="w-full h-8">
          <text x="60" y="25" textAnchor="middle" className="fill-current font-bold text-lg">Zendesk</text>
        </svg>
      )
    },
    { 
      name: 'Salesforce', 
      width: 130,
      svg: (
        <svg viewBox="0 0 130 40" className="w-full h-8">
          <text x="65" y="25" textAnchor="middle" className="fill-current font-bold text-lg">Salesforce</text>
        </svg>
      )
    },
    { 
      name: 'Intercom', 
      width: 110,
      svg: (
        <svg viewBox="0 0 110 40" className="w-full h-8">
          <text x="55" y="25" textAnchor="middle" className="fill-current font-bold text-lg">Intercom</text>
        </svg>
      )
    },
    { 
      name: 'HubSpot', 
      width: 110,
      svg: (
        <svg viewBox="0 0 110 40" className="w-full h-8">
          <text x="55" y="25" textAnchor="middle" className="fill-current font-bold text-lg">HubSpot</text>
        </svg>
      )
    },
    { 
      name: 'Slack', 
      width: 90,
      svg: (
        <svg viewBox="0 0 90 40" className="w-full h-8">
          <text x="45" y="25" textAnchor="middle" className="fill-current font-bold text-lg">Slack</text>
        </svg>
      )
    },
    { 
      name: 'Microsoft', 
      width: 120,
      svg: (
        <svg viewBox="0 0 120 40" className="w-full h-8">
          <text x="60" y="25" textAnchor="middle" className="fill-current font-bold text-lg">Microsoft</text>
        </svg>
      )
    }
  ]

  return (
    <section className="py-16 bg-[#F7FAFC] border-b border-gray-100">
      <div className="container-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h3 className="text-gray-600 font-semibold text-lg mb-8">Trusted by leading companies</h3>
        </motion.div>

        {/* Logo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center mb-12">
          {logos.map((logo, index) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex items-center justify-center h-12 opacity-60 hover:opacity-100 transition-all duration-300 cursor-pointer grayscale hover:grayscale-0"
              style={{ width: logo.width }}
            >
              <div className="text-gray-600 hover:text-[#FF4A00] transition-colors">
                {logo.svg}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Join <span className="font-bold text-[#FF4A00]">500+ growing businesses</span> that automated their customer service 
            and now save an average of <span className="font-bold text-green-600">$8,000+ every month</span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}