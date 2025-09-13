'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Sarah Chen',
      title: 'Operations Director, TechFlow E-commerce',
      avatar: '/images/testimonials/sarah.jpg',
      rating: 5,
      text: 'We were drowning in customer support tickets. Now AI handles 75% of our inquiries automatically. Our team can focus on complex issues while customers get instant responses.',
      results: '$12,000/month saved',
      timeframe: '3 months'
    },
    {
      name: 'Marcus Rodriguez',
      title: 'Customer Success Manager, CloudServ',
      avatar: '/images/testimonials/marcus.jpg',
      rating: 5,
      text: 'Customer satisfaction scores jumped from 7.2 to 9.1 after implementing AI support. Response times went from 6 hours to 30 seconds. Our customers love the instant help.',
      results: '9.1/10 satisfaction',
      timeframe: '6 weeks'
    },
    {
      name: 'Emily Watson',
      title: 'VP Operations, HealthTech Solutions',
      avatar: '/images/testimonials/emily.jpg',
      rating: 5,
      text: 'The ROI was immediate. We reduced our support team from 8 people to 3 while handling 40% more inquiries. Setup was incredibly smooth and support has been excellent.',
      results: '$18,500/month saved',
      timeframe: '2 months'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container-xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Customer Success Stories
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            See how businesses like yours are saving thousands monthly with AI automation
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 hover-lift"
            >
              <div className="flex items-center mb-6">
                <Quote className="w-8 h-8 text-primary-400 mr-3" />
                <div className="flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-warning-400 fill-current" />
                  ))}
                </div>
              </div>

              <blockquote className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
                "{testimonial.text}"
              </blockquote>

              <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.title}
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center bg-success-50 dark:bg-success-900/20 rounded-lg p-3">
                    <div className="text-sm text-success-600 dark:text-success-400">Result</div>
                    <div className="font-semibold text-success-800 dark:text-success-300">
                      {testimonial.results}
                    </div>
                  </div>
                  <div className="text-center bg-primary-50 dark:bg-primary-900/20 rounded-lg p-3">
                    <div className="text-sm text-primary-600 dark:text-primary-400">Timeline</div>
                    <div className="font-semibold text-primary-800 dark:text-primary-300">
                      {testimonial.timeframe}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 inline-block">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Average Customer Results
            </div>
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-success-600">$8,200</div>
                <div className="text-sm text-gray-500">Monthly Savings</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-600">68%</div>
                <div className="text-sm text-gray-500">Cost Reduction</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-warning-600">8.7/10</div>
                <div className="text-sm text-gray-500">Customer Satisfaction</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}