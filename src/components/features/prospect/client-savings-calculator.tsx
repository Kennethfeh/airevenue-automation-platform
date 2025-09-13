'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calculator, DollarSign, TrendingUp, Users, Clock, Zap } from 'lucide-react'

interface SavingsCalculation {
  currentMonthlyCosts: number
  aiMonthlyCosts: number
  monthlySavings: number
  yearlySavings: number
  paybackPeriod: number
  efficiencyGain: number
  responseTimeImprovement: number
}

export const ROICalculator: React.FC = () => {
  const [businessType, setBusinessType] = useState('ecommerce')
  const [monthlyInquiries, setMonthlyInquiries] = useState(1500)
  const [avgHandlingTime, setAvgHandlingTime] = useState(8)
  const [hourlyRate, setHourlyRate] = useState(25)
  const [currentResponseTime, setCurrentResponseTime] = useState(4)
  const [calculation, setCalculation] = useState<SavingsCalculation | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const businessTypes = [
    { value: 'ecommerce', label: 'E-commerce', multiplier: 1.2 },
    { value: 'saas', label: 'SaaS', multiplier: 1.3 },
    { value: 'healthcare', label: 'Healthcare', multiplier: 1.5 },
    { value: 'fintech', label: 'FinTech', multiplier: 1.4 },
    { value: 'education', label: 'Education', multiplier: 1.1 },
    { value: 'manufacturing', label: 'Manufacturing', multiplier: 1.2 },
  ]

  const calculateSavings = () => {
    setIsCalculating(true)
    
    setTimeout(() => {
      const typeMultiplier = businessTypes.find(t => t.value === businessType)?.multiplier || 1.2
      
      // Current costs calculation
      const monthlyHours = (monthlyInquiries * avgHandlingTime) / 60 // Convert minutes to hours
      const currentMonthlyCosts = monthlyHours * hourlyRate * typeMultiplier
      
      // AI automation reduces handling time by 80% and handles 70% of inquiries automatically
      const automatedInquiries = monthlyInquiries * 0.7 // 70% handled by AI
      const remainingInquiries = monthlyInquiries * 0.3 // 30% still need human
      const reducedHandlingTime = avgHandlingTime * 0.5 // 50% faster for remaining inquiries
      
      // New costs with AI
      const aiServiceCost = 299 + (monthlyInquiries * 0.02) // Base cost + per inquiry
      const reducedHumanHours = (remainingInquiries * reducedHandlingTime) / 60
      const humanCostWithAI = reducedHumanHours * hourlyRate
      const aiMonthlyCosts = aiServiceCost + humanCostWithAI
      
      // Savings calculation
      const monthlySavings = Math.max(0, currentMonthlyCosts - aiMonthlyCosts)
      const yearlySavings = monthlySavings * 12
      const paybackPeriod = aiServiceCost / monthlySavings
      
      // Performance improvements
      const efficiencyGain = ((currentMonthlyCosts - aiMonthlyCosts) / currentMonthlyCosts) * 100
      const responseTimeImprovement = ((currentResponseTime - 0.5) / currentResponseTime) * 100 // AI responds in 30 seconds

      setCalculation({
        currentMonthlyCosts,
        aiMonthlyCosts,
        monthlySavings,
        yearlySavings,
        paybackPeriod: Math.max(0.1, paybackPeriod),
        efficiencyGain,
        responseTimeImprovement
      })
      
      setIsCalculating(false)
    }, 1500)
  }

  useEffect(() => {
    calculateSavings()
  }, [businessType, monthlyInquiries, avgHandlingTime, hourlyRate, currentResponseTime])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercentage = (percent: number) => {
    return `${percent.toFixed(0)}%`
  }

  return (
    <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-6">
        <div className="flex items-center space-x-3">
          <Calculator className="w-8 h-8 text-white" />
          <h3 className="text-2xl font-bold text-white">
            Cost Savings Calculator
          </h3>
        </div>
        <p className="text-primary-100 mt-2">
          Discover how much AI automation could save your business
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 p-8">
        {/* Input Panel */}
        <div className="space-y-6">
          <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Your Current Situation
          </h4>

          {/* Business Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Industry
            </label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="w-full input"
            >
              {businessTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Monthly Inquiries */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Monthly Customer Inquiries
            </label>
            <input
              type="range"
              min="100"
              max="10000"
              step="100"
              value={monthlyInquiries}
              onChange={(e) => setMonthlyInquiries(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
              <span>100</span>
              <span className="font-semibold text-primary-600">{monthlyInquiries.toLocaleString()}</span>
              <span>10,000</span>
            </div>
          </div>

          {/* Average Handling Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Average Handling Time (minutes)
            </label>
            <input
              type="range"
              min="2"
              max="30"
              step="1"
              value={avgHandlingTime}
              onChange={(e) => setAvgHandlingTime(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
              <span>2 min</span>
              <span className="font-semibold text-warning-600">{avgHandlingTime} min</span>
              <span>30 min</span>
            </div>
          </div>

          {/* Hourly Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Average Hourly Rate
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-full pl-10 input"
                placeholder="25"
              />
            </div>
          </div>

          {/* Current Response Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Current Average Response Time (hours)
            </label>
            <input
              type="range"
              min="0.5"
              max="24"
              step="0.5"
              value={currentResponseTime}
              onChange={(e) => setCurrentResponseTime(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
              <span>0.5h</span>
              <span className="font-semibold text-warning-600">{currentResponseTime}h</span>
              <span>24h</span>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6">
          <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Your Potential Savings
          </h4>

          {isCalculating ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : calculation ? (
            <div className="space-y-6">
              {/* Monthly Savings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-success-50 dark:bg-success-900/20 rounded-xl p-4 border border-success-200 dark:border-success-800"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-6 h-6 text-success-600" />
                    <div>
                      <p className="text-sm text-success-700 dark:text-success-300">Monthly Savings</p>
                      <p className="text-2xl font-bold text-success-800 dark:text-success-200">
                        {formatCurrency(calculation.monthlySavings)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-success-600 dark:text-success-400">Efficiency Gain</p>
                    <p className="text-lg font-semibold text-success-700 dark:text-success-300">
                      {formatPercentage(calculation.efficiencyGain)}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Yearly Savings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4 border border-primary-200 dark:border-primary-800"
              >
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-6 h-6 text-primary-600" />
                  <div>
                    <p className="text-sm text-primary-700 dark:text-primary-300">Yearly Savings</p>
                    <p className="text-2xl font-bold text-primary-800 dark:text-primary-200">
                      {formatCurrency(calculation.yearlySavings)}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Cost Breakdown */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white dark:bg-gray-900 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-4 h-4 text-gray-600" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">Current Costs</p>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(calculation.currentMonthlyCosts)}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white dark:bg-gray-900 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="w-4 h-4 text-primary-600" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">With AI</p>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(calculation.aiMonthlyCosts)}
                  </p>
                </motion.div>
              </div>

              {/* Response Time Improvement */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center"
              >
                <Clock className="w-6 h-6 text-gray-600 dark:text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Response Time Improvement</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatPercentage(calculation.responseTimeImprovement)} faster
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  From {currentResponseTime}h to 30 seconds
                </p>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="pt-4 border-t border-gray-200 dark:border-gray-600"
              >
                <button className="w-full btn btn-primary btn-lg text-base font-semibold hover-lift">
                  Get Your Detailed Savings Report
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                  Free analysis with implementation roadmap
                </p>
              </motion.div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}