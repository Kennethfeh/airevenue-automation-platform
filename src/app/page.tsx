import { Metadata } from 'next'
import { ZapierHero } from '@/components/features/prospect/zapier-hero'
import { ClientLogosRow } from '@/components/features/prospect/client-logos-row'
import { ClientSuccessStories } from '@/components/features/prospect/client-success-stories'
import { KeyFeaturesGrid } from '@/components/features/prospect/key-features-grid'
import { InteractiveWorkflow } from '@/components/features/prospect/interactive-workflow'
import { EnhancedSocialProof } from '@/components/features/prospect/enhanced-social-proof'
import { ZapierFeaturesGrid } from '@/components/features/prospect/zapier-features-grid'
import { IntegrationShowcase } from '@/components/features/prospect/integration-showcase'
import { IntegrationMarketplace } from '@/components/features/prospect/integration-marketplace'
import { EnhancedROICalculator } from '@/components/features/prospect/enhanced-roi-calculator'
import { PricingSection } from '@/components/features/prospect/pricing-section'
import { FAQSection } from '@/components/features/prospect/faq-section'
import { LandingPageTracker } from '@/components/analytics/landing-page-tracker'

export const metadata: Metadata = {
  title: 'AI Customer Service Automation | Reduce Costs 60% | 24hr Setup',
  description: 'Automate customer service with AI. 30-second response times, 24/7 availability. Save $8,000+ monthly. Setup in 24 hours. Join 500+ businesses cutting support costs.',
  keywords: [
    'AI customer service',
    'customer service automation', 
    'AI chatbot',
    'help desk automation',
    'customer support AI',
    'reduce support costs',
    'automated customer service',
    'AI support agent',
    'customer service software',
    'helpdesk AI'
  ],
  authors: [{ name: 'AI Revenue Automation Platform' }],
  creator: 'AI Revenue Automation Platform',
  publisher: 'AI Revenue Automation Platform',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://yourcompany.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'AI Customer Service Automation | Reduce Costs 60%',
    description: 'Automate customer service with AI. 30-second response times, 24/7 availability. Save $8,000+ monthly. Setup in 24 hours.',
    url: 'https://yourcompany.com',
    siteName: 'AI Revenue Automation Platform',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Customer Service Automation Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Customer Service Automation | Reduce Costs 60%',
    description: 'Automate customer service with AI. 30-second response times, 24/7 availability. Save $8,000+ monthly.',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function LandingPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'AI Customer Service Automation Platform',
    description: 'Automate customer service with AI. 30-second response times, 24/7 availability. Save $8,000+ monthly. Setup in 24 hours.',
    url: 'https://yourcompany.com',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web-based',
    offers: {
      '@type': 'Offer',
      price: '2500',
      priceCurrency: 'USD',
      priceValidUntil: '2025-12-31',
      availability: 'https://schema.org/InStock',
      description: 'AI Customer Service Automation Platform starting at $2,500/month'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '500'
    },
    featureList: [
      'AI-powered customer service automation',
      '30-second response times',
      '24/7 availability',
      '24-hour setup',
      'Multi-channel support',
      'SOC 2 compliance'
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <LandingPageTracker />
      <main className="min-h-screen" role="main">
        {/* Hero Section */}
        <section aria-labelledby="hero-heading">
          <ZapierHero />
        </section>
        
        {/* Client Logos Row */}
        <section aria-labelledby="client-logos-heading">
          <ClientLogosRow />
        </section>
        
        {/* Client Success Stories */}
        <section aria-labelledby="success-stories-heading">
          <ClientSuccessStories />
        </section>
        
        {/* Interactive Workflow Demo */}
        <section aria-labelledby="workflow-heading">
          <InteractiveWorkflow />
        </section>
        
        {/* ROI Calculator */}
        <section aria-labelledby="roi-heading">
          <EnhancedROICalculator />
        </section>
        
        {/* Key Features Grid */}
        <section aria-labelledby="features-heading">
          <KeyFeaturesGrid />
        </section>
        
        {/* Enhanced Social Proof */}
        <section aria-labelledby="social-proof-heading">
          <EnhancedSocialProof />
        </section>
        
        {/* Zapier Features Grid */}
        <section aria-labelledby="zapier-features-heading">
          <ZapierFeaturesGrid />
        </section>
        
        {/* Integration Showcase */}
        <section aria-labelledby="integrations-heading">
          <IntegrationShowcase />
        </section>
        
        {/* Full Integration Marketplace */}
        <section aria-labelledby="marketplace-heading">
          <IntegrationMarketplace />
        </section>
        
        {/* Pricing Information */}
        <section aria-labelledby="pricing-heading">
          <PricingSection />
        </section>
        
        {/* Frequently Asked Questions */}
        <section aria-labelledby="faq-heading">
          <FAQSection />
        </section>
      </main>
    </>
  )
}