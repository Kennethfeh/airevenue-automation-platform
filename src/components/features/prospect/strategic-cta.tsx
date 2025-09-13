'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Calculator, Phone, CheckCircle } from 'lucide-react'

interface StrategicCTAProps {
  variant?: 'primary' | 'calculator' | 'demo' | 'consultation'
  className?: string
}

export const StrategicCTA: React.FC<StrategicCTAProps> = ({ 
  variant = 'primary',
  className = ''
}) => {
  const variants = {
    primary: {
      title: 'Start Saving $8,000+ Monthly Today',
      subtitle: 'Join 500+ businesses already automating their customer service',
      buttonText: 'Get Your Custom Quote',
      icon: ArrowRight,
      color: 'primary'
    },
    calculator: {
      title: 'Calculate Your Exact Savings',
      subtitle: 'See how much you could save with our ROI calculator',
      buttonText: 'Calculate My Savings',
      icon: Calculator,
      color: 'success'
    },
    demo: {
      title: 'See It in Action',
      subtitle: 'Watch a 10-minute demo of AI handling real customer inquiries',
      buttonText: 'Watch Demo',
      icon: ArrowRight,
      color: 'primary'
    },
    consultation: {
      title: 'Speak with an Automation Expert',
      subtitle: 'Get a free consultation to discuss your specific needs',
      buttonText: 'Book Free Consultation',
      icon: Calendar,
      color: 'secondary'
    }
  }

  const config = variants[variant]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`text-center ${className}`}
    >
      <div className={`bg-gradient-to-r ${
        config.color === 'primary' 
          ? 'from-primary-600 to-primary-700' 
          : config.color === 'success'
          ? 'from-success-600 to-success-700'
          : 'from-gray-800 to-gray-900'
      } rounded-2xl p-8 text-white shadow-xl`}>
        <h3 className="text-2xl md:text-3xl font-bold mb-4">
          {config.title}
        </h3>
        <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
          {config.subtitle}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl inline-flex items-center space-x-2 min-w-[200px]">
            <span>{config.buttonText}</span>
            <Icon className="w-5 h-5" />
          </button>
          
          {variant === 'primary' && (
            <div className="flex items-center space-x-2 text-sm opacity-80">
              <CheckCircle className="w-4 h-4" />
              <span>No setup fees for first 100 customers</span>
            </div>
          )}
        </div>
        
        {variant === 'consultation' && (
          <div className="mt-6 flex justify-center items-center space-x-6 text-sm opacity-80">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>15-min call</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Custom ROI analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Implementation roadmap</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Individual CTA components for different sections
export const PrimaryCTA: React.FC<{ className?: string }> = ({ className }) => (
  <StrategicCTA variant="primary" className={className} />
)

export const CalculatorCTA: React.FC<{ className?: string }> = ({ className }) => (
  <StrategicCTA variant="calculator" className={className} />
)

export const DemoCTA: React.FC<{ className?: string }> = ({ className }) => (
  <StrategicCTA variant="demo" className={className} />
)

export const ConsultationCTA: React.FC<{ className?: string }> = ({ className }) => (
  <StrategicCTA variant="consultation" className={className} />
)