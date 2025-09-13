'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, Filter, Star, Users, Zap, ArrowRight, 
  CheckCircle, ExternalLink, Sparkles, TrendingUp, Award
} from 'lucide-react'

export const IntegrationMarketplace: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [hoveredIntegration, setHoveredIntegration] = useState<string | null>(null)
  const [featuredIndex, setFeaturedIndex] = useState(0)

  const categories = [
    { id: 'all', name: 'All Integrations', count: 100 },
    { id: 'helpdesk', name: 'Help Desk', count: 25 },
    { id: 'crm', name: 'CRM', count: 18 },
    { id: 'ecommerce', name: 'E-commerce', count: 15 },
    { id: 'communication', name: 'Communication', count: 22 },
    { id: 'analytics', name: 'Analytics', count: 12 },
    { id: 'social', name: 'Social Media', count: 8 }
  ]

  const integrations = [
    {
      id: 'zendesk',
      name: 'Zendesk',
      description: 'Complete customer service platform integration',
      category: 'helpdesk',
      logo: 'ZD',
      color: 'bg-emerald-500',
      rating: 4.9,
      users: '2.1K+',
      featured: true,
      setup: '5 min setup',
      features: ['Ticket automation', 'Knowledge base sync', 'Agent handoff', 'Real-time sync'],
      popular: true
    },
    {
      id: 'intercom',
      name: 'Intercom',
      description: 'Conversational relationship platform',
      category: 'helpdesk',
      logo: 'IC',
      color: 'bg-blue-500',
      rating: 4.8,
      users: '1.8K+',
      featured: true,
      setup: '3 min setup',
      features: ['Live chat', 'User segmentation', 'Message automation', 'Product tours']
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      description: 'World\'s #1 CRM platform integration',
      category: 'crm',
      logo: 'SF',
      color: 'bg-cyan-500',
      rating: 4.7,
      users: '3.2K+',
      featured: true,
      setup: '10 min setup',
      features: ['Lead management', 'Opportunity tracking', 'Account sync', 'Custom fields']
    },
    {
      id: 'shopify',
      name: 'Shopify',
      description: 'E-commerce platform for order support',
      category: 'ecommerce',
      logo: 'SH',
      color: 'bg-green-500',
      rating: 4.9,
      users: '1.5K+',
      featured: false,
      setup: '5 min setup',
      features: ['Order tracking', 'Customer data', 'Return processing', 'Inventory sync']
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      description: 'Inbound marketing and sales platform',
      category: 'crm',
      logo: 'HS',
      color: 'bg-orange-500',
      rating: 4.8,
      users: '2.4K+',
      featured: true,
      setup: '7 min setup',
      features: ['Contact management', 'Deal pipeline', 'Email marketing', 'Reporting']
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Team communication and collaboration',
      category: 'communication',
      logo: 'SL',
      color: 'bg-purple-500',
      rating: 4.9,
      users: '4.1K+',
      featured: false,
      setup: '2 min setup',
      features: ['Team alerts', 'Channel notifications', 'Bot integration', 'File sharing']
    },
    {
      id: 'teams',
      name: 'Microsoft Teams',
      description: 'Enterprise communication platform',
      category: 'communication',
      logo: 'MT',
      color: 'bg-indigo-500',
      rating: 4.6,
      users: '1.9K+',
      featured: false,
      setup: '8 min setup',
      features: ['Team collaboration', 'Video calls', 'File integration', 'Enterprise security']
    },
    {
      id: 'gmail',
      name: 'Gmail',
      description: 'Google email platform integration',
      category: 'communication',
      logo: 'GM',
      color: 'bg-red-500',
      rating: 4.8,
      users: '5.2K+',
      featured: false,
      setup: '3 min setup',
      features: ['Email automation', 'Smart replies', 'Label management', 'Thread tracking']
    }
  ]

  const featuredIntegrations = integrations.filter(integration => integration.featured)

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % featuredIntegrations.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [featuredIntegrations.length])

  const currentFeatured = featuredIntegrations[featuredIndex]

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
          <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>100+ Integrations Available</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Connect with the tools you already use
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Seamless integration with your existing customer service, CRM, and business tools
          </p>
        </motion.div>

        {/* Featured Integration Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Featured Integration Info */}
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className={`w-16 h-16 ${currentFeatured.color} rounded-2xl flex items-center justify-center text-white font-bold text-2xl`}>
                    {currentFeatured.logo}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{currentFeatured.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{currentFeatured.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{currentFeatured.users} users</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Zap className="w-4 h-4" />
                        <span>{currentFeatured.setup}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-lg mb-6">
                  {currentFeatured.description}
                </p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {currentFeatured.features.map((feature, index) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-4">
                  <button className="bg-[#FF4A00] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#E8420A] transition-all">
                    Connect Now
                  </button>
                  <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all">
                    View Details
                  </button>
                </div>
              </div>

              {/* Integration Preview */}
              <div className="relative">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 min-h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className={`w-24 h-24 ${currentFeatured.color} rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 shadow-xl`}
                    >
                      {currentFeatured.logo}
                    </motion.div>
                    <div className="text-gray-600 mb-4">Integration Preview</div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm text-gray-500">Connected & Syncing</span>
                    </div>
                  </div>
                </div>

                {/* Floating Connection Lines */}
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-4 -right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white"
                >
                  <CheckCircle className="w-5 h-5" />
                </motion.div>
              </div>
            </div>

            {/* Featured Integration Selector */}
            <div className="flex justify-center mt-8 space-x-2">
              {featuredIntegrations.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setFeaturedIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    featuredIndex === index ? 'bg-[#FF4A00] w-8' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search integrations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF4A00] focus:border-transparent outline-none"
              />
            </div>
            
            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none pl-12 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF4A00] focus:border-transparent outline-none bg-white min-w-[200px]"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.slice(1).map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-[#FF4A00] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Integration Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredIntegrations.map((integration, index) => (
              <motion.div
                key={integration.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onHoverStart={() => setHoveredIntegration(integration.id)}
                onHoverEnd={() => setHoveredIntegration(null)}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all cursor-pointer group relative"
              >
                {/* Popular Badge */}
                {integration.popular && (
                  <div className="absolute -top-2 -right-2 bg-[#FF4A00] text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                    <Award className="w-3 h-3" />
                    <span>Popular</span>
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${integration.color} rounded-xl flex items-center justify-center text-white font-bold text-lg`}>
                    {integration.logo}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-600">{integration.rating}</span>
                  </div>
                </div>

                <h3 className="font-bold text-gray-900 mb-2">{integration.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {integration.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>{integration.users} users</span>
                  <span>{integration.setup}</span>
                </div>

                {/* Hover Details */}
                {hoveredIntegration === integration.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4"
                  >
                    <div className="space-y-1">
                      {integration.features.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span className="text-xs text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-[#FF4A00] hover:text-white transition-all group-hover:bg-[#FF4A00] group-hover:text-white flex items-center justify-center space-x-2">
                  <span>Connect</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 bg-gradient-to-r from-[#FF4A00] to-[#FF6B1A] rounded-2xl p-8 text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-6">
            Can't find your tool? We'll build it for you.
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div>
              <div className="text-3xl font-bold text-yellow-200">100+</div>
              <div className="text-orange-100">Integrations Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-200">24hrs</div>
              <div className="text-orange-100">Custom Integration</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-200">Free</div>
              <div className="text-orange-100">Setup & Support</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-[#FF4A00] px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all">
              Request Integration
            </button>
            <button className="border border-white/30 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all flex items-center space-x-2">
              <span>View All Integrations</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}