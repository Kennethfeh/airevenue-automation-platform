'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calculator, X, TrendingUp, DollarSign, Users, Clock, ArrowRight } from 'lucide-react'

interface CalculatorData {
  employees: number
  avgSalary: number
  hoursPerWeek: number
  automationPercentage: number
  email: string
  company: string
}

export const ROICalculator: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [data, setData] = useState<CalculatorData>({
    employees: 50,
    avgSalary: 75000,
    hoursPerWeek: 10,
    automationPercentage: 60,
    email: '',
    company: ''
  })

  const calculateROI = () => {
    const weeklyLaborCost = (data.avgSalary / 52) * data.employees
    const automationSavings = (weeklyLaborCost * data.hoursPerWeek / 40) * (data.automationPercentage / 100)
    const annualSavings = automationSavings * 52
    const platformCost = data.employees < 100 ? 7990 : data.employees < 500 ? 15000 : 35000
    const roi = ((annualSavings - platformCost) / platformCost) * 100
    
    return {
      annualSavings: Math.round(annualSavings),
      platformCost,
      netSavings: Math.round(annualSavings - platformCost),
      roi: Math.round(roi),
      paybackPeriod: Math.round((platformCost / (annualSavings / 12)) * 10) / 10
    }
  }

  const results = calculateROI()

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = () => {
    // Here you would typically send the data to your backend
    console.log('ROI Calculator submission:', { ...data, results })
    setStep(4)
  }

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
      >
        <Calculator className="w-5 h-5" />
        <span>Calculate Your ROI</span>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#FF4A00] to-[#FF6B1A] text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Calculator className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">ROI Calculator</h2>
                      <p className="opacity-90">Calculate your automation savings potential</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Step {step} of 3</span>
                    <span>{Math.round((step / 3) * 100)}% Complete</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-white h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(step / 3) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Step 1: Company Size */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Company Information</h3>
                      <p className="text-gray-600">Tell us about your organization</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Number of Employees
                        </label>
                        <input
                          type="number"
                          value={data.employees}
                          onChange={(e) => setData({...data, employees: parseInt(e.target.value) || 0})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4A00] focus:border-transparent"
                          placeholder="50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Average Annual Salary ($)
                        </label>
                        <input
                          type="number"
                          value={data.avgSalary}
                          onChange={(e) => setData({...data, avgSalary: parseInt(e.target.value) || 0})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4A00] focus:border-transparent"
                          placeholder="75000"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Automation Potential */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Automation Potential</h3>
                      <p className="text-gray-600">How much time could you save?</p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hours per week spent on repetitive tasks
                        </label>
                        <div className="relative">
                          <input
                            type="range"
                            min="1"
                            max="40"
                            value={data.hoursPerWeek}
                            onChange={(e) => setData({...data, hoursPerWeek: parseInt(e.target.value)})}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-sm text-gray-500 mt-1">
                            <span>1 hour</span>
                            <span className="font-semibold text-[#FF4A00]">{data.hoursPerWeek} hours</span>
                            <span>40 hours</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expected automation efficiency
                        </label>
                        <div className="relative">
                          <input
                            type="range"
                            min="20"
                            max="90"
                            value={data.automationPercentage}
                            onChange={(e) => setData({...data, automationPercentage: parseInt(e.target.value)})}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-sm text-gray-500 mt-1">
                            <span>20%</span>
                            <span className="font-semibold text-[#FF4A00]">{data.automationPercentage}%</span>
                            <span>90%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Live Preview */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Estimated Annual Savings</h4>
                      <div className="text-3xl font-bold text-green-600">
                        ${results.annualSavings.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        ROI: {results.roi}% | Payback: {results.paybackPeriod} months
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Contact Information */}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Get Your Detailed Report</h3>
                      <p className="text-gray-600">Enter your details to receive the full ROI analysis</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={data.company}
                          onChange={(e) => setData({...data, company: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4A00] focus:border-transparent"
                          placeholder="Your Company Name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={data.email}
                          onChange={(e) => setData({...data, email: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4A00] focus:border-transparent"
                          placeholder="your.email@company.com"
                        />
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                        Your ROI Summary
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Annual Savings</div>
                          <div className="font-bold text-green-600">${results.annualSavings.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Platform Cost</div>
                          <div className="font-bold">${results.platformCost.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Net Profit</div>
                          <div className="font-bold text-green-600">${results.netSavings.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">ROI</div>
                          <div className="font-bold text-green-600">{results.roi}%</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Thank You */}
                {step === 4 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-6 py-8"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <TrendingUp className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Report Sent!</h3>
                      <p className="text-gray-600">
                        Your detailed ROI analysis has been sent to {data.email}. 
                        Our automation expert will contact you within 24 hours.
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        ${results.annualSavings.toLocaleString()} saved annually
                      </div>
                      <div className="text-gray-600">
                        That's a {results.roi}% ROI with {results.paybackPeriod} month payback period
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Navigation */}
                {step < 4 && (
                  <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                    <button
                      onClick={handleBack}
                      disabled={step === 1}
                      className="px-6 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Back
                    </button>
                    <button
                      onClick={step === 3 ? handleSubmit : handleNext}
                      disabled={step === 3 && (!data.email || !data.company)}
                      className="bg-[#FF4A00] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#FF3A00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {step === 3 ? 'Get Report' : 'Next'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}