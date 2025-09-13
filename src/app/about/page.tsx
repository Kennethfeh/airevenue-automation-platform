'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Users, Target, Award, Zap, Shield, TrendingUp } from 'lucide-react'
import { MainNav } from '@/components/navigation/main-nav'
import { MainFooter } from '@/components/footer/main-footer'

export default function AboutPage() {
  const teamMembers = [
    {
      name: 'Kenneth Johnson',
      role: 'Founder & CEO',
      bio: 'Former enterprise automation consultant with 15+ years experience helping Fortune 500 companies reduce operational costs through AI.',
      image: '/api/placeholder/300/300'
    },
    {
      name: 'Sarah Chen',
      role: 'CTO',
      bio: 'Ex-Google AI engineer specializing in machine learning and enterprise-scale automation systems.',
      image: '/api/placeholder/300/300'
    },
    {
      name: 'Michael Rodriguez',
      role: 'VP of Customer Success',
      bio: 'Previously led customer success at Salesforce, ensuring enterprise clients achieve maximum ROI from automation.',
      image: '/api/placeholder/300/300'
    }
  ]

  const values = [
    {
      icon: Target,
      title: 'Customer Success First',
      description: 'We measure our success by the cost savings and efficiency gains our clients achieve.'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'SOC 2 compliant with bank-level security standards for your most sensitive business data.'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Constantly pushing the boundaries of what\'s possible with AI and automation technology.'
    },
    {
      icon: TrendingUp,
      title: 'Measurable Results',
      description: 'Every implementation comes with clear KPIs and guaranteed ROI within 90 days.'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <MainNav />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-50 to-white py-20">
        <div className="container-xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            >
              Transforming Enterprise Operations with AI
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 mb-8 leading-relaxed"
            >
              Founded in 2022, AI Revenue has helped over 500 enterprises reduce operational costs by an average of 60% 
              while improving customer satisfaction through intelligent automation.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container-xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <p className="text-lg text-gray-600 mb-6">
                  To democratize enterprise-grade AI automation, making it accessible and profitable for businesses 
                  of all sizes. We believe every company should have access to the same automation advantages 
                  that Fortune 500 companies enjoy.
                </p>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#FF4A00]">500+</div>
                    <div className="text-sm text-gray-600">Enterprises Served</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#FF4A00]">$50M+</div>
                    <div className="text-sm text-gray-600">Cost Savings Generated</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#FF4A00]">99.9%</div>
                    <div className="text-sm text-gray-600">Uptime SLA</div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-[#FF4A00] to-[#FF6B1A] rounded-2xl p-8 text-white">
                <Award className="w-12 h-12 mb-4" />
                <h3 className="text-xl font-bold mb-4">Industry Recognition</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Forbes Cloud 100 Rising Star 2024</li>
                  <li>• Gartner Cool Vendor in AI 2024</li>
                  <li>• SOC 2 Type II Certified</li>
                  <li>• ISO 27001 Compliant</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon
                return (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                  >
                    <div className="w-12 h-12 bg-[#FF4A00]/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-[#FF4A00]" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container-xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Leadership Team</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-48 h-48 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
                    <Users className="w-20 h-20 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <div className="text-[#FF4A00] font-medium mb-4">{member.role}</div>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <MainFooter />
    </div>
  )
}