'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { trackEvent, trackIntegrationClick, ANALYTICS_EVENTS } from '@/lib/analytics-events'
import { useLazyLoading, useOptimizedAnimation } from '@/hooks/use-performance-optimization'

const IntegrationShowcase: React.FC = () => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const { ref, isIntersecting } = useLazyLoading(0.2)
  const { getAnimationProps } = useOptimizedAnimation()

  const integrations = {
    customerService: [
      { name: 'Zendesk', logo: '/logos/zendesk.svg', bgColor: 'bg-emerald-500' },
      { name: 'Intercom', logo: '/logos/intercom.svg', bgColor: 'bg-blue-500' },
      { name: 'Freshdesk', logo: '/logos/freshdesk.svg', bgColor: 'bg-green-500' },
      { name: 'Help Scout', logo: '/logos/helpscout.svg', bgColor: 'bg-purple-500' }
    ],
    ecommerce: [
      { name: 'Shopify', logo: '/logos/shopify.svg', bgColor: 'bg-green-600' },
      { name: 'WooCommerce', logo: '/logos/woocommerce.svg', bgColor: 'bg-indigo-600' },
      { name: 'Magento', logo: '/logos/magento.svg', bgColor: 'bg-orange-500' },
      { name: 'BigCommerce', logo: '/logos/bigcommerce.svg', bgColor: 'bg-blue-600' }
    ],
    crmSales: [
      { name: 'Salesforce', logo: '/logos/salesforce.svg', bgColor: 'bg-cyan-500' },
      { name: 'HubSpot', logo: '/logos/hubspot.svg', bgColor: 'bg-orange-500' },
      { name: 'Pipedrive', logo: '/logos/pipedrive.svg', bgColor: 'bg-green-500' },
      { name: 'Monday.com', logo: '/logos/monday.svg', bgColor: 'bg-purple-600' }
    ],
    communication: [
      { name: 'Slack', logo: '/logos/slack.svg', bgColor: 'bg-purple-500' },
      { name: 'Microsoft Teams', logo: '/logos/teams.svg', bgColor: 'bg-blue-600' },
      { name: 'WhatsApp Business', logo: '/logos/whatsapp.svg', bgColor: 'bg-green-500' },
      { name: 'Facebook Messenger', logo: '/logos/messenger.svg', bgColor: 'bg-blue-500' }
    ]
  }

  const categories = [
    { key: 'customerService', title: 'Customer Service', items: integrations.customerService },
    { key: 'ecommerce', title: 'E-Commerce', items: integrations.ecommerce },
    { key: 'crmSales', title: 'CRM & Sales', items: integrations.crmSales },
    { key: 'communication', title: 'Communication', items: integrations.communication }
  ]

  const IntegrationIcon: React.FC<{ integration: any }> = ({ integration }) => {
    const handleIntegrationClick = () => {
      trackIntegrationClick(integration.name);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleIntegrationClick();
      }
    };

    return (
      <motion.div
        {...getAnimationProps({ whileHover: { scale: 1.05 }, whileTap: { scale: 0.98 } })}
        className={`
          w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center
          bg-gray-100 hover:bg-[#FF4A00] transition-all duration-300
          border border-gray-200 hover:border-[#FF4A00]
          cursor-pointer group touch-manipulation
          min-h-[44px] min-w-[44px]
          focus:ring-2 focus:ring-[#FF4A00] focus:ring-offset-2
        `}
        role="button"
        tabIndex={0}
        aria-label={`Connect to ${integration.name}`}
        onClick={handleIntegrationClick}
        onKeyDown={handleKeyDown}
      >
        <div className="text-gray-600 group-hover:text-white font-semibold text-xs sm:text-sm">
          {integration.name.substring(0, 2).toUpperCase()}
        </div>
      </motion.div>
    )
  }

  return (
    <section 
      ref={ref}
      className="py-12 sm:py-16 lg:py-20 bg-white" 
      aria-labelledby="integrations-heading"
    >
      <div className="container-xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {isIntersecting && (
          <motion.div
            {...getAnimationProps({
              initial: { opacity: 0, y: 30 },
              whileInView: { opacity: 1, y: 0 },
              transition: { duration: 0.6 }
            })}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 id="integrations-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Connects to Your Existing Tools
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              No disruption to your workflow - we integrate with what you already use
            </p>
          </motion.div>
        )}

        {/* Integration Categories - Responsive Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              onHoverStart={() => setHoveredCategory(category.key)}
              onHoverEnd={() => setHoveredCategory(null)}
              className="bg-gray-50 rounded-2xl p-4 sm:p-6 hover:bg-gray-100 transition-all duration-300"
              role="group"
              aria-labelledby={`category-${category.key}`}
            >
              <h3 id={`category-${category.key}`} className="font-bold text-gray-900 text-base sm:text-lg mb-4 sm:mb-6 text-center">
                {category.title}
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {category.items.map((integration, idx) => (
                  <motion.div
                    key={integration.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.05 * idx }}
                    className="flex items-center space-x-2 sm:space-x-3"
                  >
                    <IntegrationIcon integration={integration} />
                    <span className="text-gray-700 font-medium text-sm sm:text-base">
                      {integration.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mb-6 sm:mb-8"
        >
          <p className="text-gray-600 text-base sm:text-lg mb-4 sm:mb-6">
            And 100+ more integrations
          </p>
          <motion.button
            {...getAnimationProps({ whileHover: { scale: 1.05 }, whileTap: { scale: 0.98 } })}
            className="text-[#FF4A00] font-semibold text-base sm:text-lg hover:underline flex items-center space-x-2 mx-auto touch-manipulation min-h-[44px] px-4 py-2 focus:ring-2 focus:ring-[#FF4A00] focus:ring-offset-2"
            aria-label="View all available integrations"
            onClick={() => trackEvent(ANALYTICS_EVENTS.VIEW_ALL_INTEGRATIONS)}
          >
            <span>See All Integrations</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        </motion.div>

        {/* API Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-center text-white"
          role="complementary"
          aria-labelledby="custom-integration-heading"
        >
          <h3 id="custom-integration-heading" className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 leading-tight">
            Custom Integration Needed?
          </h3>
          <p className="text-gray-300 text-base sm:text-lg mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
            Our team can connect any tool through REST API, webhooks, or custom development in 48 hours
          </p>
          <motion.button
            {...getAnimationProps({ whileHover: { scale: 1.05 }, whileTap: { scale: 0.98 } })}
            className="bg-[#FF4A00] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg hover:bg-[#E8420A] transition-all touch-manipulation min-h-[44px] focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            aria-label="Schedule consultation with integration expert"
            onClick={() => trackEvent(ANALYTICS_EVENTS.CUSTOM_INTEGRATION_REQUEST)}
          >
            Talk to Integration Expert
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export { IntegrationShowcase }