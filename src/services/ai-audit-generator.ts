import OpenAI from 'openai'
import { WebFetch } from '@/services/web-scraper'
import { DatabaseService } from '@/lib/supabase'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface AuditRequest {
  email: string
  company_name?: string
  industry?: string
  current_volume?: number
  website?: string
  pain_points?: string[]
}

export interface AuditReport {
  executive_summary: string
  current_state_analysis: {
    strengths: string[]
    weaknesses: string[]
    opportunities: string[]
    threats: string[]
  }
  automation_recommendations: {
    priority: 'high' | 'medium' | 'low'
    title: string
    description: string
    estimated_savings: number
    implementation_time: string
    roi_timeline: string
  }[]
  financial_projections: {
    current_monthly_costs: number
    projected_monthly_savings: number
    revenue_increase_potential: number
    payback_period_months: number
    five_year_roi: number
  }
  implementation_roadmap: {
    phase: number
    title: string
    duration: string
    key_activities: string[]
    success_metrics: string[]
  }[]
  next_steps: string[]
  competitive_analysis?: {
    market_position: string
    competitors_using_ai: string[]
    competitive_advantages: string[]
    risks_of_delay: string[]
  }
  custom_recommendations?: string[]
}

export async function generateAuditReport(request: AuditRequest): Promise<AuditReport> {
  try {
    // Step 1: Gather website data if available
    let websiteData = null
    if (request.website) {
      try {
        websiteData = await scrapeWebsiteData(request.website)
      } catch (error) {
        console.log('Could not scrape website, continuing without website data')
      }
    }

    // Step 2: Generate industry-specific analysis
    const industryContext = await generateIndustryContext(request.industry || 'general')
    
    // Step 3: Create comprehensive audit using GPT-4
    const auditPrompt = createAuditPrompt(request, websiteData, industryContext)
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are a senior AI automation consultant with 15+ years of experience helping businesses implement customer service automation. You specialize in generating detailed, actionable audit reports that help companies understand their automation potential and ROI.

Your analysis should be:
- Data-driven and specific
- Industry-aware and contextual  
- Financially focused with realistic projections
- Actionable with clear next steps
- Professional yet compelling

Return a comprehensive JSON audit report following the exact structure provided.`
        },
        {
          role: 'user',
          content: auditPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('No response from OpenAI')
    }

    // Parse the JSON response
    let auditData: AuditReport
    try {
      auditData = JSON.parse(response)
    } catch (parseError) {
      console.error('Error parsing audit response:', parseError)
      // Fallback to template-based audit
      auditData = generateFallbackAudit(request)
    }

    // Step 4: Enhance with additional calculations
    auditData = enhanceAuditWithCalculations(auditData, request)
    
    // Step 5: Add competitive analysis if industry is known
    if (request.industry) {
      auditData.competitive_analysis = await generateCompetitiveAnalysis(request.industry, request.company_name)
    }

    return auditData

  } catch (error) {
    console.error('Error generating audit report:', error)
    
    // Return fallback audit report
    return generateFallbackAudit(request)
  }
}

async function scrapeWebsiteData(website: string) {
  try {
    const webScraper = new WebFetch()
    const data = await webScraper.scrape(website, {
      extractText: true,
      extractImages: false,
      extractLinks: true,
      maxPages: 3
    })
    
    return {
      content: data.text?.substring(0, 2000), // Limit content for API
      structure: data.structure,
      technologies: data.technologies,
      contactMethods: data.contactMethods
    }
  } catch (error) {
    console.log('Website scraping failed:', error)
    return null
  }
}

async function generateIndustryContext(industry: string) {
  const industryInsights: Record<string, any> = {
    'ecommerce': {
      avgResponseTime: 4,
      customerExpectations: 'Immediate responses, order tracking, return assistance',
      commonPainPoints: ['Cart abandonment', 'Product questions', 'Shipping inquiries'],
      aiOpportunities: ['Product recommendations', '24/7 support', 'Order tracking automation'],
      benchmarkMetrics: { conversionRate: 2.86, avgOrderValue: 75, supportVolume: 800 }
    },
    'saas': {
      avgResponseTime: 6,
      customerExpectations: 'Technical support, feature explanations, billing help',
      commonPainPoints: ['User onboarding', 'Feature adoption', 'Technical issues'],
      aiOpportunities: ['Onboarding automation', 'Feature tutorials', 'Predictive support'],
      benchmarkMetrics: { churnRate: 5.6, ltv: 1200, supportVolume: 1200 }
    },
    'healthcare': {
      avgResponseTime: 12,
      customerExpectations: 'Appointment scheduling, insurance queries, medical information',
      commonPainPoints: ['Appointment no-shows', 'Insurance complexity', 'Patient communication'],
      aiOpportunities: ['Appointment reminders', 'Insurance verification', 'Symptom checker'],
      benchmarkMetrics: { patientSatisfaction: 7.8, appointmentRate: 85, supportVolume: 600 }
    },
    // Add more industries...
  }
  
  return industryInsights[industry] || industryInsights['general'] || {
    avgResponseTime: 8,
    customerExpectations: 'Quick responses, accurate information, problem resolution',
    commonPainPoints: ['Response time', 'Information accuracy', 'Issue resolution'],
    aiOpportunities: ['24/7 availability', 'Instant responses', 'Consistent quality'],
    benchmarkMetrics: { satisfactionScore: 7.5, responseTime: 8, supportVolume: 1000 }
  }
}

function createAuditPrompt(request: AuditRequest, websiteData: any, industryContext: any): string {
  return `
Generate a comprehensive AI automation audit for the following business:

BUSINESS DETAILS:
- Company: ${request.company_name || 'Unknown'}
- Industry: ${request.industry || 'General'}
- Email: ${request.email}
- Current Volume: ${request.current_volume || 'Unknown'} interactions/month
- Website: ${request.website || 'Not provided'}

WEBSITE DATA:
${websiteData ? JSON.stringify(websiteData, null, 2) : 'No website data available'}

INDUSTRY CONTEXT:
${JSON.stringify(industryContext, null, 2)}

Please generate a detailed audit report in the following JSON structure:

{
  "executive_summary": "3-4 sentence summary of key findings and potential",
  "current_state_analysis": {
    "strengths": ["strength 1", "strength 2", "strength 3"],
    "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
    "opportunities": ["opportunity 1", "opportunity 2", "opportunity 3"],
    "threats": ["threat 1", "threat 2", "threat 3"]
  },
  "automation_recommendations": [
    {
      "priority": "high",
      "title": "Recommendation Title",
      "description": "Detailed description of the recommendation",
      "estimated_savings": 2500,
      "implementation_time": "2-4 weeks",
      "roi_timeline": "3-6 months"
    }
  ],
  "financial_projections": {
    "current_monthly_costs": 4500,
    "projected_monthly_savings": 2800,
    "revenue_increase_potential": 3200,
    "payback_period_months": 2.5,
    "five_year_roi": 156000
  },
  "implementation_roadmap": [
    {
      "phase": 1,
      "title": "Phase Title",
      "duration": "2-3 weeks",
      "key_activities": ["activity 1", "activity 2"],
      "success_metrics": ["metric 1", "metric 2"]
    }
  ],
  "next_steps": ["next step 1", "next step 2", "next step 3"],
  "custom_recommendations": ["custom rec 1", "custom rec 2"]
}

Focus on:
1. Realistic financial projections based on industry benchmarks
2. Specific, actionable recommendations
3. Clear ROI calculations
4. Industry-specific insights
5. Competitive positioning

Make the audit compelling but realistic, professional but accessible.
`
}

function generateFallbackAudit(request: AuditRequest): AuditReport {
  const baseVolume = request.current_volume || 1000
  const industryMultiplier = getIndustryMultiplier(request.industry)
  
  return {
    executive_summary: `Based on our analysis, your business has significant potential for AI automation cost savings and revenue growth. With an estimated ${baseVolume} monthly interactions, implementing AI customer service automation could save you $${Math.round(baseVolume * 2.5)} monthly while increasing customer satisfaction and conversion rates.`,
    current_state_analysis: {
      strengths: [
        'Established customer base with regular interactions',
        'Clear business model with growth potential',
        'Industry positioned for AI automation benefits'
      ],
      weaknesses: [
        'Manual customer service processes limiting scalability',
        'Inconsistent response times affecting customer satisfaction',
        'High operational costs for customer support staffing'
      ],
      opportunities: [
        '24/7 automated customer service availability',
        'Significant cost reduction through AI automation',
        'Improved customer experience and retention'
      ],
      threats: [
        'Competitors implementing AI automation first',
        'Rising customer service operational costs',
        'Customer expectations increasing for instant responses'
      ]
    },
    automation_recommendations: [
      {
        priority: 'high',
        title: 'AI Chatbot Implementation',
        description: 'Deploy intelligent chatbot to handle 80% of common customer inquiries instantly',
        estimated_savings: Math.round(baseVolume * 2),
        implementation_time: '2-4 weeks',
        roi_timeline: '2-3 months'
      },
      {
        priority: 'medium',
        title: 'Multi-Channel Integration',
        description: 'Connect AI across email, chat, social media for unified customer experience',
        estimated_savings: Math.round(baseVolume * 1.5),
        implementation_time: '3-6 weeks',
        roi_timeline: '3-4 months'
      }
    ],
    financial_projections: {
      current_monthly_costs: Math.round(baseVolume * 3.5 * industryMultiplier),
      projected_monthly_savings: Math.round(baseVolume * 2.5),
      revenue_increase_potential: Math.round(baseVolume * 1.8 * industryMultiplier),
      payback_period_months: 2.5,
      five_year_roi: Math.round(baseVolume * 2.5 * 60)
    },
    implementation_roadmap: [
      {
        phase: 1,
        title: 'AI Foundation Setup',
        duration: '1-2 weeks',
        key_activities: ['AI model training', 'Integration planning', 'Team training'],
        success_metrics: ['Bot accuracy >90%', 'Response time <30 seconds']
      },
      {
        phase: 2,
        title: 'Multi-Channel Deployment',
        duration: '2-3 weeks',
        key_activities: ['Channel integrations', 'Testing', 'Gradual rollout'],
        success_metrics: ['All channels connected', 'Customer satisfaction >8/10']
      }
    ],
    next_steps: [
      'Schedule detailed consultation call',
      'Receive custom implementation timeline',
      'Begin AI model training process',
      'Set up success tracking metrics'
    ]
  }
}

function getIndustryMultiplier(industry?: string): number {
  const multipliers: Record<string, number> = {
    'fintech': 2.0,
    'healthcare': 1.8,
    'saas': 1.6,
    'ecommerce': 1.2,
    'education': 1.1
  }
  return multipliers[industry || 'general'] || 1.3
}

function enhanceAuditWithCalculations(audit: AuditReport, request: AuditRequest): AuditReport {
  // Add more sophisticated calculations based on actual data
  const volume = request.current_volume || 1000
  
  // Enhance financial projections with more realistic numbers
  if (volume > 5000) {
    audit.financial_projections.projected_monthly_savings *= 1.2
    audit.financial_projections.revenue_increase_potential *= 1.3
  }
  
  // Add industry-specific recommendations
  if (request.industry === 'ecommerce') {
    audit.custom_recommendations = [
      'Implement abandoned cart recovery automation',
      'Add product recommendation engine',
      'Create automated order tracking system'
    ]
  }
  
  return audit
}

async function generateCompetitiveAnalysis(industry: string, companyName?: string) {
  // This would typically call an external service or database
  // For now, return industry-specific competitive insights
  const competitiveData: Record<string, any> = {
    'ecommerce': {
      market_position: 'Growing market with increasing AI adoption',
      competitors_using_ai: ['Amazon', 'Shopify stores', 'Major retailers'],
      competitive_advantages: ['24/7 availability', 'Instant responses', 'Personalized recommendations'],
      risks_of_delay: ['Customer expectations rising', 'Competitors gaining efficiency advantages']
    }
  }
  
  return competitiveData[industry] || {
    market_position: 'AI adoption accelerating across industries',
    competitors_using_ai: ['Industry leaders', 'Tech-forward companies'],
    competitive_advantages: ['Cost efficiency', 'Better customer experience', 'Scalability'],
    risks_of_delay: ['Falling behind competitors', 'Higher implementation costs later']
  }
}