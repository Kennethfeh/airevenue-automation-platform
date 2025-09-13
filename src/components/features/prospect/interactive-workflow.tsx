'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mail, MessageSquare, Phone, Users, Zap, ArrowRight, 
  Clock, CheckCircle, Bot, Headphones, BarChart3, Settings
} from 'lucide-react'

export const InteractiveWorkflow: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const channels = [
    { icon: Mail, name: 'Email', color: 'bg-blue-500', count: '847 inquiries' },
    { icon: MessageSquare, name: 'Live Chat', color: 'bg-green-500', count: '1,234 conversations' },
    { icon: Phone, name: 'Phone', color: 'bg-purple-500', count: '456 calls' },
    { icon: Users, name: 'Social Media', color: 'bg-pink-500', count: '623 messages' }
  ]

  const workflowSteps = [
    {
      id: 'trigger',
      title: 'Customer Inquiry Received',
      description: 'From any channel - email, chat, phone, or social media',
      icon: Mail,
      color: 'from-blue-500 to-blue-600',
      details: 'AI instantly captures and categorizes all incoming inquiries'
    },
    {
      id: 'analyze',
      title: 'AI Analyzes Intent',
      description: 'Understanding customer needs in milliseconds',
      icon: Bot,
      color: 'from-purple-500 to-purple-600',
      details: 'Advanced NLP processes context, sentiment, and urgency'
    },
    {
      id: 'route',
      title: 'Smart Routing Decision',
      description: 'Auto-resolve or route to the right human agent',
      icon: Zap,
      color: 'from-orange-500 to-orange-600',
      details: '80% resolved instantly, 20% routed to specialists'
    },
    {
      id: 'respond',
      title: 'Instant Response Sent',
      description: 'Personalized, accurate answers delivered immediately',
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      details: 'Response time: Under 30 seconds vs 4+ hours manual'
    }
  ]

  const integrations = [
    { name: 'Zendesk', logo: 'ZD', color: 'bg-emerald-500' },
    { name: 'Intercom', logo: 'IC', color: 'bg-blue-500' },
    { name: 'Salesforce', logo: 'SF', color: 'bg-cyan-500' },
    { name: 'HubSpot', logo: 'HS', color: 'bg-orange-500' },
    { name: 'Shopify', logo: 'SH', color: 'bg-green-500' },
    { name: 'Slack', logo: 'SL', color: 'bg-purple-500' }
  ]

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setActiveStep((prev) => {
        const next = (prev + 1) % workflowSteps.length
        if (prev === workflowSteps.length - 1) {
          setCompletedSteps([])
        } else {
          setCompletedSteps(current => [...current, prev])
        }
        return next
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [isPlaying, workflowSteps.length])

  const currentStep = workflowSteps[activeStep]
  const StepIcon = currentStep.icon

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container-xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-[#FF4A00]/10 text-[#FF4A00] px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            <span>Interactive Workflow Demo</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            See How AI Handles Customer Inquiries
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Watch the complete automation process - from customer question to instant resolution
          </p>

          {/* Play/Pause Controls */}
          <div className="flex justify-center mb-12">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                isPlaying 
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                  : 'bg-[#FF4A00] text-white hover:bg-[#E8420A]'
              }`}
            >
              {isPlaying ? 'Pause Demo' : 'Play Demo'}
            </button>
          </div>
        </motion.div>

        {/* Channel Sources */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h3 className="text-center text-lg font-semibold text-gray-700 mb-8">
            Incoming Customer Inquiries
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            {channels.map((channel, index) => {
              const ChannelIcon = channel.icon
              return (
                <motion.div
                  key={channel.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-gray-300 transition-all text-center group hover:shadow-lg"
                >
                  <div className={`w-16 h-16 ${channel.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <ChannelIcon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{channel.name}</h4>
                  <p className="text-sm text-gray-600">{channel.count}</p>
                  
                  {/* Pulse animation for active channel */}
                  {activeStep === 0 && (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 border-2 border-[#FF4A00] rounded-2xl"
                    />
                  )}
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Main Workflow */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
          {/* Progress Bar */}
          <div className="flex justify-between items-center mb-12">
            {workflowSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <motion.div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                    completedSteps.includes(index)
                      ? 'bg-green-500 text-white'
                      : activeStep === index
                      ? 'bg-[#FF4A00] text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                  animate={activeStep === index ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {completedSteps.includes(index) ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    index + 1
                  )}
                </motion.div>
                {index < workflowSteps.length - 1 && (
                  <div className="w-20 h-1 mx-4">
                    <div className="w-full h-full bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[#FF4A00] rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ 
                          width: completedSteps.includes(index) ? '100%' : 
                                 activeStep === index ? '50%' : '0%' 
                        }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Current Step Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <div className={`w-24 h-24 bg-gradient-to-br ${currentStep.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                <StepIcon className="w-12 h-12 text-white" />
              </div>
              
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                {currentStep.title}
              </h3>
              
              <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
                {currentStep.description}
              </p>
              
              <div className="bg-gray-50 rounded-xl p-4 max-w-lg mx-auto">
                <p className="text-sm text-gray-700 font-medium">
                  {currentStep.details}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Real-time Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-3 gap-6 mb-8"
          >
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-blue-900">30s</div>
              <div className="text-sm text-blue-700">Avg Response Time</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center">
              <BarChart3 className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-green-900">80%</div>
              <div className="text-sm text-green-700">Auto-Resolved</div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 text-center">
              <Headphones className="w-8 h-8 text-orange-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-orange-900">9.1/10</div>
              <div className="text-sm text-orange-700">Satisfaction Score</div>
            </div>
          </motion.div>

          {/* Integration Display */}
          <div className="border-t border-gray-200 pt-8">
            <h4 className="text-center text-lg font-semibold text-gray-700 mb-6">
              Works with your existing tools
            </h4>
            <div className="flex flex-wrap justify-center items-center gap-4">
              {integrations.map((integration, index) => (
                <motion.div
                  key={integration.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 bg-gray-50 rounded-lg px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  <div className={`w-8 h-8 ${integration.color} rounded text-white text-xs font-bold flex items-center justify-center`}>
                    {integration.logo}
                  </div>
                  <span className="font-medium text-gray-700">{integration.name}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-8">
            <button className="bg-[#FF4A00] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#E8420A] transition-all shadow-lg hover:shadow-xl inline-flex items-center space-x-2">
              <span>Try Interactive Demo</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-sm text-gray-500 mt-3">
              See your own customer service scenarios automated
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}