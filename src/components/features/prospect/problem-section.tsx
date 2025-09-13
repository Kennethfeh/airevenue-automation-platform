'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Clock, TrendingDown, Users } from 'lucide-react'

export const ProblemSection: React.FC = () => {
  const problems = [
    {
      icon: Users,
      title: 'Overwhelmed Support Team',
      description: 'Your team spends 80% of their time answering the same basic questions instead of solving complex issues.'
    },
    {
      icon: Clock,
      title: 'Slow Response Times',
      description: 'Customers wait hours for simple answers while your team juggles hundreds of repetitive inquiries daily.'
    },
    {
      icon: TrendingDown,
      title: 'Rising Operational Costs',
      description: 'Support costs increase 20-30% yearly as volume grows, but revenue per inquiry stays flat or decreases.'
    },
    {
      icon: AlertTriangle,
      title: 'Customer Frustration',
      description: 'Delayed responses damage satisfaction scores and drive customers to competitors who respond faster.'
    }
  ]

  return (
    <section className="py-20 bg-red-50 dark:bg-red-900/10 border-y border-red-100 dark:border-red-900/20">
      <div className="container-xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <AlertTriangle className="w-4 h-4" />
            <span>The Hidden Cost of Manual Support</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 max-w-4xl mx-auto leading-tight">
            Your Customer Service Team is Drowning in Repetitive Questions
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            While customers wait hours for simple answers, your team burns out handling the same inquiries over and over. 
            <strong className="text-red-600 dark:text-red-400"> Every delayed response costs you money and damages satisfaction.</strong>
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-red-100 dark:border-red-900/20 hover:shadow-xl transition-shadow"
            >
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center mb-4">
                <problem.icon className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                {problem.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-red-100 dark:border-red-900/20"
        >
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">73%</div>
              <div className="text-gray-600 dark:text-gray-300">of customers abandon purchases due to poor support response times</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">$75</div>
              <div className="text-gray-600 dark:text-gray-300">average cost to acquire a customer vs $5 to retain one</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">4.2x</div>
              <div className="text-gray-600 dark:text-gray-300">higher revenue from companies with superior customer experience</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center mt-12"
        >
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            What if there was a better way?
          </p>
          <div className="w-1 h-12 bg-gradient-to-b from-red-400 to-primary-600 mx-auto rounded-full"></div>
        </motion.div>
      </div>
    </section>
  )
}