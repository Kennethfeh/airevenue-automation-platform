'use client'

import React, { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Play, Zap, Users, TrendingUp, Clock, Star } from 'lucide-react'

export const ZapierHero: React.FC = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [currentStat, setCurrentStat] = useState(0)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, -50])

  const stats = [
    { value: '$8,000', label: 'Average Monthly Savings' },
    { value: '60%', label: 'Cost Reduction' },
    { value: '30 sec', label: 'Response Time' },
    { value: '500+', label: 'Happy Clients' }
  ]

  const trustedApps = [
    { name: 'Zendesk', color: '#03363D' },
    { name: 'Intercom', color: '#338DF1' },
    { name: 'Shopify', color: '#95BF47' },
    { name: 'Salesforce', color: '#00A1E0' },
    { name: 'HubSpot', color: '#FF7A59' },
    { name: 'Slack', color: '#4A154B' },
    { name: 'Microsoft Teams', color: '#6264A7' },
    { name: 'Gmail', color: '#EA4335' }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-[#FF4A00] via-[#FF6B1A] to-[#FF8533] overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          style={{ y }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: useTransform(scrollY, [0, 500], [0, -30]) }}
          className="absolute top-60 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 right-20 w-4 h-4 bg-white/20 rounded-full"
        />
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-40 left-20 w-6 h-6 bg-white/30 rounded-full"
        />
      </div>

      <div className="relative container-xl pt-24 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium mb-8"
            >
              <Zap className="w-4 h-4" />
              <span>Trusted by 500+ businesses</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              Automate Customer Service
              <br />
              <span className="text-yellow-200">Across All Channels</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl mb-8 text-orange-100 leading-relaxed max-w-2xl"
            >
              Connect your customer service tools and let AI handle 80% of inquiries instantly. 
              <strong className="text-white"> Average business saves $8,000+ monthly.</strong>
            </motion.p>

            {/* Dynamic Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 inline-block">
                <motion.div
                  key={currentStat}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-yellow-200">
                    {stats[currentStat].value}
                  </div>
                  <div className="text-sm text-orange-100">
                    {stats[currentStat].label}
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 mb-8"
            >
              <button className="bg-white text-[#FF4A00] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 inline-flex items-center space-x-2 min-w-[200px] justify-center">
                <span>Start Automating Free</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button 
                onClick={() => setIsVideoPlaying(true)}
                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/30 transition-all inline-flex items-center space-x-2 min-w-[200px] justify-center"
              >
                <Play className="w-5 h-5" />
                <span>Watch 2-min Demo</span>
              </button>
            </motion.div>

            {/* Free Trial Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center space-x-4 text-sm text-orange-100"
            >
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-200" />
                <span>Free 14-day trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-yellow-200" />
                <span>Setup in 24 hours</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-yellow-200" />
                <span>No credit card required</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative"
          >
            {/* Main Demo Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden">
              {/* Live Demo Indicator */}
              <div className="absolute top-4 right-4 flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-gray-500 font-medium">Live Demo</span>
              </div>

              {/* Demo Content */}
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Customer Inquiry Automation
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Watch AI handle real customer questions
                  </p>
                </div>

                {/* Workflow Visualization */}
                <div className="space-y-4">
                  <motion.div
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">1</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Customer emails support</div>
                        <div className="text-xs text-gray-600">"Where is my order #12345?"</div>
                      </div>
                    </div>
                  </motion.div>

                  <div className="flex justify-center">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="w-6 h-6 border-2 border-[#FF4A00] border-t-transparent rounded-full"
                    />
                  </div>

                  <motion.div
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">2</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">AI responds instantly</div>
                        <div className="text-xs text-gray-600">"Your order shipped yesterday! Track: XYZ123"</div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* ROI Calculator Preview */}
                <div className="bg-gradient-to-r from-[#FF4A00] to-[#FF6B1A] rounded-lg p-4 text-white text-center">
                  <div className="text-sm mb-2">Your Potential Savings:</div>
                  <div className="text-2xl font-bold">$8,247/month</div>
                  <button className="mt-2 bg-white text-[#FF4A00] px-4 py-1 rounded-full text-xs font-medium hover:bg-gray-50">
                    Calculate Your Savings
                  </button>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-3 border"
            >
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-xs font-medium text-gray-900">60% Cost Reduction</span>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -8, 0], rotate: [0, -3, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-3 border"
            >
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-medium text-gray-900">30s Response Time</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Trust Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-20"
        >
          <div className="text-center mb-8">
            <p className="text-orange-100 text-sm mb-6">
              Trusted by customer service teams at these companies
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-80">
            {trustedApps.map((app, index) => (
              <motion.div
                key={app.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 hover:bg-white/20 transition-all cursor-pointer"
              >
                <span className="text-white font-medium text-sm">{app.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Video Modal */}
      {isVideoPlaying && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsVideoPlaying(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center">
                <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Demo Video Coming Soon</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">See AI Customer Service in Action</h3>
              <button 
                onClick={() => setIsVideoPlaying(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}