'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, Clock, ArrowRight } from 'lucide-react'

export const ClientSuccessStories: React.FC = () => {
  const successStories = [
    {
      company: "GrowthStore E-commerce",
      industry: "E-commerce • 50-200 employees",
      quote: "We went from spending $15,000/month on support to just $6,000 while improving response times from 6 hours to 30 seconds.",
      metrics: [
        { label: "Cost reduction", value: "60%", icon: TrendingUp },
        { label: "Faster response time", value: "92%", icon: Clock },
        { label: "Customer satisfaction increase", value: "40%", icon: Users }
      ],
      person: {
        name: "Sarah Johnson",
        title: "Operations Director",
        avatar: "SJ"
      },
      accentColor: "from-blue-500 to-blue-600"
    },
    {
      company: "TechFlow SaaS",
      industry: "SaaS • 100-500 employees",
      quote: "Our support team now focuses on complex issues while AI handles routine questions. Customer satisfaction jumped to 96%.",
      metrics: [
        { label: "Tickets automated", value: "80%", icon: TrendingUp },
        { label: "Customer satisfaction", value: "96%", icon: Users },
        { label: "Support cost reduction", value: "35%", icon: Clock }
      ],
      person: {
        name: "Mike Chen",
        title: "Customer Success Manager",
        avatar: "MC"
      },
      accentColor: "from-purple-500 to-purple-600"
    },
    {
      company: "MedCare Practice",
      industry: "Healthcare • 20-100 employees",
      quote: "Appointment scheduling is now completely automated. We handle 300+ requests daily without any staff intervention.",
      metrics: [
        { label: "Daily appointments automated", value: "300+", icon: Clock },
        { label: "Staff time savings", value: "50%", icon: Users },
        { label: "Increase in bookings", value: "25%", icon: TrendingUp }
      ],
      person: {
        name: "Dr. Lisa Rodriguez",
        title: "Practice Manager",
        avatar: "LR"
      },
      accentColor: "from-green-500 to-green-600"
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container-xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Real Results from Real Businesses
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how companies like yours transformed their customer service
          </p>
        </motion.div>

        {/* Success Story Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {successStories.map((story, index) => (
            <motion.div
              key={story.company}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group"
            >
              {/* Orange accent bar */}
              <div className={`h-1 bg-gradient-to-r ${story.accentColor}`}></div>
              
              <div className="p-8">
                {/* Company Info */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{story.company}</h3>
                  <span className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                    {story.industry}
                  </span>
                </div>

                {/* Quote */}
                <blockquote className="text-gray-700 leading-relaxed mb-6 italic">
                  "{story.quote}"
                </blockquote>

                {/* Metrics */}
                <div className="space-y-4 mb-6">
                  {story.metrics.map((metric, metricIndex) => {
                    const Icon = metric.icon
                    return (
                      <div key={metricIndex} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${story.accentColor} flex items-center justify-center`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm text-gray-600">{metric.label}</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">{metric.value}</span>
                      </div>
                    )
                  })}
                </div>

                {/* Person */}
                <div className="flex items-center space-x-3 pt-6 border-t border-gray-100">
                  <div className={`w-12 h-12 bg-gradient-to-r ${story.accentColor} rounded-full flex items-center justify-center text-white font-bold`}>
                    {story.person.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{story.person.name}</div>
                    <div className="text-sm text-gray-600">{story.person.title}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-[#FF4A00] to-[#FF6B1A] rounded-2xl p-8 text-white inline-block">
            <h3 className="text-2xl font-bold mb-4">Ready to See Your Potential Results?</h3>
            <p className="text-orange-100 mb-6 max-w-lg">
              Join these successful companies and discover how much you could save with AI automation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-[#FF4A00] px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all inline-flex items-center space-x-2 shadow-lg">
                <span>See Your Potential Results</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all">
                Watch Success Stories
              </button>
            </div>
          </div>
        </motion.div>

        {/* Social Proof Numbers */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-16 text-center"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-[#FF4A00]">500+</div>
              <div className="text-gray-600">Success Stories</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-[#FF4A00]">$2.3M+</div>
              <div className="text-gray-600">Total Savings Generated</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-[#FF4A00]">94%</div>
              <div className="text-gray-600">Client Satisfaction Rate</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-[#FF4A00]">30 Days</div>
              <div className="text-gray-600">Average Payback Period</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}