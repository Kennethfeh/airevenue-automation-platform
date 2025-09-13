'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { 
  Clock, Bot, BarChart3, Shield, Zap, Users, 
  MessageSquare, Phone, Mail, Settings, 
  TrendingUp, CheckCircle, ArrowRight, Play
} from 'lucide-react'

export const ZapierFeaturesGrid: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState(0)
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const mainFeatures = [
    {
      icon: Clock,
      title: '24/7 Instant Responses',
      description: 'Never keep customers waiting with round-the-clock AI support',
      details: 'AI responds in under 30 seconds, 24 hours a day. No more missed inquiries or frustrated customers waiting for business hours.',
      metrics: { primary: '30s', secondary: 'Avg Response Time' },
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      demo: {
        title: 'Live Response Demo',
        steps: ['Customer sends message', 'AI processes inquiry', 'Instant response sent']
      }
    },
    {
      icon: Bot,
      title: 'Advanced AI Intelligence',
      description: 'Powered by GPT-4 with custom training on your business data',
      details: 'Our AI understands context, sentiment, and intent. Handles complex queries with human-like comprehension and accuracy.',
      metrics: { primary: '92%', secondary: 'Accuracy Rate' },
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      demo: {
        title: 'AI Understanding Demo',
        steps: ['Complex query received', 'AI analyzes context', 'Accurate response generated']
      }
    },
    {
      icon: BarChart3,
      title: 'Real-Time Analytics',
      description: 'Track performance, costs, and customer satisfaction in real-time',
      details: 'Comprehensive dashboard shows cost savings, response times, resolution rates, and customer satisfaction metrics.',
      metrics: { primary: '$8.2K', secondary: 'Avg Monthly Savings' },
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      demo: {
        title: 'Dashboard Preview',
        steps: ['Live metrics tracking', 'Cost analysis', 'Performance insights']
      }
    }
  ]

  const supportFeatures = [
    {
      icon: MessageSquare,
      title: 'Multi-Channel Support',
      description: 'Email, chat, social media, and phone - all in one platform',
      stat: '6 Channels'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'SOC 2 compliant with bank-level encryption',
      stat: '99.9% Uptime'
    },
    {
      icon: Settings,
      title: 'Easy Integration',
      description: 'Connect with your existing tools in minutes',
      stat: '100+ Apps'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Seamless handoff between AI and human agents',
      stat: 'Smart Routing'
    },
    {
      icon: TrendingUp,
      title: 'Continuous Learning',
      description: 'AI improves with every interaction',
      stat: 'Auto-Improve'
    },
    {
      icon: Phone,
      title: 'Voice Support',
      description: 'Handle phone calls with AI voice assistants',
      stat: 'Coming Soon'
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % mainFeatures.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const activeMainFeature = mainFeatures[activeFeature]
  const ActiveIcon = activeMainFeature.icon

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container-xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-[#FF4A00]/10 text-[#FF4A00] px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            <span>Powerful Features</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything you need to automate
            <br />
            customer service
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Built for modern businesses who want to reduce costs while improving customer experience
          </p>
        </motion.div>

        {/* Main Feature Showcase */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Feature Demo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-2 lg:order-1"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {activeMainFeature.demo.title}
                </h3>
                <div className="flex space-x-2">
                  {mainFeatures.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveFeature(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        activeFeature === index ? 'bg-[#FF4A00] w-6' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {activeMainFeature.demo.steps.map((step, index) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className={`flex items-center space-x-4 p-4 rounded-lg transition-all ${
                      activeFeature === 0 ? 'bg-blue-50 border border-blue-200' :
                      activeFeature === 1 ? 'bg-purple-50 border border-purple-200' :
                      'bg-green-50 border border-green-200'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm bg-gradient-to-r ${activeMainFeature.color}`}>
                      {index + 1}
                    </div>
                    <span className="text-gray-700 font-medium">{step}</span>
                    {index === activeMainFeature.demo.steps.length - 1 && (
                      <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                    )}
                  </motion.div>
                ))}
              </div>

              <div className={`mt-6 p-4 rounded-lg ${activeMainFeature.bgColor} ${activeMainFeature.borderColor} border`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-3xl font-bold bg-gradient-to-r ${activeMainFeature.color} bg-clip-text text-transparent`}>
                      {activeMainFeature.metrics.primary}
                    </div>
                    <div className="text-sm text-gray-600">{activeMainFeature.metrics.secondary}</div>
                  </div>
                  <button className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-[#FF4A00] hover:bg-gray-50 transition-colors">
                    <Play className="w-5 h-5 ml-0.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Feature Selection */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="order-1 lg:order-2 space-y-6"
          >
            {mainFeatures.map((feature, index) => {
              const FeatureIcon = feature.icon
              const isActive = activeFeature === index
              
              return (
                <motion.div
                  key={feature.title}
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  onClick={() => setActiveFeature(index)}
                  className={`p-6 rounded-2xl cursor-pointer transition-all ${
                    isActive 
                      ? `bg-white shadow-xl border-2 ${feature.borderColor}` 
                      : 'bg-white/50 border-2 border-transparent hover:bg-white hover:shadow-lg'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r ${feature.color} text-white`}>
                      <FeatureIcon className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className={`text-gray-600 transition-all ${
                        isActive || hoveredFeature === index ? 'mb-3' : ''
                      }`}>
                        {feature.description}
                      </p>
                      
                      {(isActive || hoveredFeature === index) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-sm text-gray-500 leading-relaxed"
                        >
                          {feature.details}
                        </motion.div>
                      )}
                    </div>

                    <ArrowRight className={`w-5 h-5 transition-all ${
                      isActive ? 'text-[#FF4A00] transform rotate-90' : 'text-gray-400'
                    }`} />
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* Supporting Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Plus everything else you need
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportFeatures.map((feature, index) => {
              const FeatureIcon = feature.icon
              
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-[#FF4A00] group-hover:text-white transition-all">
                      <FeatureIcon className="w-6 h-6 text-gray-600 group-hover:text-white" />
                    </div>
                    <span className="text-xs font-medium text-[#FF4A00] bg-[#FF4A00]/10 px-2 py-1 rounded-full">
                      {feature.stat}
                    </span>
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-[#FF4A00] to-[#FF6B1A] rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to see these features in action?
            </h3>
            <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
              Get a personalized demo with your actual customer service scenarios
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-[#FF4A00] px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-lg">
                Book Live Demo
              </button>
              <button className="border border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all">
                Start Free Trial
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}