'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Star, Quote, TrendingUp, Clock, DollarSign, Users, 
  ChevronLeft, ChevronRight, Play, Award, Zap
} from 'lucide-react'

export const ZapierSocialProof: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [currentMetric, setCurrentMetric] = useState(0)

  const testimonials = [
    {
      quote: "We went from drowning in 2,000+ daily support tickets to having our AI handle 80% automatically. Customer satisfaction jumped from 7.2 to 9.1 in just 30 days.",
      author: "Sarah Chen",
      title: "VP Operations",
      company: "TechFlow Commerce",
      avatar: "SC",
      industry: "E-commerce",
      employees: "500+",
      results: {
        costSaving: "$9,000/month",
        timeReduction: "75%",
        satisfaction: "+27%",
        automation: "80%"
      },
      video: true
    },
    {
      quote: "The ROI was immediate. We're saving $12,000 monthly on support costs while our response time dropped from 6 hours to under 2 minutes. Game changer.",
      author: "Marcus Rodriguez",
      title: "Customer Success Director", 
      company: "CloudServ SaaS",
      avatar: "MR",
      industry: "Software",
      employees: "200+",
      results: {
        costSaving: "$12,000/month",
        timeReduction: "95%",
        satisfaction: "+31%", 
        automation: "82%"
      },
      video: true
    },
    {
      quote: "We handle 300+ appointment requests daily without adding staff. Patient satisfaction hit an all-time high at 9.3/10. The automation is flawless.",
      author: "Dr. Emily Watson",
      title: "VP Operations",
      company: "HealthTech Solutions",
      avatar: "EW",
      industry: "Healthcare", 
      employees: "150+",
      results: {
        costSaving: "$15,000/month",
        timeReduction: "88%",
        satisfaction: "+15%",
        automation: "85%"
      },
      video: true
    }
  ]

  const liveMetrics = [
    { label: "Businesses Automated", value: "500+", icon: Users, color: "text-blue-600" },
    { label: "Average Monthly Savings", value: "$12,400", icon: DollarSign, color: "text-green-600" },
    { label: "Inquiries Processed", value: "2.1M+", icon: Zap, color: "text-orange-600" },
    { label: "Customer Satisfaction", value: "9.1/10", icon: Star, color: "text-yellow-600" }
  ]

  const companyLogos = [
    { name: "TechFlow", industry: "E-commerce" },
    { name: "CloudServ", industry: "SaaS" },
    { name: "HealthTech", industry: "Healthcare" },
    { name: "RetailPro", industry: "Retail" },
    { name: "FinanceFirst", industry: "Finance" },
    { name: "EduSoft", industry: "Education" }
  ]

  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 8000)

    const metricInterval = setInterval(() => {
      setCurrentMetric((prev) => (prev + 1) % liveMetrics.length)
    }, 2000)

    return () => {
      clearInterval(testimonialInterval)
      clearInterval(metricInterval)
    }
  }, [])

  const currentTest = testimonials[currentTestimonial]
  const currentMet = liveMetrics[currentMetric]
  const MetricIcon = currentMet.icon

  return (
    <section className="py-20 bg-white">
      <div className="container-xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Award className="w-4 h-4" />
            <span>Trusted by Industry Leaders</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Join 500+ businesses who automated 
            <br />
            their customer service
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See real results from companies just like yours - reducing costs while improving satisfaction
          </p>
        </motion.div>

        {/* Live Metrics Ticker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-[#FF4A00] to-[#FF6B1A] rounded-2xl p-8 mb-16 text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-6">Live Platform Statistics</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {liveMetrics.map((metric, index) => {
              const Icon = metric.icon
              return (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ 
                    opacity: 1, 
                    scale: currentMetric === index ? 1.05 : 1 
                  }}
                  className={`p-4 rounded-lg transition-all ${
                    currentMetric === index ? 'bg-white/20' : 'bg-white/10'
                  }`}
                >
                  <Icon className="w-8 h-8 mx-auto mb-2 text-yellow-200" />
                  <div className="text-3xl font-bold mb-1">{metric.value}</div>
                  <div className="text-sm text-orange-100">{metric.label}</div>
                </motion.div>
              )
            })}
          </div>
          <p className="text-orange-100 text-sm mt-4">
            Updated in real-time • Last updated: Just now
          </p>
        </motion.div>

        {/* Main Testimonial Carousel */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Testimonial Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-xl border border-gray-200">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#FF4A00] rounded-full flex items-center justify-center">
                <Quote className="w-4 h-4 text-white" />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#FF4A00] to-[#FF6B1A] rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                      {currentTest.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{currentTest.author}</h4>
                      <p className="text-gray-600 text-sm">{currentTest.title}</p>
                      <p className="text-[#FF4A00] text-sm font-medium">{currentTest.company}</p>
                    </div>
                    {currentTest.video && (
                      <button className="ml-auto w-10 h-10 bg-[#FF4A00] rounded-full flex items-center justify-center text-white hover:bg-[#E8420A] transition-colors">
                        <Play className="w-5 h-5 ml-0.5" />
                      </button>
                    )}
                  </div>

                  <blockquote className="text-gray-700 text-lg leading-relaxed mb-6">
                    "{currentTest.quote}"
                  </blockquote>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-lg p-3 text-center border border-green-200">
                      <DollarSign className="w-5 h-5 text-green-600 mx-auto mb-1" />
                      <div className="font-bold text-green-900">{currentTest.results.costSaving}</div>
                      <div className="text-xs text-green-700">Monthly Savings</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200">
                      <Clock className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                      <div className="font-bold text-blue-900">{currentTest.results.timeReduction}</div>
                      <div className="text-xs text-blue-700">Time Reduction</div>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-3 text-center border border-yellow-200">
                      <Star className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
                      <div className="font-bold text-yellow-900">{currentTest.results.satisfaction}</div>
                      <div className="text-xs text-yellow-700">Satisfaction Boost</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 text-center border border-purple-200">
                      <TrendingUp className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                      <div className="font-bold text-purple-900">{currentTest.results.automation}</div>
                      <div className="text-xs text-purple-700">Automated</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <div className="flex space-x-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <div className="text-sm text-gray-500">
                      {currentTest.industry} • {currentTest.employees} employees
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex justify-center mt-6 space-x-4">
              <button
                onClick={() => setCurrentTestimonial((prev) => 
                  prev === 0 ? testimonials.length - 1 : prev - 1
                )}
                className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-300 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      currentTestimonial === index ? 'bg-[#FF4A00]' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => setCurrentTestimonial((prev) => 
                  (prev + 1) % testimonials.length
                )}
                className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-300 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          {/* Industry Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Trusted Across Industries
            </h3>

            <div className="space-y-4">
              {companyLogos.map((company, index) => (
                <motion.div
                  key={company.name}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-4 shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                        <span className="font-bold text-gray-700">{company.name.slice(0, 2)}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{company.name}</h4>
                        <p className="text-sm text-gray-600">{company.industry}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
              <h4 className="font-bold text-gray-900 mb-2">Average Results</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-green-600">64%</div>
                  <div className="text-sm text-gray-600">Cost Reduction</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">81%</div>
                  <div className="text-sm text-gray-600">Automated</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">$12,400</div>
                  <div className="text-sm text-gray-600">Monthly Savings</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">9.1/10</div>
                  <div className="text-sm text-gray-600">Satisfaction</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center bg-gray-50 rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Join These Success Stories?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            See how much your business could save with AI customer service automation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-[#FF4A00] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#E8420A] transition-all shadow-lg">
              Calculate My Savings
            </button>
            <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all">
              View All Case Studies
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}