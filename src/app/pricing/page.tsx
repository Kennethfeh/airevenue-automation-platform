'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X, Phone, Calendar, Zap, Shield, Headphones, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { MainNav } from '@/components/navigation/main-nav'
import { MainFooter } from '@/components/footer/main-footer'

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true)

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for small businesses getting started with automation',
      monthlyPrice: 299,
      annualPrice: 2990,
      savings: '2 months free',
      features: [
        'Up to 1,000 automated interactions/month',
        'Basic AI customer service',
        'Email workflow automation',
        '5 custom integrations',
        'Standard support (24h response)',
        'Basic analytics dashboard',
        'SSL security',
        '99.5% uptime SLA'
      ],
      notIncluded: [
        'Advanced AI training',
        'Custom workflows',
        'Priority support',
        'Dedicated account manager'
      ],
      cta: 'Start Free Trial',
      popular: false
    },
    {
      name: 'Professional',
      description: 'Ideal for growing companies ready to scale automation',
      monthlyPrice: 799,
      annualPrice: 7990,
      savings: '2 months free',
      features: [
        'Up to 10,000 automated interactions/month',
        'Advanced AI customer service',
        'Complete workflow automation',
        'Unlimited custom integrations',
        'Priority support (4h response)',
        'Advanced analytics & reporting',
        'Custom AI training',
        'Team collaboration tools',
        'API access',
        '99.9% uptime SLA',
        'SOC 2 compliance'
      ],
      notIncluded: [
        'Dedicated account manager',
        'Custom development',
        'On-premise deployment'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      description: 'For large organizations with complex automation needs',
      monthlyPrice: 'Custom',
      annualPrice: 'Custom',
      savings: 'Volume discounts available',
      features: [
        'Unlimited automated interactions',
        'Enterprise AI with custom models',
        'Fully custom workflow development',
        'White-label solutions',
        'Dedicated account manager',
        'Custom SLA (up to 99.99%)',
        '24/7 phone support',
        'Advanced security & compliance',
        'On-premise deployment options',
        'Custom integrations & development',
        'Training & onboarding',
        'Success guarantee'
      ],
      notIncluded: [],
      cta: 'Contact Sales',
      popular: false
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
    if (plan.monthlyPrice === 'Custom') return 'Custom Pricing'
    
    const price = isAnnual ? plan.annualPrice : plan.monthlyPrice
    const period = isAnnual ? '/year' : '/month'
    
    return `$${price.toLocaleString()}${period}`
  }

  const getPerMonthPrice = (plan: any) => {
    if (plan.monthlyPrice === 'Custom') return ''
    
    const monthlyEquivalent = isAnnual ? Math.round(plan.annualPrice / 12) : plan.monthlyPrice
    return isAnnual ? `$${monthlyEquivalent}/month billed annually` : 'Billed monthly'
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
            
            {/* Billing Toggle */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center space-x-4 mb-12"
            >
              <span className={`font-medium ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>Monthly</span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isAnnual ? 'bg-[#FF4A00]' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isAnnual ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`font-medium ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
                Annual
                <span className="ml-1 text-green-600 text-sm">(Save 17%)</span>
              </span>
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
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[#FF4A00] text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-4">
                    <div className="text-4xl font-bold text-gray-900">{getPrice(plan)}</div>
                    <div className="text-sm text-gray-500">{getPerMonthPrice(plan)}</div>
                  </div>
                  
                  {plan.savings && (
                    <div className="text-green-600 font-medium text-sm">{plan.savings}</div>
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

                <Link href={plan.cta === 'Contact Sales' ? '/contact' : '/book-demo'}>
                  <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                    plan.popular
                      ? 'bg-[#FF4A00] text-white hover:bg-[#FF3A00] shadow-lg'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}>
                    {plan.cta}
                  </button>
                </Link>
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