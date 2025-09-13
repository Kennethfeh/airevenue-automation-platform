'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Bot, 
  MessageSquare, 
  BarChart3, 
  Palette, 
  Globe, 
  Shield,
  Smartphone,
  Zap
} from 'lucide-react'

export const FeaturesGrid: React.FC = () => {
  const features = [
    {
      icon: Bot,
      title: 'AI-Powered Chatbots',
      description: 'GPT-4 powered chatbots that understand context and provide human-like responses',
      color: 'primary'
    },
    {
      icon: MessageSquare,
      title: 'Multi-Channel Support',
      description: 'WhatsApp, Facebook, Email, Web chat - all unified in one dashboard',
      color: 'success'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Real-time performance tracking with ROI calculations and insights',
      color: 'warning'
    },
    {
      icon: Palette,
      title: 'White-Label Ready',
      description: 'Complete branding customization for your agency clients',
      color: 'danger'
    },
    {
      icon: Globe,
      title: 'Multi-Language',
      description: 'Support 10+ languages with automatic translation capabilities',
      color: 'primary'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'SOC 2 compliant with end-to-end encryption and audit trails',
      color: 'success'
    },
    {
      icon: Smartphone,
      title: 'Mobile Apps',
      description: 'Native iOS and Android apps for client management on the go',
      color: 'warning'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Sub-second response times with 99.9% uptime guarantee',
      color: 'danger'
    }
  ]

  const colorClasses = {
    primary: 'bg-primary-100 text-primary-600 group-hover:bg-primary-200',
    success: 'bg-success-100 text-success-600 group-hover:bg-success-200',
    warning: 'bg-warning-100 text-warning-600 group-hover:bg-warning-200',
    danger: 'bg-danger-100 text-danger-600 group-hover:bg-danger-200'
  }

  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="container-xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Everything You Need to Dominate
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our comprehensive platform gives you every tool needed to build and scale a successful AI automation agency
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 hover-lift"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-6 ${colorClasses[feature.color]} transition-colors`}>
                <feature.icon className="w-6 h-6" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <button className="btn btn-primary btn-lg px-8 py-4 text-lg font-semibold hover-lift">
            See All Features
          </button>
        </motion.div>
      </div>
    </section>
  )
}