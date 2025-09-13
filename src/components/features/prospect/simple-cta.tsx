'use client'

import React from 'react'

export const CTASection: React.FC = () => {
  return (
    <div className="py-20 bg-primary-600 text-white">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          Ready to Cut Your Customer Service
          <br />
          <span className="text-yellow-300">Costs by 60%?</span>
        </h2>
        
        <p className="text-xl mb-8 opacity-90">
          Join hundreds of businesses already saving thousands monthly with AI automation.
        </p>
        
        <button className="bg-white text-primary-700 px-12 py-5 rounded-2xl font-bold text-xl hover:bg-gray-100 transition-colors">
          Get Your Free Cost Analysis
        </button>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold">2 Minutes</div>
            <div className="text-primary-200">Free Analysis Delivered</div>
          </div>
          <div>
            <div className="text-3xl font-bold">48 Hours</div>
            <div className="text-primary-200">Setup & Go Live</div>
          </div>
          <div>
            <div className="text-3xl font-bold">30 Days</div>
            <div className="text-primary-200">Money-Back Guarantee</div>
          </div>
        </div>
      </div>
    </div>
  )
}