'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, ArrowRight, Shield, Clock, CheckCircle, Star } from 'lucide-react'

export const EnhancedSocialProof: React.FC = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  const testimonials = [
    {
      quote: "We reduced our support costs from $15,000 to $6,000 monthly while improving response times by 10x. The ROI was immediate.",
      author: "Sarah Chen",
      title: "VP Operations",
      company: "EcommerceStore Pro",
      avatar: "SC",
      results: "60% Cost Reduction",
      industry: "E-commerce",
      savings: "$9,000/month"
    },
    {
      quote: "Customer satisfaction went from 78% to 95% in just 2 months. Our team can now focus on complex issues while AI handles routine inquiries.",
      author: "Michael Rodriguez",
      title: "Customer Success Director", 
      company: "CloudSaaS Solutions",
      avatar: "MR",
      results: "95% Satisfaction Rate",
      industry: "SaaS",
      savings: "$12,500/month"
    },
    {
      quote: "The setup took less than 24 hours and we broke even in 3 weeks. Best business decision we made this year.",
      author: "Jennifer Walsh",
      title: "COO",
      company: "TechStartup Inc",
      avatar: "JW", 
      results: "3-Week Payback",
      industry: "Technology",
      savings: "$7,200/month"
    }
  ]

  const caseStudies = [
    {
      title: "E-commerce Store Success",
      subtitle: "Reduced support costs from $15K to $6K monthly",
      metrics: ["60% cost reduction", "10x faster responses", "24/7 coverage"],
      industry: "Retail"
    },
    {
      title: "SaaS Company Transformation", 
      subtitle: "95% customer satisfaction increase",
      metrics: ["17% satisfaction boost", "80% automation", "3-person team reduction"],
      industry: "Software"
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
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <CheckCircle className="w-4 h-4" />
            <span>Join 500+ businesses saving $8,000+ monthly</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Real Results from Real Businesses
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how companies like yours are automating customer service and achieving incredible ROI
          </p>
        </motion.div>

        {/* Testimonials with Video Preview */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Video Testimonial Preview */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-gray-900 to-black relative flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF4A00]/20 to-[#FF6B1A]/20"></div>
                <div className="text-center z-10">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform cursor-pointer">
                    <Play className="w-8 h-8 text-[#FF4A00] ml-1" />
                  </div>
                  <p className="text-white font-semibold">Watch Customer Stories</p>
                </div>
                <div className="absolute top-4 right-4 bg-red-500 w-3 h-3 rounded-full animate-pulse"></div>
                <div className="absolute bottom-4 left-4 text-white text-xs font-mono bg-black/50 px-2 py-1 rounded">
                  ▶ CLIENT TESTIMONIALS • 3:30
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2">See Real Client Results</h3>
                <p className="text-gray-600 text-sm">Watch how our clients achieved 60% cost savings and 10x faster response times</p>
              </div>
            </div>
          </motion.div>

          {/* Rotating Testimonials */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
                <span className="ml-2 text-sm text-gray-600">Verified Review</span>
              </div>
              
              <blockquote className="text-lg text-gray-700 mb-6 leading-relaxed">
                "{testimonials[activeTestimonial].quote}"
              </blockquote>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#FF4A00] rounded-full flex items-center justify-center text-white font-bold">
                    {testimonials[activeTestimonial].avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonials[activeTestimonial].author}</div>
                    <div className="text-sm text-gray-600">{testimonials[activeTestimonial].title}</div>
                    <div className="text-sm text-[#FF4A00] font-medium">{testimonials[activeTestimonial].company}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{testimonials[activeTestimonial].savings}</div>
                  <div className="text-sm text-gray-600">Monthly Savings</div>
                </div>
              </div>
            </div>

            {/* Testimonial Navigation */}
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    activeTestimonial === index ? 'bg-[#FF4A00] w-8' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Case Studies */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-center mb-12">Featured Case Studies</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {caseStudies.map((study, index) => (
              <div key={study.title} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{study.title}</h4>
                    <p className="text-gray-600">{study.subtitle}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    {study.industry}
                  </span>
                </div>
                <div className="space-y-2 mb-6">
                  {study.metrics.map((metric, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">{metric}</span>
                    </div>
                  ))}
                </div>
                <button className="text-[#FF4A00] font-semibold text-sm flex items-center space-x-1 hover:underline">
                  <span>Read Full Case Study</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pricing Transparency & Risk Reversal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-r from-[#FF4A00] to-[#FF6B1A] rounded-3xl p-8 text-white text-center"
        >
          <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Customer Service?</h3>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="space-y-2">
              <div className="text-2xl font-bold">$2,500/month</div>
              <div className="text-orange-100">Starting Price</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold">320% ROI</div>
              <div className="text-orange-100">Average Return</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold">30 Days</div>
              <div className="text-orange-100">Typical Breakeven</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-8 text-sm">
            <div className="flex items-center justify-center space-x-2 bg-white/20 rounded-lg p-3">
              <Shield className="w-4 h-4" />
              <span>30-day money-back guarantee</span>
            </div>
            <div className="flex items-center justify-center space-x-2 bg-white/20 rounded-lg p-3">
              <Clock className="w-4 h-4" />
              <span>Setup in 24 hours or we'll do it free</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-[#FF4A00] px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all inline-flex items-center space-x-2">
              <span>Start Your Free Trial</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="border border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all">
              Book Live Demo
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}