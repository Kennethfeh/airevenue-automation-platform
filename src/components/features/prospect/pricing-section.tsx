'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Check, Star, ArrowRight, DollarSign, Mail, Phone } from 'lucide-react'

export const PricingSection: React.FC = () => {
  const plans = [
    {
      name: 'Growth',
      price: 2500,
      description: 'Save $8,000+ monthly in support costs',
      features: [
        'Up to 5,000 inquiries/month',
        'AI automation with GPT-4',
        'Multi-channel integration',
        'Real-time analytics dashboard',
        'Knowledge base & training',
        'Standard integrations included',
        '24/7 AI support',
        'Setup & onboarding included'
      ],
      popular: false,
      setupFee: 2500,
      savings: '$8,000+'
    },
    {
      name: 'Professional',
      price: 4500,
      description: 'Save $15,000+ monthly with advanced automation',
      features: [
        'Up to 15,000 inquiries/month',
        'Advanced AI with custom training',
        'All channels (email, chat, phone, social)',
        'Advanced analytics & insights',
        'All CRM & help desk integrations',
        'Priority support & success manager',
        'Team collaboration tools',
        'Custom workflows & automation'
      ],
      popular: true,
      setupFee: 3500,
      savings: '$15,000+'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'Save $25,000+ monthly with unlimited scale',
      features: [
        'Unlimited inquiries',
        'Custom AI model development',
        'Advanced security & compliance',
        'Dedicated success team',
        'Unlimited custom integrations',
        'Performance SLA guarantees',
        'Advanced reporting & analytics',
        'API access & white-labeling',
        'Custom contract terms'
      ],
      popular: false,
      setupFee: 'Custom',
      savings: '$25,000+'
    }
  ]

  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="container-xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-success-100 dark:bg-success-900/20 text-success-800 dark:text-success-200 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <DollarSign className="w-4 h-4" />
            <span>ROI-Driven Investment Plans</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Cut Your Customer Service Costs by 60%+
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Our clients typically save <strong className="text-success-600">$8,000-$25,000+ monthly</strong> while improving customer satisfaction. 
            <strong className="text-primary-600"> Most see full ROI within 30-60 days.</strong>
          </p>
          
          <div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            <button className="px-6 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm font-medium">
              Monthly
            </button>
            <button className="px-6 py-2 rounded-lg text-gray-600 dark:text-gray-400 font-medium">
              Yearly (Save 20%)
            </button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl border-2 shadow-xl hover-lift ${
                plan.popular 
                  ? 'border-primary-500 ring-4 ring-primary-500/20' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              <div className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {plan.description}
                  </p>
                  
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-gray-900 dark:text-white">
                      ${plan.price.toLocaleString()}
                    </span>
                    <span className="text-xl text-gray-500 dark:text-gray-400">/month</span>
                  </div>
                  
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    + ${plan.setupFee.toLocaleString()} setup fee
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-success-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

{plan.name === 'Enterprise' ? (
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Ready to get started?
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Contact our team for custom pricing and implementation
                      </p>
                      <a
                        href="mailto:hello@flowsupportai.com"
                        className="inline-flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                      >
                        <Mail className="w-4 h-4" />
                        <span>hello@flowsupportai.com</span>
                      </a>
                    </div>
                    <button className="w-full py-4 px-6 rounded-xl font-semibold transition-all bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl">
                      Contact Sales
                      <ArrowRight className="w-5 h-5 ml-2 inline" />
                    </button>
                    <button className="w-full py-3 px-6 rounded-xl font-medium transition-all bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600">
                      Book a Demo
                      <Phone className="w-4 h-4 ml-2 inline" />
                    </button>
                  </div>
                ) : (
                  <button className={`w-full py-4 px-6 rounded-xl font-semibold transition-all ${
                    plan.popular
                      ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}>
                    Get Started
                    <ArrowRight className="w-5 h-5 ml-2 inline" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* ROI Calculation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-center text-white"
        >
          <h3 className="text-2xl font-bold mb-4">
            Typical Client ROI: Professional Plan
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <div className="text-3xl font-bold">$4,500</div>
              <div className="text-primary-100">Monthly Investment</div>
            </div>
            <div>
              <div className="text-3xl font-bold">$18,000</div>
              <div className="text-primary-100">Previous Support Costs</div>
            </div>
            <div>
              <div className="text-3xl font-bold">$13,500</div>
              <div className="text-primary-100">Monthly Savings</div>
            </div>
            <div>
              <div className="text-3xl font-bold">3x</div>
              <div className="text-primary-100">Return on Investment</div>
            </div>
          </div>
          <p className="text-primary-100 mt-6">
            Based on actual client results. Most businesses achieve positive ROI within 45-60 days.
          </p>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 text-center border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Questions? We're here to help
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Questions about pricing? Our team is ready to help you find the perfect plan for your business needs.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
            <a
              href="mailto:hello@flowsupportai.com"
              className="inline-flex items-center space-x-3 bg-white dark:bg-gray-800 px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-400 transition-all group"
            >
              <Mail className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <div className="text-left">
                <div className="text-sm text-gray-500 dark:text-gray-400">Email us at</div>
                <div className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                  hello@flowsupportai.com
                </div>
              </div>
            </a>

            <button className="inline-flex items-center space-x-3 bg-primary-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl">
              <Phone className="w-5 h-5" />
              <span>Book a free consultation call</span>
            </button>
          </div>

          <p className="text-gray-500 dark:text-gray-400">
            Ready to transform your customer service? Let's discuss your specific needs and show you exactly how FlowSupport AI can help.
          </p>
        </motion.div>
      </div>
    </section>
  )
}