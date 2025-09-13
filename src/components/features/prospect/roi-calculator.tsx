'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calculator, DollarSign, TrendingUp, Users, Clock, Target } from 'lucide-react'

interface ROICalculation {
  currentCosts: number
  potentialSavings: number
  revenueIncrease: number
  monthlyROI: number
  yearlyROI: number
  paybackPeriod: number
}

export const ROICalculator: React.FC = () => {
  const [businessType, setBusinessType] = useState('ecommerce')
  const [monthlyVolume, setMonthlyVolume] = useState(1000)
  const [averageTicketValue, setAverageTicketValue] = useState(50)
  const [currentResponseTime, setCurrentResponseTime] = useState(24)
  const [staffCost, setStaffCost] = useState(3500)
  const [calculation, setCalculation] = useState<ROICalculation | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const businessTypes = [
    { value: 'ecommerce', label: 'E-commerce', multiplier: 1.2 },
    { value: 'saas', label: 'SaaS', multiplier: 1.5 },
    { value: 'healthcare', label: 'Healthcare', multiplier: 1.8 },
    { value: 'fintech', label: 'FinTech', multiplier: 2.0 },
    { value: 'education', label: 'Education', multiplier: 1.1 },
    { value: 'real-estate', label: 'Real Estate', multiplier: 1.4 },
  ]

  const calculateROI = () => {
    setIsCalculating(true)
    
    // Simulate API calculation delay
    setTimeout(() => {
      const typeMultiplier = businessTypes.find(t => t.value === businessType)?.multiplier || 1.2
      
      // Calculate current costs
      const currentMonthlyCost = staffCost + (monthlyVolume * 0.5) // Staff + operational costs
      
      // Calculate AI automation benefits
      const responseTimeImprovement = Math.max(0.9, (24 - 0.5) / 24) // 30-second response time
      const satisfactionIncrease = responseTimeImprovement * 0.3 // 30% satisfaction boost
      const conversionIncrease = satisfactionIncrease * 0.25 // 25% conversion boost
      
      // Revenue calculations
      const currentMonthlyRevenue = monthlyVolume * averageTicketValue * typeMultiplier
      const newMonthlyRevenue = currentMonthlyRevenue * (1 + conversionIncrease)
      const revenueIncrease = newMonthlyRevenue - currentMonthlyRevenue
      
      // Cost savings (80% staff cost reduction + operational efficiency)
      const aiMonthlyCost = 2500 // Our platform cost
      const potentialSavings = currentMonthlyCost - aiMonthlyCost
      
      // ROI calculations
      const monthlyROI = revenueIncrease + potentialSavings
      const yearlyROI = monthlyROI * 12
      const paybackPeriod = aiMonthlyCost / monthlyROI
      
      setCalculation({
        currentCosts: currentMonthlyCost,
        potentialSavings,
        revenueIncrease,
        monthlyROI,
        yearlyROI,
        paybackPeriod
      })
      
      setIsCalculating(false)
    }, 1500)
  }

  useEffect(() => {
    calculateROI()
  }, [businessType, monthlyVolume, averageTicketValue, currentResponseTime, staffCost])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-6">
        <div className="flex items-center space-x-3">
          <Calculator className="w-8 h-8 text-white" />
          <h3 className="text-2xl font-bold text-white">
            AI Revenue Calculator
          </h3>
        </div>
        <p className="text-primary-100 mt-2">
          See your exact revenue potential with AI automation
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 p-8">
        {/* Input Panel */}
        <div className="space-y-6">
          <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Your Business Details
          </h4>

          {/* Business Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Business Type
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

          {/* Monthly Volume */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Monthly Customer Interactions
            </label>
            <input
              type="range"
              min="100"
              max="10000"
              step="100"
              value={monthlyVolume}
              onChange={(e) => setMonthlyVolume(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
            />
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
              <span>100</span>
              <span className="font-semibold text-primary-600">{monthlyVolume.toLocaleString()}</span>
              <span>10,000</span>
            </div>
          </div>

          {/* Average Ticket Value */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Average Order Value
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={averageTicketValue}
                onChange={(e) => setAverageTicketValue(Number(e.target.value))}
                className="w-full pl-10 input"
                placeholder="50"
              />
            </div>
          </div>

          {/* Current Response Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Current Response Time (hours)
            </label>
            <input
              type="range"
              min="1"
              max="72"
              step="1"
              value={currentResponseTime}
              onChange={(e) => setCurrentResponseTime(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
              <span>1h</span>
              <span className="font-semibold text-warning-600">{currentResponseTime}h</span>
              <span>72h</span>
            </div>
          </div>

          {/* Staff Cost */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Monthly Staff Costs
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={staffCost}
                onChange={(e) => setStaffCost(Number(e.target.value))}
                className="w-full pl-10 input"
                placeholder="3500"
              />
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6">
          <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Your AI ROI Results
          </h4>

          {isCalculating ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : calculation ? (
            <div className="space-y-6">
              {/* Monthly ROI */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-success-50 dark:bg-success-900/20 rounded-xl p-4 border border-success-200 dark:border-success-800"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-6 h-6 text-success-600" />
                    <div>
                      <p className="text-sm text-success-700 dark:text-success-300">Monthly ROI</p>
                      <p className="text-2xl font-bold text-success-800 dark:text-success-200">
                        {formatCurrency(calculation.monthlyROI)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-success-600 dark:text-success-400">ROI Multiplier</p>
                    <p className="text-lg font-semibold text-success-700 dark:text-success-300">
                      {((calculation.monthlyROI / 2500) * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Yearly Projection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4 border border-primary-200 dark:border-primary-800"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Target className="w-6 h-6 text-primary-600" />
                    <div>
                      <p className="text-sm text-primary-700 dark:text-primary-300">Yearly ROI</p>
                      <p className="text-2xl font-bold text-primary-800 dark:text-primary-200">
                        {formatCurrency(calculation.yearlyROI)}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Breakdown */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white dark:bg-gray-900 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="w-4 h-4 text-success-600" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">Revenue Increase</p>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(calculation.revenueIncrease)}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white dark:bg-gray-900 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-4 h-4 text-warning-600" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">Cost Savings</p>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(calculation.potentialSavings)}
                  </p>
                </motion.div>
              </div>

              {/* Payback Period */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center"
              >
                <Clock className="w-6 h-6 text-gray-600 dark:text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Payback Period</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {calculation.paybackPeriod < 1 ? '< 1 month' : `${calculation.paybackPeriod.toFixed(1)} months`}
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
                  Get Your Detailed AI Audit Report
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                  Free personalized analysis based on your numbers
                </p>
              </motion.div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}