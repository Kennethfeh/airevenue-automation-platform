'use client'

import React from 'react'
import { motion } from 'framer-motion'

export const ProofSection: React.FC = () => {
  return (
    <section className="py-16 bg-white dark:bg-gray-950">
      <div className="container-xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Trusted by Leading Companies Worldwide
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-60 dark:opacity-40">
            {/* Placeholder for company logos - replace with actual logos */}
            <div className="text-center">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                <span className="text-gray-500 font-semibold">TechCorp</span>
              </div>
            </div>
            <div className="text-center">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                <span className="text-gray-500 font-semibold">InnovateLabs</span>
              </div>
            </div>
            <div className="text-center">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                <span className="text-gray-500 font-semibold">FutureScale</span>
              </div>
            </div>
            <div className="text-center">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                <span className="text-gray-500 font-semibold">AutomateNow</span>
              </div>
            </div>
            <div className="text-center">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                <span className="text-gray-500 font-semibold">AIFirst</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}