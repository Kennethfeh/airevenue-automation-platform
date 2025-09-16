'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Building, Users, Calendar } from 'lucide-react'
import { MainNav } from '@/components/navigation/main-nav'
import { MainFooter } from '@/components/footer/main-footer'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    employees: '',
    message: '',
    interest: 'general'
  })
  
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Submit to Netlify Forms
      const formElement = e.target as HTMLFormElement
      const formDataToSubmit = new FormData(formElement)

      // Add form data manually to ensure all fields are included
      formDataToSubmit.set('name', formData.name)
      formDataToSubmit.set('email', formData.email)
      formDataToSubmit.set('company', formData.company)
      formDataToSubmit.set('phone', formData.phone)
      formDataToSubmit.set('employees', formData.employees)
      formDataToSubmit.set('interest', formData.interest)
      formDataToSubmit.set('message', formData.message)

      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formDataToSubmit as any).toString()
      })

      if (response.ok) {
        setIsSubmitted(true)
        // Form submissions will be sent to hello@flowsupportai.com via Netlify
        // Configure this in your Netlify dashboard under Forms -> Settings -> Notifications
      } else {
        throw new Error('Form submission failed')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Sorry, there was an error submitting the form. Please try again or email us directly at hello@flowsupportai.com')
    }
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Office Address',
      details: [
        '123 Business Boulevard',
        'Suite 500',
        'San Francisco, CA 94105'
      ]
    },
    {
      icon: Phone,
      title: 'Phone Numbers',
      details: [
        'Sales: +1 (555) 123-4567',
        'Support: +1 (555) 123-4568',
        'Toll-free: +1 (800) 123-4567'
      ]
    },
    {
      icon: Mail,
      title: 'Email Addresses',
      details: [
        'hello@flowsupportai.com',
        'sales@flowsupportai.com',
        'support@flowsupportai.com'
      ]
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: [
        'Monday - Friday: 9:00 AM - 6:00 PM EST',
        'Saturday: 10:00 AM - 4:00 PM EST',
        'Sunday: Closed'
      ]
    }
  ]

  const officeFeatures = [
    'Conference facilities available',
    'Visitor parking provided',
    'Wheelchair accessible',
    '24/7 security'
  ]

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white">
        <MainNav />
        <div className="flex items-center justify-center min-h-[80vh]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md mx-auto p-8"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Message Sent!</h1>
            <p className="text-gray-600 mb-8">
              Thank you for contacting us. Our team will get back to you within 2 business hours.
            </p>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="bg-[#FF4A00] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#FF3A00] transition-colors"
            >
              Send Another Message
            </button>
          </motion.div>
        </div>
        <MainFooter />
      </div>
    )
  }

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
              Get in Touch
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 mb-8"
            >
              Ready to transform your business operations? Our automation experts are here to help you 
              calculate potential savings and design the perfect solution.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16">
        <div className="container-xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6" name="contact" method="POST" data-netlify="true">
                  <input type="hidden" name="form-name" value="contact" />
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4A00] focus:border-transparent"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4A00] focus:border-transparent"
                        placeholder="your.email@company.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4A00] focus:border-transparent"
                        placeholder="Your company"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4A00] focus:border-transparent"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Size
                      </label>
                      <select
                        name="employees"
                        value={formData.employees}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4A00] focus:border-transparent"
                      >
                        <option value="">Select size</option>
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-1000">201-1000 employees</option>
                        <option value="1000+">1000+ employees</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        What interests you?
                      </label>
                      <select
                        name="interest"
                        value={formData.interest}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4A00] focus:border-transparent"
                      >
                        <option value="general">General inquiry</option>
                        <option value="demo">Product demo</option>
                        <option value="pricing">Pricing information</option>
                        <option value="integration">Custom integration</option>
                        <option value="support">Technical support</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4A00] focus:border-transparent"
                      placeholder="Tell us about your automation needs and goals..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#FF4A00] text-white px-6 py-4 rounded-lg font-semibold hover:bg-[#FF3A00] transition-colors flex items-center justify-center"
                  >
                    Send Message
                    <Send className="w-5 h-5 ml-2" />
                  </button>
                </form>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                {contactInfo.map((info) => {
                  const Icon = info.icon
                  return (
                    <div key={info.title} className="flex space-x-4">
                      <div className="w-12 h-12 bg-[#FF4A00]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-[#FF4A00]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">{info.title}</h3>
                        <div className="space-y-1">
                          {info.details.map((detail, idx) => (
                            <div key={idx} className="text-gray-600">{detail}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}

                {/* Office Features */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Building className="w-5 h-5 mr-2 text-[#FF4A00]" />
                    Office Facilities
                  </h3>
                  <ul className="space-y-2">
                    {officeFeatures.map((feature, idx) => (
                      <li key={idx} className="text-gray-600 flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Need immediate assistance?</h3>
                  
                  <div className="grid gap-4">
                    <a 
                      href="tel:+15551234567"
                      className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <Phone className="w-5 h-5 text-green-600 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">Call Sales</div>
                        <div className="text-sm text-gray-600">+1 (555) 123-4567</div>
                      </div>
                    </a>
                    
                    <a 
                      href="/book-demo"
                      className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">Book a Demo</div>
                        <div className="text-sm text-gray-600">Schedule a personalized demo</div>
                      </div>
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Visit Our Office</h2>
            <div className="bg-gradient-to-r from-[#FF4A00]/20 to-[#FF6B1A]/20 rounded-2xl p-12 mb-8">
              <MapPin className="w-16 h-16 text-[#FF4A00] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">San Francisco Headquarters</h3>
              <p className="text-gray-600 mb-4">
                123 Business Boulevard, Suite 500<br />
                San Francisco, CA 94105
              </p>
              <p className="text-sm text-gray-500">
                Located in the heart of SOMA, easily accessible by public transport and car
              </p>
            </div>
          </div>
        </div>
      </section>

      <MainFooter />
    </div>
  )
}