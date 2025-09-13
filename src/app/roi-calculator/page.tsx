'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Calculator, TrendingUp, DollarSign, Target } from 'lucide-react'
import { MainNav } from '@/components/navigation/main-nav'
import { MainFooter } from '@/components/footer/main-footer'
import { ROICalculator } from '@/components/lead-magnets/roi-calculator'

export default function ROICalculatorPage() {
  const benefits = [
    {
      icon: DollarSign,
      title: 'Calculate Your Savings',
      description: 'Get an accurate estimate of how much you could save annually with AI automation'
    },
    {
      icon: TrendingUp,
      title: 'See Your ROI',
      description: 'Understand the return on investment and payback period for your automation initiative'
    },
    {
      icon: Target,
      title: 'Identify Opportunities',
      description: 'Discover which processes have the highest automation potential in your organization'
    }
  ]

  const testimonials = [
    {
      quote: "The ROI calculator helped us justify the automation investment. We're now saving $2.4M annually.",
      author: "Sarah Johnson",
      role: "COO, TechCorp Industries",
      savings: "$2.4M saved"
    },
    {
      quote: "Seeing the potential savings convinced our board immediately. Implementation started the next month.",
      author: "Michael Chen", 
      role: "VP Operations, Global Finance",
      savings: "$1.8M saved"
    },
    {
      quote: "The calculator was spot-on. We achieved the projected savings within the first quarter.",
      author: "Dr. Lisa Rodriguez",
      role: "Practice Manager, HealthFirst",
      savings: "$950K saved"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <MainNav />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-50 to-white py-20">
        <div className="container-xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-20 h-20 bg-[#FF4A00]/10 rounded-2xl flex items-center justify-center mx-auto mb-8"
            >
              <Calculator className="w-10 h-10 text-[#FF4A00]" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            >
              Calculate Your Automation ROI
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 leading-relaxed"
            >
              Discover exactly how much you could save by automating your business processes. 
              Get a personalized analysis based on your company size and current operations.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <ROICalculator />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container-xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Why Use Our ROI Calculator?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 bg-[#FF4A00]/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                      <Icon className="w-8 h-8 text-[#FF4A00]" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-gray-50">
        <div className="container-xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Real Results from Real Companies
            </h2>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.author}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-8 shadow-sm border border-gray-200"
                >
                  <div className="mb-6">
                    <div className="text-2xl font-bold text-green-600 mb-2">{testimonial.savings}</div>
                    <div className="text-sm text-gray-500">Annual savings achieved</div>
                  </div>
                  
                  <blockquote className="text-gray-700 mb-6">
                    "{testimonial.quote}"
                  </blockquote>
                  
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16">
        <div className="container-xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              How It Works
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-[#FF4A00] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Enter Your Details</h3>
                <p className="text-gray-600 text-sm">Provide basic information about your company size and current processes</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-[#FF4A00] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">See Instant Results</h3>
                <p className="text-gray-600 text-sm">Get immediate calculations showing your potential savings and ROI</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-[#FF4A00] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Detailed Report</h3>
                <p className="text-gray-600 text-sm">Receive a comprehensive analysis and speak with our automation experts</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#FF4A00] to-[#FF6B1A]">
        <div className="container-xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to See Your Savings Potential?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join hundreds of companies that have discovered their automation ROI. 
              The calculator takes less than 2 minutes to complete.
            </p>
            
            <ROICalculator />
          </div>
        </div>
      </section>

      <MainFooter />
    </div>
  )
}