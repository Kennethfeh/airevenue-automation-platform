'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X, Phone, Calendar, Zap, Shield, Headphones, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { MainNav } from '@/components/navigation/main-nav'
import { MainFooter } from '@/components/footer/main-footer'
import { PricingButton } from '@/components/payments/paddle-button'

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true)

  const plans = [
    {
      name: 'Free Analysis',
      productKey: 'freeAnalysis' as const,
      description: 'Complete business automation assessment to identify savings opportunities',
      price: 0,
      originalPrice: 497,
      savings: 'Limited time offer',
      features: [
        'Comprehensive business process analysis',
        '30-minute strategy consultation call',
        'Custom automation roadmap',
        'ROI calculations and projections',
        'Priority workflow identification',
        'Implementation timeline',
        'Cost-benefit analysis report',
        'Next steps recommendation'
      ],
      notIncluded: [
        'Implementation services',
        'Custom development',
        'Ongoing support'
      ],
      cta: 'Get Free Analysis',
      popular: false,
      badge: 'FREE'
    },
    {
      name: 'Strategy Consultation',
      productKey: 'consultation' as const,
      description: '1-on-1 deep-dive session with automation expert to plan your transformation',
      price: 497,
      originalPrice: 997,
      savings: '50% off regular price',
      features: [
        '90-minute private strategy session',
        'Senior automation consultant assigned',
        'Detailed implementation blueprint',
        'Technology stack recommendations',
        'Team training requirements analysis',
        'Risk assessment and mitigation plan',
        'Budget planning and ROI projections',
        'Follow-up support for 30 days',
        'Priority booking for implementation'
      ],
      notIncluded: [
        'Actual implementation',
        'Custom development',
        'Ongoing management'
      ],
      cta: 'Book Consultation',
      popular: true,
      badge: 'MOST POPULAR'
    },
    {
      name: 'Starter Package',
      productKey: 'starter' as const,
      description: 'Complete automation setup for small to medium businesses',
      price: 7997,
      originalPrice: 12997,
      savings: '$5,000 savings',
      features: [
        'Complete business process automation',
        'AI customer service implementation',
        'Workflow automation setup',
        'Up to 5 system integrations',
        '3 months of premium support',
        'Team training and onboarding',
        'Performance monitoring dashboard',
        'Monthly optimization sessions',
        'Success guarantee - ROI within 90 days'
      ],
      notIncluded: [
        'Custom AI model development',
        'White-label solutions',
        'Dedicated account manager'
      ],
      cta: 'Get Started',
      popular: false,
      badge: 'BEST VALUE'
    },
    {
      name: 'Professional Package',
      productKey: 'professional' as const,
      description: 'Enterprise-grade automation solution with dedicated support',
      price: 12997,
      originalPrice: 19997,
      savings: '$7,000 savings',
      features: [
        'Everything in Starter Package',
        'Custom AI model development',
        'Unlimited system integrations',
        'Dedicated automation specialist',
        '6 months of premium support',
        'White-label solution options',
        'Advanced analytics and reporting',
        'Priority feature requests',
        '24/7 technical support',
        'Quarterly business reviews',
        'Success guarantee - 60% cost reduction'
      ],
      notIncluded: [],
      cta: 'Get Professional',
      popular: false,
      badge: 'ENTERPRISE'
    }
  ]

  const addOns = [
    {
      name: 'Additional Interactions',
      description: 'Extra automated interactions beyond plan limits',
      price: '$0.05 per interaction'
    },
    {
      name: 'Custom Integration Development',
      description: 'Bespoke integrations with your existing tools',
      price: 'Starting at $2,500'
    },
    {
      name: 'Professional Services',
      description: 'Implementation and optimization consulting',
      price: '$250/hour'
    },
    {
      name: 'Advanced Training',
      description: 'Custom AI model training for your specific use case',
      price: 'Starting at $5,000'
    }
  ]

  const getPrice = (plan: any) => {
    if (plan.price === 0) return 'Free'
    return `$${plan.price.toLocaleString()}`
  }

  const getOriginalPrice = (plan: any) => {
    if (plan.price === 0 || !plan.originalPrice) return null
    return `$${plan.originalPrice.toLocaleString()}`
  }

  return (
    <div className="min-h-screen bg-white">
      <MainNav />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-50 to-white py-20">
        <div className="container-xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            >
              Simple, Transparent Pricing
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 mb-8"
            >
              Choose the perfect plan to automate your business operations and start saving costs immediately.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-12"
            >
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 max-w-2xl mx-auto">
                <p className="text-lg text-gray-700">
                  🎯 <strong>Limited Time:</strong> Save thousands on implementation packages
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  All packages include success guarantee and priority support
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="container-xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-white rounded-2xl shadow-lg border-2 p-8 ${
                  plan.popular ? 'border-[#FF4A00] scale-105' : 'border-gray-200'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className={`px-4 py-1 rounded-full text-sm font-medium ${
                      plan.badge === 'FREE' ? 'bg-green-500 text-white' :
                      plan.badge === 'MOST POPULAR' ? 'bg-[#FF4A00] text-white' :
                      plan.badge === 'BEST VALUE' ? 'bg-blue-500 text-white' :
                      'bg-purple-500 text-white'
                    }`}>
                      {plan.badge}
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-center space-x-2">
                      {getOriginalPrice(plan) && (
                        <div className="text-xl text-gray-400 line-through">{getOriginalPrice(plan)}</div>
                      )}
                      <div className="text-4xl font-bold text-gray-900">{getPrice(plan)}</div>
                    </div>
                    {plan.price === 0 && (
                      <div className="text-sm text-gray-500">Usually $497</div>
                    )}
                  </div>
                  
                  {plan.savings && (
                    <div className="text-green-600 font-medium text-sm bg-green-50 px-3 py-1 rounded-full inline-block">
                      {plan.savings}
                    </div>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                  {plan.notIncluded.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-3 opacity-50">
                      <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>

                <PricingButton
                  productKey={plan.productKey}
                  popular={plan.popular}
                  onSuccess={() => {
                    console.log(`Payment successful for ${plan.name}`)
                  }}
                  onError={(error) => {
                    console.error(`Payment failed for ${plan.name}:`, error)
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Add-ons & Services</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {addOns.map((addon, index) => (
                <motion.div
                  key={addon.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{addon.name}</h3>
                  <p className="text-gray-600 mb-4">{addon.description}</p>
                  <div className="text-[#FF4A00] font-bold">{addon.price}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ/Contact Section */}
      <section className="py-16">
        <div className="container-xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Need Help Choosing?</h2>
            <p className="text-xl text-gray-600 mb-12">
              Our automation experts are here to help you find the perfect plan for your business needs.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-r from-[#FF4A00] to-[#FF6B1A] rounded-xl p-8 text-white">
                <Phone className="w-12 h-12 mb-4 mx-auto" />
                <h3 className="text-xl font-bold mb-4">Talk to Sales</h3>
                <p className="mb-6">Get personalized recommendations and custom pricing for your enterprise.</p>
                <Link href="/contact">
                  <button className="bg-white text-[#FF4A00] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Contact Sales
                  </button>
                </Link>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-8">
                <Calendar className="w-12 h-12 mb-4 mx-auto text-[#FF4A00]" />
                <h3 className="text-xl font-bold mb-4 text-gray-900">Book a Demo</h3>
                <p className="mb-6 text-gray-600">See AI Revenue in action with a personalized demo of our platform.</p>
                <Link href="/book-demo">
                  <button className="bg-[#FF4A00] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#FF3A00] transition-colors">
                    Schedule Demo
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MainFooter />
    </div>
  )
}