import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

interface LeadQualificationData {
  email: string;
  fullName: string;
  companyName?: string;
  website?: string;
  industry?: string;
  companySize?: string;
  currentVolume?: number;
  painPoints?: string[];
  source?: string;
  utmParams?: any;
  linkedinProfile?: string;
  jobTitle?: string;
  phoneNumber?: string;
}

interface QualificationResult {
  score: number;
  tier: 'enterprise' | 'professional' | 'starter' | 'unqualified';
  reasoning: string;
  recommendedPrice: number;
  urgency: 'high' | 'medium' | 'low';
  nextSteps: string[];
  estimatedCloseTime: string;
  revenueProjection: number;
  riskFactors: string[];
  opportunities: string[];
}

export class LeadQualificationEngine {
  private openai: OpenAI;
  private supabase: ReturnType<typeof createClient<Database>>;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });
    
    this.supabase = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );
  }

  async qualifyLead(leadData: LeadQualificationData): Promise<QualificationResult> {
    const enrichedData = await this.enrichLeadData(leadData);
    const qualification = await this.performAIQualification(enrichedData);
    const score = this.calculateCompositeScore(qualification, enrichedData);
    
    const result: QualificationResult = {
      score,
      tier: this.determineTier(score, enrichedData),
      reasoning: qualification.reasoning,
      recommendedPrice: this.calculatePricing(score, enrichedData),
      urgency: qualification.urgency,
      nextSteps: qualification.nextSteps,
      estimatedCloseTime: qualification.closeTime,
      revenueProjection: this.projectRevenue(score, enrichedData),
      riskFactors: qualification.risks,
      opportunities: qualification.opportunities,
    };

    await this.storeLead(leadData, result);
    
    return result;
  }

  private async enrichLeadData(leadData: LeadQualificationData) {
    const enrichmentPromises = [
      this.enrichCompanyData(leadData.companyName, leadData.website),
      this.enrichIndustryData(leadData.industry),
      this.analyzeUtmParams(leadData.utmParams),
    ];

    const [companyData, industryData, sourceAnalysis] = await Promise.all(enrichmentPromises);

    return {
      ...leadData,
      companyData,
      industryData,
      sourceAnalysis,
    };
  }

  private async enrichCompanyData(companyName?: string, website?: string) {
    if (!companyName && !website) return null;

    const enrichmentPrompt = `
    Research this company and provide comprehensive business intelligence:
    Company: ${companyName}
    Website: ${website}
    
    Analyze and return:
    - Estimated revenue range
    - Employee count
    - Technology stack (if tech company)
    - Recent funding/growth indicators
    - Market position and competitors
    - Pain points likely faced
    - Budget capacity for premium services ($2.5K-4K/month)
    - Decision maker profiles
    - Sales cycle expectations
    
    Focus on indicators that suggest high-value client potential.
    `;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: enrichmentPrompt }],
        temperature: 0.2,
        max_tokens: 1500,
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Company enrichment failed:', error);
      return null;
    }
  }

  private async enrichIndustryData(industry?: string) {
    if (!industry) return null;

    const industryPrompt = `
    Provide market intelligence for the ${industry} industry:
    
    - Average customer service volumes
    - Typical pain points with current solutions
    - Budget ranges for automation solutions
    - ROI expectations and success metrics
    - Compliance requirements
    - Competitive landscape
    - Technology adoption patterns
    - Seasonal variations in business
    
    Focus on insights relevant to AI customer service automation pricing and positioning.
    `;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: industryPrompt }],
        temperature: 0.3,
        max_tokens: 1000,
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Industry enrichment failed:', error);
      return null;
    }
  }

  private analyzeUtmParams(utmParams?: any) {
    if (!utmParams) return { quality: 'unknown', intent: 'low' };

    const highIntentSources = ['google-ads', 'linkedin-ads', 'direct'];
    const highIntentCampaigns = ['demo', 'consultation', 'enterprise', 'automation'];
    
    const source = utmParams.utm_source?.toLowerCase() || '';
    const campaign = utmParams.utm_campaign?.toLowerCase() || '';
    
    const quality = highIntentSources.includes(source) ? 'high' : 'medium';
    const intent = highIntentCampaigns.some(keyword => campaign.includes(keyword)) ? 'high' : 'medium';
    
    return { quality, intent, source, campaign };
  }

  private async performAIQualification(enrichedData: any) {
    const qualificationPrompt = `
    As a world-class B2B sales qualification expert, analyze this lead for premium AI customer service automation services ($2,500-4,000/month):
    
    LEAD DATA:
    ${JSON.stringify(enrichedData, null, 2)}
    
    Evaluate based on:
    1. BUDGET CAPACITY: Can they afford $2,500-4,000/month?
    2. AUTHORITY: Is this person a decision maker?
    3. NEED: Do they have genuine pain points we solve?
    4. TIMING: Are they actively looking for solutions?
    5. FIT: Are they a good cultural/technical fit?
    
    QUALIFICATION CRITERIA FOR EACH TIER:
    - ENTERPRISE (Score 80-100): >$10M revenue, 100+ employees, complex needs, $4,000+ budget
    - PROFESSIONAL (Score 60-79): $1-10M revenue, 25-100 employees, clear ROI case, $2,500+ budget
    - STARTER (Score 40-59): <$1M revenue, <25 employees, basic needs, $1,500+ budget
    - UNQUALIFIED (Score <40): Insufficient budget, no clear need, or poor fit
    
    Provide detailed analysis with specific reasoning, urgency assessment, next steps, close timeline, risk factors, and opportunities.
    
    Return structured JSON response.
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: qualificationPrompt }],
      temperature: 0.2,
      max_tokens: 2000,
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  }

  private calculateCompositeScore(qualification: any, enrichedData: any): number {
    let score = qualification.baseScore || 50;
    
    // Company size bonus
    if (enrichedData.companyData?.employees > 100) score += 15;
    else if (enrichedData.companyData?.employees > 25) score += 10;
    
    // Revenue bonus
    if (enrichedData.companyData?.revenue > 10000000) score += 20;
    else if (enrichedData.companyData?.revenue > 1000000) score += 10;
    
    // Industry bonus (high-volume industries)
    const highVolumeIndustries = ['e-commerce', 'saas', 'financial', 'healthcare', 'retail'];
    if (highVolumeIndustries.includes(enrichedData.industry?.toLowerCase())) score += 10;
    
    // Source quality bonus
    if (enrichedData.sourceAnalysis?.quality === 'high') score += 10;
    if (enrichedData.sourceAnalysis?.intent === 'high') score += 10;
    
    // Pain points bonus
    if (enrichedData.painPoints && enrichedData.painPoints.length > 2) score += 5;
    
    return Math.min(Math.max(score, 0), 100);
  }

  private determineTier(score: number, enrichedData: any): 'enterprise' | 'professional' | 'starter' | 'unqualified' {
    if (score >= 80) return 'enterprise';
    if (score >= 60) return 'professional';
    if (score >= 40) return 'starter';
    return 'unqualified';
  }

  private calculatePricing(score: number, enrichedData: any): number {
    const basePricing = {
      enterprise: 4000,
      professional: 2500,
      starter: 1500,
      unqualified: 0,
    };
    
    const tier = this.determineTier(score, enrichedData);
    let price = basePricing[tier];
    
    // Adjust based on company size and complexity
    if (enrichedData.companyData?.employees > 500) price *= 1.5;
    if (enrichedData.currentVolume > 10000) price *= 1.3;
    
    // Industry multipliers
    const premiumIndustries = ['healthcare', 'financial', 'legal'];
    if (premiumIndustries.includes(enrichedData.industry?.toLowerCase())) {
      price *= 1.2;
    }
    
    return Math.round(price);
  }

  private projectRevenue(score: number, enrichedData: any): number {
    const monthlyPrice = this.calculatePricing(score, enrichedData);
    const tier = this.determineTier(score, enrichedData);
    
    const retentionRates = {
      enterprise: 0.95, // 95% monthly retention
      professional: 0.92,
      starter: 0.88,
      unqualified: 0,
    };
    
    const avgLifetime = {
      enterprise: 36, // months
      professional: 24,
      starter: 18,
      unqualified: 0,
    };
    
    const retention = retentionRates[tier];
    const lifetime = avgLifetime[tier];
    
    // Calculate LTV with retention decay
    let totalRevenue = 0;
    let currentRetention = 1;
    
    for (let month = 1; month <= lifetime; month++) {
      totalRevenue += monthlyPrice * currentRetention;
      currentRetention *= retention;
    }
    
    return Math.round(totalRevenue);
  }

  private async storeLead(leadData: LeadQualificationData, qualification: QualificationResult) {
    const prospectData: Database['public']['Tables']['prospects']['Insert'] = {
      email: leadData.email,
      full_name: leadData.fullName,
      company_name: leadData.companyName || null,
      phone: leadData.phoneNumber || null,
      website: leadData.website || null,
      industry: leadData.industry || null,
      company_size: leadData.companySize || null,
      current_volume: leadData.currentVolume || null,
      pain_points: leadData.painPoints || null,
      lead_score: qualification.score,
      status: qualification.tier === 'unqualified' ? 'lost' : 'new',
      source: leadData.source || null,
      utm_params: leadData.utmParams || null,
      audit_data: {
        qualification: JSON.parse(JSON.stringify(qualification)),
        recommended_price: qualification.recommendedPrice,
        revenue_projection: qualification.revenueProjection,
        qualified_at: new Date().toISOString(),
      } as any,
    };

    const { error } = await (this.supabase
      .from('prospects') as any)
      .insert(prospectData);

    if (error) {
      throw new Error(`Failed to store lead: ${error.message}`);
    }

    // Trigger automated follow-up sequences
    if (qualification.tier !== 'unqualified') {
      await this.triggerFollowupSequence(leadData.email, qualification);
    }
  }

  private async triggerFollowupSequence(email: string, qualification: QualificationResult) {
    const sequences = {
      enterprise: 'enterprise_vip_sequence',
      professional: 'professional_sequence', 
      starter: 'starter_nurture_sequence',
      unqualified: null,
    };
    
    const sequenceId = sequences[qualification.tier];
    if (!sequenceId) return;
    
    // This would integrate with your email automation system
    console.log(`Triggering ${sequenceId} for ${email}`);
    
    // Log the automation trigger
    await (this.supabase
      .from('analytics_events') as any)
      .insert({
        client_id: 'system',
        event_type: 'lead_qualification_complete',
        event_data: {
          email,
          tier: qualification.tier,
          score: qualification.score,
          sequence: sequenceId,
        },
        timestamp: new Date().toISOString(),
      });
  }

  async batchQualifyLeads(leads: LeadQualificationData[]): Promise<QualificationResult[]> {
    const batchSize = 5; // Process 5 leads at a time to avoid rate limits
    const results: QualificationResult[] = [];
    
    for (let i = 0; i < leads.length; i += batchSize) {
      const batch = leads.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(lead => this.qualifyLead(lead))
      );
      results.push(...batchResults);
      
      // Add small delay between batches
      if (i + batchSize < leads.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return results;
  }
}

export const leadQualificationEngine = new LeadQualificationEngine();