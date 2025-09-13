'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Clock, Zap, MessageSquare, TrendingUp, Shield, Users, BarChart3, CheckCircle } from 'lucide-react'

export const KeyFeaturesGrid: React.FC = () => {
  const features = [
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Never miss a customer inquiry, even outside business hours",
      metric: "100% Uptime",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Zap,
      title: "80% Automation Rate",
      description: "AI handles most inquiries without human intervention",
      metric: "80% Automated",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: MessageSquare,
      title: "30-Second Response Time",
      description: "Lightning-fast responses that keep customers happy",
      metric: "< 30 Seconds",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Users,
      title: "Multi-Channel Support",
      description: "Email, chat, social media, and phone - all in one platform",
      metric: "6+ Channels",
      color: "from-orange-500 to-orange-600"
    }
  ]

  const comparison = [
    {
      feature: "Response Time",
      manual: "2-24 hours",
      ai: "< 30 seconds",
      improvement: "48x faster"
    },
    {
      feature: "Availability", 
      manual: "9-5 weekdays",
      ai: "24/7/365",
      improvement: "Always on"
    },
    {
      feature: "Cost per ticket",
      manual: "$15-25",
      ai: "$2-4",
      improvement: "85% savings"
    },
    {
      feature: "Consistency",
      manual: "Varies by agent",
      ai: "Perfect every time",
      improvement: "100% consistent"
    },
    {
      feature: "Scalability",
      manual: "Hire more staff",
      ai: "Instant scaling",
      improvement: "Unlimited"
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container-xl">
        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Leading Companies Choose Our Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the power of AI-driven customer service automation
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
                <div className={`inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r ${feature.color} text-white text-sm font-semibold`}>
                  {feature.metric}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* AI vs Manual Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">AI vs Manual Support</h3>
            <p className="text-gray-600">See the dramatic difference automation makes</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 text-gray-700 font-semibold">Feature</th>
                  <th className="text-center py-4 px-6 text-gray-700 font-semibold">Manual Support</th>
                  <th className="text-center py-4 px-6 text-[#FF4A00] font-semibold">AI Automation</th>
                  <th className="text-center py-4 px-6 text-green-600 font-semibold">Improvement</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, index) => (
                  <motion.tr
                    key={row.feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-6 font-medium text-gray-900">{row.feature}</td>
                    <td className="py-4 px-6 text-center text-gray-600">{row.manual}</td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#FF4A00]/10 text-[#FF4A00] font-semibold">
                        {row.ai}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center space-x-1 text-green-600 font-semibold">
                        <CheckCircle className="w-4 h-4" />
                        <span>{row.improvement}</span>
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center space-x-4 bg-green-100 text-green-700 px-6 py-3 rounded-full">
              <TrendingUp className="w-5 h-5" />
              <span className="font-semibold">Average ROI: 320% within 6 months</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}