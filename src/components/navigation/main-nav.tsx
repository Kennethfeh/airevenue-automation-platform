'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Menu, X } from 'lucide-react'

export const MainNav: React.FC = () => {
  const [isProductsOpen, setIsProductsOpen] = useState(false)
  const [isResourcesOpen, setIsResourcesOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const productsItems = [
    { name: 'AI Customer Service', href: '/products/customer-service', description: 'Automate support with AI' },
    { name: 'Workflow Automation', href: '/products/workflow-automation', description: 'Streamline business processes' },
    { name: 'Custom Integrations', href: '/products/integrations', description: 'Connect your tools seamlessly' },
  ]

  const resourcesItems = [
    { name: 'Blog', href: '/blog', description: 'Latest automation insights' },
    { name: 'ROI Calculator', href: '/roi-calculator', description: 'Calculate your savings' },
    { name: 'Automation Guide', href: '/automation-guide', description: 'Step-by-step implementation' },
    { name: 'Webinars', href: '/webinars', description: 'Live training sessions' },
  ]

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container-xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-[#FF4A00] to-[#FF6B1A] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AR</span>
              </div>
              <span className="text-xl font-bold text-gray-900">AI Revenue</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-[#FF4A00] font-medium transition-colors">
              Home
            </Link>

            {/* Products Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setIsProductsOpen(true)}
                onMouseLeave={() => setIsProductsOpen(false)}
                className="flex items-center space-x-1 text-gray-700 hover:text-[#FF4A00] font-medium transition-colors"
              >
                <span>Products</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              <AnimatePresence>
                {isProductsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    onMouseEnter={() => setIsProductsOpen(true)}
                    onMouseLeave={() => setIsProductsOpen(false)}
                    className="absolute top-full left-0 mt-2 w-80 max-w-[90vw] bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50"
                  >
                    <div className="space-y-3">
                      {productsItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-600">{item.description}</div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/pricing" className="text-gray-700 hover:text-[#FF4A00] font-medium transition-colors">
              Pricing
            </Link>

            <Link href="/case-studies" className="text-gray-700 hover:text-[#FF4A00] font-medium transition-colors">
              Case Studies
            </Link>

            {/* Resources Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setIsResourcesOpen(true)}
                onMouseLeave={() => setIsResourcesOpen(false)}
                className="flex items-center space-x-1 text-gray-700 hover:text-[#FF4A00] font-medium transition-colors"
              >
                <span>Resources</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              <AnimatePresence>
                {isResourcesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    onMouseEnter={() => setIsResourcesOpen(true)}
                    onMouseLeave={() => setIsResourcesOpen(false)}
                    className="absolute top-full left-0 mt-2 w-80 max-w-[90vw] bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50"
                  >
                    <div className="space-y-3">
                      {resourcesItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-600">{item.description}</div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/about" className="text-gray-700 hover:text-[#FF4A00] font-medium transition-colors">
              About Us
            </Link>

            <Link href="/contact" className="text-gray-700 hover:text-[#FF4A00] font-medium transition-colors">
              Contact
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Login Link */}
            <Link href="/login" className="text-gray-700 hover:text-[#FF4A00] font-medium transition-colors">
              Login
            </Link>

            {/* Book Demo CTA */}
            <Link href="/book-demo">
              <button className="bg-gradient-to-r from-[#FF4A00] to-[#FF6B1A] text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all">
                Book Demo
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-[#FF4A00] transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 py-4"
            >
              <div className="space-y-4">
                <Link href="/" className="block text-gray-700 hover:text-[#FF4A00] font-medium">
                  Home
                </Link>
                <div className="space-y-2">
                  <div className="font-medium text-gray-900">Products</div>
                  {productsItems.map((item) => (
                    <Link key={item.name} href={item.href} className="block pl-4 text-gray-600 hover:text-[#FF4A00]">
                      {item.name}
                    </Link>
                  ))}
                </div>
                <Link href="/pricing" className="block text-gray-700 hover:text-[#FF4A00] font-medium">
                  Pricing
                </Link>
                <Link href="/case-studies" className="block text-gray-700 hover:text-[#FF4A00] font-medium">
                  Case Studies
                </Link>
                <div className="space-y-2">
                  <div className="font-medium text-gray-900">Resources</div>
                  {resourcesItems.map((item) => (
                    <Link key={item.name} href={item.href} className="block pl-4 text-gray-600 hover:text-[#FF4A00]">
                      {item.name}
                    </Link>
                  ))}
                </div>
                <Link href="/about" className="block text-gray-700 hover:text-[#FF4A00] font-medium">
                  About Us
                </Link>
                <Link href="/contact" className="block text-gray-700 hover:text-[#FF4A00] font-medium">
                  Contact
                </Link>
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <Link href="/login" className="block text-gray-700 hover:text-[#FF4A00] font-medium">
                    Login
                  </Link>
                  <Link href="/book-demo" className="block">
                    <button className="w-full bg-gradient-to-r from-[#FF4A00] to-[#FF6B1A] text-white px-6 py-2 rounded-lg font-semibold">
                      Book Demo
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}