'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Award, Users, Clock, CheckCircle, Lock, Globe, Zap } from 'lucide-react'

export const TrustSection: React.FC = () => {
  const trustSignals = [
    {
      icon: Shield,
      title: 'SOC 2 Compliant',
      description: 'Enterprise-grade security standards'
    },
    {
      icon: Award,
      title: 'GDPR Ready',
      description: 'Full data privacy compliance'
    },
    {
      icon: Lock,
      title: 'Bank-Level Encryption',
      description: 'AES-256 encryption at rest & in transit'
    },
    {
      icon: Users,
      title: '500+ Clients',
      description: 'Trusted by growing businesses'
    },
    {
      icon: Clock,
      title: '99.9% Uptime',
      description: 'Enterprise SLA guarantee'
    },
    {
      icon: Globe,
      title: 'Multi-Region',
      description: 'Global infrastructure & support'
    }
  ]

  const integrations = [
    'Salesforce', 'HubSpot', 'Zendesk', 'Intercom', 'Freshdesk', 'ServiceNow',
    'Microsoft Teams', 'Slack', 'Gmail', 'Outlook', 'WhatsApp', 'Facebook Messenger'
  ]

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="container-xl">
        {/* Trust Signals */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-200 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            <span>Enterprise Trust & Security</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Built for Enterprise Security & Compliance
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Trusted by 500+ businesses with bank-level security, SOC 2 compliance, and 99.9% uptime guarantee
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
          {trustSignals.map((signal, index) => (
            <motion.div
              key={signal.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <signal.icon className="w-8 h-8 text-primary-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                {signal.title}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {signal.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Integration Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-success-100 dark:bg-success-900/20 text-success-800 dark:text-success-200 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Zap className="w-4 h-4" />
              <span>Seamless Integrations</span>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Works with Your Existing Tools
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Connect with 100+ popular business tools and platforms
            </p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {integrations.map((integration, index) => (
              <motion.div
                key={integration}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center border border-gray-200 dark:border-gray-600"
              >
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {integration}
                </p>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              + 100+ more integrations available
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}