'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "How quickly can I start generating revenue?",
      answer: "Most agencies see their first client within 2-4 weeks of setup. Our fastest users have landed $10K+ contracts within their first month. The AI audit tool immediately generates qualified leads, while our proven sales process helps convert them into paying clients."
    },
    {
      question: "What's the realistic revenue potential?",
      answer: "Our average agency reaches $25K-50K monthly revenue within 6 months. Top performers exceed $100K/month by year one. Revenue depends on your market, pricing strategy, and client acquisition rate. We provide detailed ROI projections and coaching to help you scale."
    },
    {
      question: "Do I need technical expertise to use this platform?",
      answer: "No technical skills required. Our platform is designed for business owners, not developers. We provide complete setup, training, and ongoing support. Most users are up and running within 24 hours of onboarding."
    },
    {
      question: "How does the AI audit generation work?",
      answer: "Our AI analyzes a prospect's business information, website, and industry data to create personalized audit reports in under 60 seconds. Each report includes ROI projections, automation recommendations, and a custom implementation roadmap."
    },
    {
      question: "What kind of support do you provide?",
      answer: "We offer comprehensive support including: 1-on-1 onboarding, weekly group coaching calls, detailed documentation, video tutorials, and direct access to our success team. Enterprise clients get dedicated account management."
    },
    {
      question: "Can I white-label this for my clients?",
      answer: "Yes! Our white-label features let you completely rebrand the platform with your logo, colors, and domain. Your clients see your brand, not ours. This allows you to charge premium prices and build stronger client relationships."
    },
    {
      question: "What industries work best with AI automation?",
      answer: "E-commerce, SaaS, healthcare, fintech, education, and professional services see the highest ROI. However, any business with customer support needs can benefit. We provide industry-specific templates and strategies."
    },
    {
      question: "How do you ensure the AI responses are accurate?",
      answer: "We use GPT-4 with custom training on your client's knowledge base. The system includes accuracy monitoring, escalation rules, and continuous learning from interactions. Most clients see 90%+ accuracy rates within the first week."
    }
  ]

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container-xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Everything you need to know about building your AI automation agency
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="mb-4"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button
                  className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                    {faq.question}
                  </h3>
                  <ChevronDown className={`w-5 h-5 text-gray-500 dark:text-gray-400 transform transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`} />
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-gray-600 dark:text-gray-300 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 inline-block">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Book a free consultation to discuss your specific needs
            </p>
            <button className="btn btn-primary btn-lg px-8 py-3 font-semibold hover-lift">
              Schedule Free Consultation
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}