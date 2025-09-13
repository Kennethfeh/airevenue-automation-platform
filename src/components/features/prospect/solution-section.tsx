'use client'

export function SolutionSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="container-xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            The Complete AI Customer Service Solution
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Transform your customer service into a revenue-generating machine with our enterprise-grade AI platform
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-8">
            <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Instant Response AI
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Respond to customer inquiries in under 5 seconds, 24/7. Our AI handles 90% of support tickets automatically.
            </p>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Multi-language support
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Context-aware responses
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Learning from interactions
              </li>
            </ul>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-8">
            <div className="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Revenue Intelligence
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Turn every customer interaction into revenue opportunities with AI-powered upselling and cross-selling.
            </p>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Predictive lead scoring
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Automated sales sequences
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                ROI tracking & optimization
              </li>
            </ul>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-8">
            <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Enterprise Integration
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Seamlessly connect with your existing tools and workflows. Enterprise-grade security and compliance.
            </p>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                CRM & helpdesk integration
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                SOC2 & GDPR compliant
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                White-label options
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}