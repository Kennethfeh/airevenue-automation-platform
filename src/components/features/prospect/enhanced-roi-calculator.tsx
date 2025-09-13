'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calculator, DollarSign, Users, Clock, TrendingUp, 
  ArrowRight, Sparkles, Award, CheckCircle, Zap
} from 'lucide-react'

export const EnhancedROICalculator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    monthlyTickets: 1000,
    avgResponseTime: 4,
    agentCost: 3500,
    supportAgents: 3,
    ticketValue: 50,
    industry: 'ecommerce'
  })
  const [isCalculating, setIsCalculating] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const steps = [
    {
      title: 'Tell us about your support volume',
      description: 'How many customer inquiries do you handle monthly?',
      field: 'monthlyTickets',
      type: 'slider',
      min: 100,
      max: 10000,
      step: 100,
      suffix: ' tickets/month',
      icon: Users
    },
    {
      title: 'What\'s your current response time?',
      description: 'Average time from inquiry to first response',
      field: 'avgResponseTime',
      type: 'slider',
      min: 0.5,
      max: 24,
      step: 0.5,
      suffix: ' hours',
      icon: Clock
    },
    {
      title: 'Support team details',
      description: 'Current support team size and costs',
      field: 'supportAgents',
      type: 'slider',
      min: 1,
      max: 50,
      step: 1,
      suffix: ' agents',
      secondaryField: 'agentCost',
      secondaryMin: 2000,
      secondaryMax: 8000,
      secondaryStep: 500,
      secondarySuffix: '/month per agent',
      icon: DollarSign
    },
    {
      title: 'What\'s your industry?',
      description: 'Help us personalize your savings calculation',
      field: 'industry',
      type: 'select',
      options: [
        { value: 'ecommerce', label: 'E-commerce', multiplier: 1.2 },
        { value: 'saas', label: 'SaaS/Software', multiplier: 1.4 },
        { value: 'healthcare', label: 'Healthcare', multiplier: 1.1 },
        { value: 'finance', label: 'Finance', multiplier: 1.3 },
        { value: 'retail', label: 'Retail', multiplier: 1.0 },
        { value: 'other', label: 'Other', multiplier: 1.0 }
      ],
      icon: TrendingUp
    }
  ]

  const currentStepData = steps[currentStep]
  const StepIcon = currentStepData.icon

  // Calculate ROI
  const calculateROI = () => {
    const { monthlyTickets, avgResponseTime, agentCost, supportAgents, industry } = formData
    
    const industryOption = steps[3].options?.find(opt => opt.value === industry)
    const multiplier = industryOption?.multiplier || 1.0
    
    // Current costs
    const currentMonthlyCost = agentCost * supportAgents
    const currentAnnualCost = currentMonthlyCost * 12
    
    // AI Platform costs (our pricing)
    const aiMonthlyCost = monthlyTickets <= 5000 ? 2500 : 
                         monthlyTickets <= 15000 ? 4500 : 7500
    const aiAnnualCost = aiMonthlyCost * 12
    
    // Efficiency gains
    const automationRate = Math.min(0.85, 0.6 + (monthlyTickets / 20000))
    const timeReduction = Math.max(0.9, 1 - (avgResponseTime / 24))
    const agentReduction = Math.floor(supportAgents * automationRate)
    
    // Savings calculation
    const savedAgentCosts = agentReduction * agentCost * 12
    const totalSavings = savedAgentCosts * multiplier
    const netSavings = totalSavings - aiAnnualCost
    const roiPercentage = ((netSavings / aiAnnualCost) * 100)
    const paybackMonths = Math.ceil(aiAnnualCost / (totalSavings / 12))
    
    return {
      currentMonthlyCost,
      currentAnnualCost,
      aiMonthlyCost,
      aiAnnualCost,
      totalSavings,
      netSavings,
      roiPercentage,
      paybackMonths,
      automationRate: automationRate * 100,
      timeReduction: timeReduction * 100,
      agentReduction,
      newResponseTime: avgResponseTime * (1 - timeReduction),
      industry: industryOption?.label || 'Other'
    }
  }

  const results = calculateROI()

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsCalculating(true)
      setTimeout(() => {
        setIsCalculating(false)
        setShowResults(true)
      }, 2000)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateFormData = (field: string, value: number | string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleReset = () => {
    setCurrentStep(0)
    setShowResults(false)
    setFormData({
      monthlyTickets: 1000,
      avgResponseTime: 4,
      agentCost: 3500,
      supportAgents: 3,
      ticketValue: 50,
      industry: 'ecommerce'
    })
  }

  if (isCalculating) {
    return (
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="bg-white rounded-3xl p-12 shadow-2xl">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-[#FF4A00] border-t-transparent rounded-full mx-auto mb-6"
              />
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Calculating Your ROI...
              </h3>
              
              <div className="space-y-3 text-gray-600">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  ✓ Analyzing your support volume
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  ✓ Calculating automation potential
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  ✓ Personalizing for {results.industry} industry
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  if (showResults) {
    return (
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container-xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Results Header */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Award className="w-10 h-10 text-white" />
              </motion.div>
              
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Your Personalized ROI Report
              </h2>
              <p className="text-xl text-gray-600">
                Based on {formData.monthlyTickets.toLocaleString()} monthly tickets in {results.industry}
              </p>
            </div>

            {/* Main Results Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200 text-center"
              >
                <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-green-600 mb-2">
                  ${results.netSavings.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Annual Net Savings</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200 text-center"
              >
                <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {results.roiPercentage.toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">Return on Investment</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200 text-center"
              >
                <Clock className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {results.paybackMonths} mo
                </div>
                <div className="text-sm text-gray-600">Payback Period</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200 text-center"
              >
                <Zap className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {results.automationRate.toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">Tickets Automated</div>
              </motion.div>
            </div>

            {/* Detailed Breakdown */}
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* Current vs Future */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-2xl p-8 shadow-xl"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Current vs Future State</h3>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg border border-red-200">
                    <div>
                      <div className="font-semibold text-red-900">Current Monthly Cost</div>
                      <div className="text-sm text-red-700">{formData.supportAgents} agents @ ${formData.agentCost}/month</div>
                    </div>
                    <div className="text-2xl font-bold text-red-600">
                      ${results.currentMonthlyCost.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <div>
                      <div className="font-semibold text-green-900">Future Monthly Cost</div>
                      <div className="text-sm text-green-700">AI platform + {formData.supportAgents - results.agentReduction} agents</div>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      ${(results.aiMonthlyCost + (formData.supportAgents - results.agentReduction) * formData.agentCost).toLocaleString()}
                    </div>
                  </div>

                  <div className="text-center p-4 bg-gradient-to-r from-[#FF4A00] to-[#FF6B1A] rounded-lg text-white">
                    <div className="text-sm">Monthly Savings</div>
                    <div className="text-3xl font-bold">
                      ${(results.totalSavings / 12).toLocaleString()}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Performance Improvements */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-2xl p-8 shadow-xl"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Performance Improvements</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Response Time</span>
                    <div className="text-right">
                      <div className="text-sm text-red-600">{formData.avgResponseTime}h → <span className="text-green-600">{results.newResponseTime.toFixed(1)}h</span></div>
                      <div className="text-xs text-gray-500">{results.timeReduction.toFixed(0)}% faster</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Automation Rate</span>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">{results.automationRate.toFixed(0)}%</div>
                      <div className="text-xs text-gray-500">of tickets handled by AI</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Agent Efficiency</span>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">3x</div>
                      <div className="text-xs text-gray-500">more productive</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Customer Satisfaction</span>
                    <div className="text-right">
                      <div className="text-lg font-bold text-purple-600">+28%</div>
                      <div className="text-xs text-gray-500">average improvement</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-r from-[#FF4A00] to-[#FF6B1A] rounded-2xl p-8 text-white text-center"
            >
              <h3 className="text-2xl font-bold mb-4">
                Ready to achieve these results?
              </h3>
              <p className="text-orange-100 mb-8 max-w-2xl mx-auto">
                Join 500+ businesses already saving money and improving customer satisfaction with AI automation
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <button className="bg-white text-[#FF4A00] px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-lg">
                  Book Free Demo
                </button>
                <button className="border border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all">
                  Download Report (PDF)
                </button>
              </div>

              <button
                onClick={handleReset}
                className="text-orange-200 underline text-sm hover:text-white transition-colors"
              >
                Recalculate with different numbers
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="container-xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-[#FF4A00]/10 text-[#FF4A00] px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Calculator className="w-4 h-4" />
            <span>ROI Calculator</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Calculate your exact savings
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how much money you could save monthly with AI customer service automation
          </p>
        </motion.div>

        {/* Calculator Form */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
            {/* Progress Bar */}
            <div className="flex justify-between items-center mb-8">
              {steps.map((_, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                    index <= currentStep ? 'bg-[#FF4A00] text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-20 h-1 mx-2">
                      <div className="w-full h-full bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-[#FF4A00] rounded-full"
                          initial={{ width: '0%' }}
                          animate={{ width: index < currentStep ? '100%' : '0%' }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Current Step */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="text-center mb-8"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#FF4A00] to-[#FF6B1A] rounded-full flex items-center justify-center mx-auto mb-6">
                  <StepIcon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {currentStepData.title}
                </h3>
                <p className="text-gray-600 mb-8">
                  {currentStepData.description}
                </p>

                {/* Form Input */}
                <div className="max-w-md mx-auto">
                  {currentStepData.type === 'slider' && (
                    <div className="space-y-4">
                      <div className="text-center">
                        <span className="text-4xl font-bold text-[#FF4A00]">
                          {currentStepData.field === 'avgResponseTime' 
                            ? formData[currentStepData.field]
                            : formData[currentStepData.field].toLocaleString()
                          }
                          {currentStepData.suffix}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={currentStepData.min}
                        max={currentStepData.max}
                        step={currentStepData.step}
                        value={formData[currentStepData.field]}
                        onChange={(e) => updateFormData(currentStepData.field, parseFloat(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{currentStepData.min}{currentStepData.suffix}</span>
                        <span>{currentStepData.max}{currentStepData.suffix}</span>
                      </div>

                      {/* Secondary Field */}
                      {currentStepData.secondaryField && (
                        <div className="mt-6 space-y-4">
                          <div className="text-center">
                            <span className="text-2xl font-bold text-gray-700">
                              ${formData[currentStepData.secondaryField].toLocaleString()}
                              {currentStepData.secondarySuffix}
                            </span>
                          </div>
                          <input
                            type="range"
                            min={currentStepData.secondaryMin}
                            max={currentStepData.secondaryMax}
                            step={currentStepData.secondaryStep}
                            value={formData[currentStepData.secondaryField]}
                            onChange={(e) => updateFormData(currentStepData.secondaryField!, parseInt(e.target.value))}
                            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {currentStepData.type === 'select' && currentStepData.options && (
                    <div className="grid grid-cols-2 gap-4">
                      {currentStepData.options.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => updateFormData(currentStepData.field, option.value)}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            formData[currentStepData.field] === option.value
                              ? 'border-[#FF4A00] bg-[#FF4A00]/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="font-semibold text-gray-900">{option.label}</div>
                          {option.multiplier !== 1.0 && (
                            <div className="text-xs text-gray-500 mt-1">
                              {option.multiplier > 1.0 ? '+' : ''}{((option.multiplier - 1) * 100).toFixed(0)}% industry bonus
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Live Preview */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 mb-8"
            >
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">Estimated Annual Savings</div>
                <div className="text-3xl font-bold text-green-600">
                  ${results.netSavings.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {results.roiPercentage.toFixed(0)}% ROI in {results.paybackMonths} months
                </div>
              </div>
            </motion.div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-[#FF4A00] text-white rounded-lg font-semibold hover:bg-[#E8420A] transition-all flex items-center space-x-2"
              >
                <span>{currentStep < steps.length - 1 ? 'Next' : 'Calculate ROI'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          background: #FF4A00;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          background: #FF4A00;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </section>
  )
}