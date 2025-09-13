import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

interface RevenueOptimizationData {
  clientId: string;
  historicalRevenue: number[];
  customerLifetimeValue: number;
  churnRate: number;
  acquisitionCost: number;
  industryMetrics: {
    averageTicketSize: number;
    seasonalTrends: number[];
    competitorPricing: number[];
  };
  marketingChannels: {
    channel: string;
    cost: number;
    conversions: number;
    roi: number;
  }[];
}

interface OptimizationRecommendation {
  strategy: string;
  expectedImpact: number;
  implementation: string[];
  priority: 'high' | 'medium' | 'low';
  timeframe: string;
  investment: number;
  roi: number;
}

export class RevenueOptimizationEngine {
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

  async analyzeRevenueOptimization(data: RevenueOptimizationData): Promise<OptimizationRecommendation[]> {
    const analysis = await this.performAdvancedAnalytics(data);
    const recommendations = await this.generateOptimizationStrategies(analysis);
    const prioritizedRecommendations = this.prioritizeByROI(recommendations);
    
    await this.storeRecommendations(data.clientId, prioritizedRecommendations);
    
    return prioritizedRecommendations;
  }

  private async performAdvancedAnalytics(data: RevenueOptimizationData) {
    const prompt = `
    As a world-class revenue optimization expert, analyze this business data and provide strategic insights:
    
    BUSINESS METRICS:
    - Historical Revenue: ${data.historicalRevenue.join(', ')}
    - Customer LTV: $${data.customerLifetimeValue.toLocaleString()}
    - Churn Rate: ${(data.churnRate * 100).toFixed(2)}%
    - CAC: $${data.acquisitionCost.toLocaleString()}
    - Industry Average Ticket: $${data.industryMetrics.averageTicketSize.toLocaleString()}
    
    MARKETING CHANNELS:
    ${data.marketingChannels.map(channel => 
      `- ${channel.channel}: Cost $${channel.cost.toLocaleString()}, Conversions: ${channel.conversions}, ROI: ${(channel.roi * 100).toFixed(1)}%`
    ).join('\n')}
    
    SEASONAL TRENDS: ${data.industryMetrics.seasonalTrends.join(', ')}
    COMPETITOR PRICING: $${data.industryMetrics.competitorPricing.join(', $')}
    
    Provide a comprehensive analysis focusing on:
    1. Revenue Growth Opportunities (minimum 15% uplift strategies)
    2. Cost Optimization Areas
    3. Pricing Strategy Improvements
    4. Customer Retention Enhancements
    5. Market Expansion Opportunities
    6. Operational Efficiency Gains
    
    Format as JSON with detailed insights and quantified projections.
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 2000,
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  }

  private async generateOptimizationStrategies(analysis: any): Promise<OptimizationRecommendation[]> {
    const strategiesPrompt = `
    Based on this analysis: ${JSON.stringify(analysis)}
    
    Generate 8-12 specific, actionable revenue optimization strategies that can deliver:
    - Minimum 15% revenue increase within 90 days
    - ROI of at least 300% within 6 months
    - Sustainable competitive advantages
    
    Each strategy must include:
    - Specific implementation steps
    - Required investment amount
    - Projected ROI with timeline
    - Risk assessment and mitigation
    - Success metrics and KPIs
    
    Focus on high-impact, low-friction strategies that premium clients ($2,500-4,000/month) expect.
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: strategiesPrompt }],
      temperature: 0.4,
      max_tokens: 3000,
    });

    const strategies = JSON.parse(response.choices[0].message.content || '[]');
    
    return strategies.map((strategy: any) => ({
      strategy: strategy.name,
      expectedImpact: strategy.revenueImpact || 0,
      implementation: strategy.steps || [],
      priority: strategy.roi > 500 ? 'high' : strategy.roi > 300 ? 'medium' : 'low',
      timeframe: strategy.timeframe || '90 days',
      investment: strategy.investment || 0,
      roi: strategy.roi || 0,
    }));
  }

  private prioritizeByROI(recommendations: OptimizationRecommendation[]): OptimizationRecommendation[] {
    return recommendations
      .sort((a, b) => b.roi - a.roi)
      .map((rec, index) => ({
        ...rec,
        priority: index < 3 ? 'high' : index < 6 ? 'medium' : 'low'
      }));
  }

  private async storeRecommendations(clientId: string, recommendations: OptimizationRecommendation[]) {
    const { error } = await (this.supabase
      .from('clients') as any)
      .update({
        performance_metrics: {
          revenue_optimization: {
            recommendations,
            generated_at: new Date().toISOString(),
            expected_revenue_uplift: recommendations.reduce((sum, rec) => sum + rec.expectedImpact, 0),
            total_roi_potential: recommendations.reduce((sum, rec) => sum + rec.roi, 0) / recommendations.length,
          }
        }
      })
      .eq('id', clientId);

    if (error) {
      throw new Error(`Failed to store recommendations: ${error.message}`);
    }
  }

  async generateDynamicPricing(clientId: string, serviceType: string, marketData: any): Promise<{
    recommendedPrice: number;
    priceRange: { min: number; max: number };
    reasoning: string;
    confidenceScore: number;
  }> {
    const client = await this.getClientData(clientId);
    
    if (!client) {
      throw new Error(`Client not found: ${clientId}`);
    }
    
    const pricingPrompt = `
    As a premium pricing strategist for high-value B2B services, determine optimal pricing for:
    
    CLIENT: ${client.company_name} (Industry: ${client.industry})
    SERVICE: ${serviceType}
    CURRENT PRICING: $${client.monthly_price}
    MARKET DATA: ${JSON.stringify(marketData)}
    
    Consider:
    - Premium positioning (target: $2,500-4,000/month minimum)
    - Value-based pricing methodology
    - Competitive differentiation
    - Client's ability to pay and ROI expectations
    - Market positioning and exclusivity
    
    Provide pricing recommendation with detailed justification.
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: pricingPrompt }],
      temperature: 0.2,
      max_tokens: 1000,
    });

    const pricingData = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      recommendedPrice: Math.max(pricingData.price || 2500, 2500),
      priceRange: {
        min: Math.max(pricingData.minPrice || 2000, 2000),
        max: Math.min(pricingData.maxPrice || 5000, 8000),
      },
      reasoning: pricingData.reasoning || 'Premium value-based pricing',
      confidenceScore: pricingData.confidence || 0.85,
    };
  }

  private async getClientData(clientId: string): Promise<Database['public']['Tables']['clients']['Row'] | null> {
    const { data } = await (this.supabase
      .from('clients') as any)
      .select('*')
      .eq('id', clientId)
      .single();
    
    return data;
  }

  async generateRevenueForecast(clientId: string, timeframe: number = 12): Promise<{
    forecast: number[];
    scenarios: {
      conservative: number[];
      optimistic: number[];
      aggressive: number[];
    };
    confidence: number;
    keyFactors: string[];
  }> {
    const client = await this.getClientData(clientId);
    const historicalData = await this.getHistoricalRevenue(clientId);
    
    if (!client) {
      throw new Error(`Client not found: ${clientId}`);
    }
    
    const forecastPrompt = `
    Generate sophisticated revenue forecasting for ${timeframe} months:
    
    CLIENT DATA:
    - Current MRR: $${client.monthly_price}
    - Industry: ${client.industry}
    - Historical Data: ${JSON.stringify(historicalData)}
    
    Create three scenarios:
    1. CONSERVATIVE: 95% confidence, minimal growth
    2. OPTIMISTIC: 70% confidence, strong execution
    3. AGGRESSIVE: 40% confidence, perfect execution + market expansion
    
    Include seasonal adjustments, market trends, and growth drivers.
    Return detailed month-by-month projections with confidence intervals.
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: forecastPrompt }],
      temperature: 0.3,
      max_tokens: 2000,
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  }

  private async getHistoricalRevenue(clientId: string) {
    const { data } = await this.supabase
      .from('billing_records')
      .select('amount, billing_period_start')
      .eq('client_id', clientId)
      .eq('status', 'paid')
      .order('billing_period_start', { ascending: true });
    
    return data || [];
  }
}

export const revenueEngine = new RevenueOptimizationEngine();