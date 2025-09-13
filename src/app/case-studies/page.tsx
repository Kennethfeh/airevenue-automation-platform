'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, Clock, DollarSign, ArrowRight, Building, Zap, Target } from 'lucide-react'
import Link from 'next/link'
import { MainNav } from '@/components/navigation/main-nav'
import { MainFooter } from '@/components/footer/main-footer'

export default function CaseStudiesPage() {
  const caseStudies = [
    {
      company: 'TechCorp Industries',
      industry: 'Manufacturing',
      size: '5,000+ employees',
      challenge: 'Customer service overwhelmed with 2,000+ daily inquiries, leading to 48-hour response times and declining satisfaction scores.',
      solution: 'Implemented AI-powered customer service automation with intelligent ticket routing and automated responses for common queries.',
      results: {
        costSavings: '$2.4M annually',
        efficiency: '75% faster response times',
        satisfaction: '94% customer satisfaction',
        automation: '80% of inquiries automated'
      },
      quote: 'AI Revenue transformed our customer service from our biggest pain point to our competitive advantage. The ROI was immediate and continues to grow.',
      author: 'Sarah Johnson, COO',
      timeframe: '3 months implementation',
      image: '/api/placeholder/600/400'
    },
    {
      company: 'Global Finance Solutions',
      industry: 'Financial Services',
      size: '1,200+ employees',
      challenge: 'Manual loan processing taking 14 days average, high error rates, and compliance concerns with document handling.',
      solution: 'Deployed intelligent document processing and workflow automation for loan applications, with AI-powered risk assessment and compliance checking.',
      results: {
        costSavings: '$1.8M annually',
        efficiency: '90% faster processing',
        satisfaction: '98% accuracy rate',
        automation: '95% of applications automated'
      },
      quote: 'The automation platform reduced our loan processing time from weeks to hours while maintaining perfect compliance standards.',
      author: 'Michael Chen, VP Operations',
      timeframe: '4 months implementation',
      image: '/api/placeholder/600/400'
    },
    {
      company: 'HealthFirst Medical Group',
      industry: 'Healthcare',
      size: '800+ employees',
      challenge: 'Appointment scheduling chaos, missed appointments, and staff spending 60% of time on administrative tasks instead of patient care.',
      solution: 'Integrated AI scheduling system with automated reminders, patient communication workflows, and intelligent resource allocation.',
      results: {
        costSavings: '$950K annually',
        efficiency: '65% reduction in admin time',
        satisfaction: '89% patient satisfaction',
        automation: '85% of scheduling automated'
      },
      quote: 'Our staff can finally focus on what matters most - patient care. The automation handles everything else seamlessly.',
      author: 'Dr. Lisa Rodriguez, Practice Manager',
      timeframe: '2 months implementation',
      image: '/api/placeholder/600/400'
    }
  ]

  const metrics = [
    {
      icon: DollarSign,
      value: '$127M+',
      label: 'Total Cost Savings Generated',
      description: 'Across all client implementations'
    },
    {
      icon: TrendingUp,
      value: '73%',
      label: 'Average Cost Reduction',
      description: 'In first year of implementation'
    },
    {
      icon: Clock,
      value: '2.8x',
      label: 'Faster Process Completion',
      description: 'Average improvement across workflows'
    },
    {
      icon: Users,
      value: '500+',
      label: 'Enterprises Transformed',
      description: 'Successfully automated operations'
    }
  ]

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
              Real Results from Real Companies
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 mb-8"
            >
              See how leading enterprises have transformed their operations and achieved massive cost savings 
              with AI Revenue automation platform.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              {metrics.map((metric, index) => {
                const Icon = metric.icon
                return (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 bg-[#FF4A00]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-[#FF4A00]" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{metric.value}</div>
                    <div className="font-semibold text-gray-900 mb-2">{metric.label}</div>
                    <div className="text-sm text-gray-600">{metric.description}</div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-16">
        <div className="container-xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="space-y-20">
              {caseStudies.map((study, index) => (
                <motion.div
                  key={study.company}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden"
                >
                  <div className="grid lg:grid-cols-2 gap-0">
                    <div className="p-8 lg:p-12">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="w-12 h-12 bg-[#FF4A00]/10 rounded-lg flex items-center justify-center">
                          <Building className="w-6 h-6 text-[#FF4A00]" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">{study.company}</h3>
                          <div className="text-gray-600">{study.industry} • {study.size}</div>
                        </div>
                      </div>

                      <div className="space-y-6 mb-8">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                            <Target className="w-4 h-4 mr-2 text-red-500" />
                            Challenge
                          </h4>
                          <p className="text-gray-600">{study.challenge}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                            <Zap className="w-4 h-4 mr-2 text-[#FF4A00]" />
                            Solution
                          </h4>
                          <p className="text-gray-600">{study.solution}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-8">
                        {Object.entries(study.results).map(([key, value]) => (
                          <div key={key} className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-[#FF4A00] mb-1">{value}</div>
                            <div className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                          </div>
                        ))}
                      </div>

                      <blockquote className="border-l-4 border-[#FF4A00] pl-4 mb-4">
                        <p className="text-gray-700 italic mb-2">"{study.quote}"</p>
                        <cite className="text-sm text-gray-600 font-medium">{study.author}</cite>
                      </blockquote>

                      <div className="text-sm text-gray-500">
                        Implementation time: {study.timeframe}
                      </div>
                    </div>

                    <div className="bg-gray-100 flex items-center justify-center p-8">
                      <div className="w-full h-64 bg-gradient-to-br from-[#FF4A00]/20 to-[#FF6B1A]/20 rounded-2xl flex items-center justify-center">
                        <div className="text-center">
                          <Building className="w-20 h-20 text-[#FF4A00] mx-auto mb-4" />
                          <div className="text-xl font-bold text-gray-900">{study.company}</div>
                          <div className="text-gray-600">{study.industry}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#FF4A00] to-[#FF6B1A]">
        <div className="container-xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Write Your Success Story?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join hundreds of enterprises that have transformed their operations with AI Revenue. 
              See how much you could save with a personalized automation assessment.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/roi-calculator">
                <button className="bg-white text-[#FF4A00] px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center">
                  Calculate Your ROI
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </Link>
              <Link href="/book-demo">
                <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[#FF4A00] transition-colors">
                  Book a Demo
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <MainFooter />
    </div>
  )
}