'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Clock, Users, DollarSign, Star, ArrowRight } from 'lucide-react'

export const ClientSuccessSection: React.FC = () => {
  const successStories = [
    {
      company: 'TechFlow E-commerce',
      industry: 'E-commerce',
      size: '500+ employees',
      logo: 'TF',
      challenge: 'Overwhelmed support team handling 2,000+ daily inquiries',
      solution: 'AI automation handling product questions, order status, and returns',
      results: {
        costReduction: '$15K → $6K monthly',
        responseTime: '4 hours → 30 seconds',
        satisfaction: '7.2 → 9.1/10',
        automation: '78% inquiries automated'
      },
      quote: 'We went from drowning in tickets to having our team focus on high-value customer issues. The ROI was immediate.',
      person: 'Sarah Chen, Operations Director'
    },
    {
      company: 'CloudServ SaaS',
      industry: 'Software',
      size: '200+ employees', 
      logo: 'CS',
      challenge: 'Technical support backlog causing customer churn',
      solution: 'AI-powered technical troubleshooting and account management',
      results: {
        costReduction: '$12K → $4K monthly',
        responseTime: '6 hours → 2 minutes',
        satisfaction: '6.8 → 8.9/10',
        automation: '82% inquiries automated'
      },
      quote: 'Customer satisfaction scores jumped dramatically. Our churn rate dropped 40% in the first quarter.',
      person: 'Marcus Rodriguez, Customer Success'
    },
    {
      company: 'HealthTech Solutions',
      industry: 'Healthcare',
      size: '150+ employees',
      logo: 'HT',
      challenge: 'Appointment scheduling and patient inquiries overwhelming staff',
      solution: 'Automated appointment booking and HIPAA-compliant patient support',
      results: {
        costReduction: '$20K → $8K monthly',
        responseTime: '3 hours → 1 minute',
        satisfaction: '8.1 → 9.3/10',
        automation: '85% inquiries automated'
      },
      quote: 'We handle 300+ appointment requests daily without adding staff. Patient satisfaction is at an all-time high.',
      person: 'Emily Watson, VP Operations'
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
            <Star className="w-4 h-4" />
            <span>Client Success Stories</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 max-w-4xl mx-auto leading-tight">
            Real Results from Real Companies
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            See how businesses across industries are transforming their customer service operations and cutting costs dramatically
          </p>
        </motion.div>

        <div className="space-y-12">
          {successStories.map((story, index) => (
            <motion.div
              key={story.company}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Company Info */}
                <div className="lg:col-span-1">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                      {story.logo}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {story.company}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">{story.industry}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">{story.size}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Challenge:</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{story.challenge}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Solution:</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{story.solution}</p>
                    </div>
                  </div>
                </div>

                {/* Results Grid */}
                <div className="lg:col-span-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Results:</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center space-x-2 mb-2">
                        <DollarSign className="w-4 h-4 text-success-600" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">Cost Reduction</span>
                      </div>
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {story.results.costReduction}
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="w-4 h-4 text-primary-600" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">Response Time</span>
                      </div>
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {story.results.responseTime}
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center space-x-2 mb-2">
                        <Star className="w-4 h-4 text-warning-600" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">Satisfaction</span>
                      </div>
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {story.results.satisfaction}
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-success-600" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">Automated</span>
                      </div>
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {story.results.automation}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quote */}
                <div className="lg:col-span-1">
                  <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-6 border border-primary-200 dark:border-primary-800/30">
                    <div className="text-4xl text-primary-300 mb-4">"</div>
                    <blockquote className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                      {story.quote}
                    </blockquote>
                    <cite className="text-sm font-medium text-primary-700 dark:text-primary-300">
                      — {story.person}
                    </cite>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white text-center"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-6">
            Average Results Across All Clients
          </h3>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">64%</div>
              <div className="text-primary-100">Average Cost Reduction</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">$12,400</div>
              <div className="text-primary-100">Average Monthly Savings</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">81%</div>
              <div className="text-primary-100">Inquiries Automated</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">8.7/10</div>
              <div className="text-primary-100">Customer Satisfaction</div>
            </div>
          </div>
          
          <div className="mt-8">
            <button className="bg-white text-primary-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors inline-flex items-center space-x-2">
              <span>Calculate My Potential Savings</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}