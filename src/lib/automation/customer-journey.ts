import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

interface CustomerJourneyStage {
  stage: string;
  triggers: string[];
  actions: JourneyAction[];
  conditions: JourneyCondition[];
  nextStages: string[];
  timing: {
    delay?: number;
    schedule?: string;
    timezone?: string;
  };
}

interface JourneyAction {
  type: 'email' | 'sms' | 'call' | 'task' | 'webhook' | 'price_update' | 'segment_update';
  template?: string;
  content?: string;
  assignee?: string;
  webhook_url?: string;
  data?: any;
}

interface JourneyCondition {
  type: 'lead_score' | 'engagement' | 'tier' | 'behavior' | 'time' | 'revenue' | 'custom';
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'not_equals';
  value: any;
}

interface JourneyPersonalization {
  leadData: any;
  companyData: any;
  behaviorData: any;
  industryData: any;
}

export class CustomerJourneyEngine {
  private openai: OpenAI;
  private supabase: ReturnType<typeof createClient<Database>>;
  private journeyMap: Map<string, CustomerJourneyStage[]>;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });
    
    this.supabase = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );

    this.journeyMap = new Map();
    this.initializeJourneys();
  }

  private async initializeJourneys() {
    // Premium Lead Qualification Journey
    this.journeyMap.set('premium_lead_qualification', [
      {
        stage: 'lead_captured',
        triggers: ['form_submit', 'demo_request', 'pricing_inquiry'],
        actions: [
          {
            type: 'email',
            template: 'welcome_premium_lead',
            content: 'Personalized welcome with ROI calculator'
          },
          {
            type: 'task',
            assignee: 'sales_team',
            data: { priority: 'high', task: 'Qualify premium lead within 15 minutes' }
          }
        ],
        conditions: [
          { type: 'lead_score', operator: 'greater_than', value: 60 }
        ],
        nextStages: ['qualification_call'],
        timing: { delay: 300 } // 5 minutes
      },
      {
        stage: 'qualification_call',
        triggers: ['task_completed', 'calendar_booked'],
        actions: [
          {
            type: 'email',
            template: 'pre_call_preparation',
            content: 'Custom audit preview and talking points'
          },
          {
            type: 'webhook',
            webhook_url: '/api/automation/prepare-audit',
            data: { generate_preview: true }
          }
        ],
        conditions: [
          { type: 'engagement', operator: 'greater_than', value: 7 }
        ],
        nextStages: ['demo_presentation', 'nurture_sequence'],
        timing: { delay: 7200 } // 2 hours before call
      }
    ]);

    // Enterprise Client Onboarding Journey
    this.journeyMap.set('enterprise_onboarding', [
      {
        stage: 'contract_signed',
        triggers: ['payment_confirmed', 'contract_executed'],
        actions: [
          {
            type: 'email',
            template: 'enterprise_welcome_package',
            content: 'White-glove onboarding materials and timeline'
          },
          {
            type: 'task',
            assignee: 'success_team',
            data: { 
              priority: 'urgent', 
              task: 'Schedule enterprise onboarding kickoff within 24 hours',
              client_tier: 'enterprise'
            }
          },
          {
            type: 'webhook',
            webhook_url: '/api/automation/provision-infrastructure',
            data: { tier: 'enterprise', white_label: true }
          }
        ],
        conditions: [
          { type: 'tier', operator: 'equals', value: 'enterprise' }
        ],
        nextStages: ['technical_setup', 'stakeholder_alignment'],
        timing: { delay: 0 }
      }
    ]);

    // Revenue Optimization Journey
    this.journeyMap.set('revenue_optimization', [
      {
        stage: 'performance_review',
        triggers: ['monthly_review', 'usage_threshold', 'satisfaction_score'],
        actions: [
          {
            type: 'webhook',
            webhook_url: '/api/automation/generate-performance-report',
            data: { include_optimization: true }
          },
          {
            type: 'email',
            template: 'performance_insights',
            content: 'AI-generated performance report with upsell opportunities'
          }
        ],
        conditions: [
          { type: 'revenue', operator: 'greater_than', value: 2500 },
          { type: 'time', operator: 'greater_than', value: 30 } // 30 days as client
        ],
        nextStages: ['upsell_opportunity', 'expansion_planning'],
        timing: { schedule: '0 0 1 * *' } // Monthly on 1st
      }
    ]);
  }

  async executeJourney(journeyType: string, leadId: string, triggerEvent: string, data?: any) {
    const journey = this.journeyMap.get(journeyType);
    if (!journey) {
      throw new Error(`Journey type ${journeyType} not found`);
    }

    const leadData = await this.getLeadData(leadId);
    const currentStage = await this.getCurrentStage(leadId, journeyType);
    
    const applicableStages = journey.filter(stage => 
      stage.triggers.includes(triggerEvent) &&
      this.evaluateConditions(stage.conditions, leadData, data)
    );

    for (const stage of applicableStages) {
      await this.executeStage(stage, leadId, leadData, data);
      await this.updateStageProgress(leadId, journeyType, stage.stage);
    }
  }

  private async executeStage(
    stage: CustomerJourneyStage, 
    leadId: string, 
    leadData: any, 
    triggerData?: any
  ) {
    const personalization = await this.generatePersonalization(leadData, triggerData);
    
    for (const action of stage.actions) {
      try {
        await this.executeAction(action, leadId, leadData, personalization);
        
        // Log action execution
        await (this.supabase
          .from('analytics_events') as any)
          .insert({
            client_id: leadId,
            event_type: 'journey_action_executed',
            event_data: {
              journey_stage: stage.stage,
              action_type: action.type,
              success: true,
            },
            timestamp: new Date().toISOString(),
          });
      } catch (error) {
        console.error(`Failed to execute action ${action.type}:`, error);
        
        // Log action failure
        await (this.supabase
          .from('analytics_events') as any)
          .insert({
            client_id: leadId,
            event_type: 'journey_action_failed',
            event_data: {
              journey_stage: stage.stage,
              action_type: action.type,
              error: error.message,
            },
            timestamp: new Date().toISOString(),
          });
      }
    }
  }

  private async executeAction(
    action: JourneyAction, 
    leadId: string, 
    leadData: any, 
    personalization: JourneyPersonalization
  ) {
    switch (action.type) {
      case 'email':
        await this.sendPersonalizedEmail(action, leadId, leadData, personalization);
        break;
      
      case 'sms':
        await this.sendPersonalizedSMS(action, leadId, leadData, personalization);
        break;
      
      case 'call':
        await this.scheduleCall(action, leadId, leadData);
        break;
      
      case 'task':
        await this.createTask(action, leadId, leadData);
        break;
      
      case 'webhook':
        await this.executeWebhook(action, leadId, leadData);
        break;
      
      case 'price_update':
        await this.updatePricing(action, leadId, leadData);
        break;
      
      case 'segment_update':
        await this.updateSegmentation(action, leadId, leadData);
        break;
    }
  }

  private async sendPersonalizedEmail(
    action: JourneyAction, 
    leadId: string, 
    leadData: any, 
    personalization: JourneyPersonalization
  ) {
    const emailContent = await this.generatePersonalizedContent(
      action.template || 'default',
      leadData,
      personalization,
      'email'
    );

    // Integration with email service (SendGrid, etc.)
    const emailData = {
      to: leadData.email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: emailContent.subject,
      html: emailContent.html,
      personalizations: [
        {
          to: [{ email: leadData.email, name: leadData.full_name }],
          dynamic_template_data: {
            first_name: leadData.full_name.split(' ')[0],
            company_name: leadData.company_name,
            industry: leadData.industry,
            roi_projection: personalization.leadData.roi_projection,
            custom_insights: emailContent.insights,
          }
        }
      ]
    };

    // Send email (implementation would use SendGrid API)
    console.log('Sending personalized email:', emailData);
  }

  private async sendPersonalizedSMS(
    action: JourneyAction, 
    leadId: string, 
    leadData: any, 
    personalization: JourneyPersonalization
  ) {
    const smsContent = await this.generatePersonalizedContent(
      action.template || 'default',
      leadData,
      personalization,
      'sms'
    );

    // Integration with SMS service (Twilio, etc.)
    const smsData = {
      to: leadData.phone,
      from: process.env.TWILIO_PHONE_NUMBER,
      body: smsContent.message,
    };

    // Send SMS (implementation would use Twilio API)
    console.log('Sending personalized SMS:', smsData);
  }

  private async scheduleCall(action: JourneyAction, leadId: string, leadData: any) {
    const callData = {
      leadId,
      phone: leadData.phone,
      scheduledTime: new Date(),
      callScript: action.template || 'default_call_script',
    };

    // Integration with call scheduling service (Calendly, etc.)
    console.log('Scheduling call:', callData);
  }

  private async generatePersonalizedContent(
    template: string,
    leadData: any,
    personalization: JourneyPersonalization,
    contentType: 'email' | 'sms' | 'call_script'
  ) {
    const prompt = `
    Generate highly personalized ${contentType} content for premium AI customer service automation:
    
    TEMPLATE: ${template}
    LEAD DATA: ${JSON.stringify(leadData)}
    COMPANY DATA: ${JSON.stringify(personalization.companyData)}
    BEHAVIOR DATA: ${JSON.stringify(personalization.behaviorData)}
    INDUSTRY DATA: ${JSON.stringify(personalization.industryData)}
    
    Requirements:
    - Premium, consultative tone appropriate for $2,500+ monthly clients
    - Industry-specific pain points and solutions
    - Quantified ROI projections and business impact
    - Personalized insights based on company research
    - Clear, compelling call-to-action
    - Professional formatting for business executives
    
    Generate compelling content that demonstrates deep understanding of their business.
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
      max_tokens: 2000,
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  }

  private async generatePersonalization(leadData: any, triggerData?: any): Promise<JourneyPersonalization> {
    const [companyData, behaviorData, industryData] = await Promise.all([
      this.enrichCompanyData(leadData.company_name, leadData.website),
      this.getBehaviorData(leadData.id || leadData.email),
      this.getIndustryInsights(leadData.industry)
    ]);

    return {
      leadData: { ...leadData, ...triggerData },
      companyData,
      behaviorData,
      industryData,
    };
  }

  private async enrichCompanyData(companyName?: string, website?: string) {
    if (!companyName && !website) return {};

    const enrichmentPrompt = `
    Research and provide business intelligence for: ${companyName} (${website})
    
    Focus on:
    - Recent news, funding, growth indicators
    - Technology stack and current solutions
    - Likely customer service challenges
    - Decision maker profiles and pain points
    - Budget indicators for premium services
    - Competitive landscape position
    
    Return actionable insights for personalized outreach.
    `;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: enrichmentPrompt }],
        temperature: 0.2,
        max_tokens: 1000,
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Company data enrichment failed:', error);
      return {};
    }
  }

  private async getBehaviorData(identifier: string) {
    const { data } = await this.supabase
      .from('analytics_events')
      .select('event_type, event_data, timestamp')
      .or(`user_id.eq.${identifier},session_id.eq.${identifier}`)
      .order('timestamp', { ascending: false })
      .limit(50);

    const behaviorAnalysis = {
      engagement_score: this.calculateEngagementScore(data || []),
      page_views: data?.filter((e: any) => e.event_type === 'page_view').length || 0,
      demo_requests: data?.filter((e: any) => e.event_type === 'demo_request').length || 0,
      pricing_views: data?.filter((e: any) => e.event_type === 'pricing_view').length || 0,
      content_downloads: data?.filter((e: any) => e.event_type === 'content_download').length || 0,
      last_activity: (data as any)?.[0]?.timestamp,
    };

    return behaviorAnalysis;
  }

  private calculateEngagementScore(events: any[]): number {
    const weights = {
      page_view: 1,
      demo_request: 15,
      pricing_view: 10,
      content_download: 8,
      email_open: 3,
      email_click: 7,
    };

    return events.reduce((score, event) => {
      const weight = weights[event.event_type as keyof typeof weights] || 1;
      return score + weight;
    }, 0);
  }

  private async getIndustryInsights(industry?: string) {
    if (!industry) return {};

    const industryPrompt = `
    Provide specific insights for ${industry} industry regarding AI customer service automation:
    
    - Typical customer service volumes and patterns
    - Common pain points and inefficiencies
    - ROI expectations and success metrics
    - Compliance and regulatory considerations
    - Competitive advantages from automation
    - Industry-specific use cases and benefits
    
    Focus on insights that enable personalized sales conversations.
    `;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: industryPrompt }],
        temperature: 0.3,
        max_tokens: 800,
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Industry insights generation failed:', error);
      return {};
    }
  }

  private evaluateConditions(conditions: JourneyCondition[], leadData: any, triggerData?: any): boolean {
    return conditions.every(condition => {
      const value = this.getConditionValue(condition.type, leadData, triggerData);
      
      switch (condition.operator) {
        case 'equals':
          return value === condition.value;
        case 'greater_than':
          return value > condition.value;
        case 'less_than':
          return value < condition.value;
        case 'contains':
          return String(value).toLowerCase().includes(String(condition.value).toLowerCase());
        case 'not_equals':
          return value !== condition.value;
        default:
          return false;
      }
    });
  }

  private getConditionValue(type: string, leadData: any, triggerData?: any): any {
    switch (type) {
      case 'lead_score':
        return leadData.lead_score || 0;
      case 'engagement':
        return leadData.engagement_score || 0;
      case 'tier':
        return leadData.tier || leadData.plan_type;
      case 'revenue':
        return leadData.monthly_price || leadData.current_volume || 0;
      case 'time':
        const createdAt = new Date(leadData.created_at);
        const daysSince = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
        return Math.floor(daysSince);
      default:
        return triggerData?.[type] || leadData[type];
    }
  }

  private async createTask(action: JourneyAction, leadId: string, leadData: any) {
    // Create task in CRM/task management system
    const taskData = {
      title: action.data?.task || 'Follow up with lead',
      description: `Generated by customer journey automation for ${leadData.company_name}`,
      priority: action.data?.priority || 'medium',
      assignee: action.data?.assignee || 'sales_team',
      due_date: new Date(Date.now() + (action.data?.due_hours || 24) * 60 * 60 * 1000),
      lead_id: leadId,
      metadata: {
        journey_generated: true,
        lead_tier: leadData.tier,
        company_name: leadData.company_name,
      }
    };

    console.log('Creating task:', taskData);
    // Implementation would integrate with your task management system
  }

  private async executeWebhook(action: JourneyAction, leadId: string, leadData: any) {
    if (!action.webhook_url) return;

    const webhookData = {
      leadId,
      leadData,
      timestamp: new Date().toISOString(),
      ...action.data,
    };

    try {
      const response = await fetch(action.webhook_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.WEBHOOK_SECRET}`,
        },
        body: JSON.stringify(webhookData),
      });

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Webhook execution failed:', error);
      throw error;
    }
  }

  private async getLeadData(leadId: string) {
    const { data: prospect } = await this.supabase
      .from('prospects')
      .select('*')
      .eq('id', leadId)
      .single();

    if (!prospect) {
      const { data: client } = await this.supabase
        .from('clients')
        .select('*')
        .eq('id', leadId)
        .single();
      
      return client;
    }

    return prospect;
  }

  private async getCurrentStage(leadId: string, journeyType: string): Promise<string | null> {
    const { data } = await this.supabase
      .from('analytics_events')
      .select('event_data')
      .eq('client_id', leadId)
      .eq('event_type', 'journey_stage_update')
      .like('event_data', `%${journeyType}%`)
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();

    return (data as any)?.event_data?.current_stage || null;
  }

  private async updateStageProgress(leadId: string, journeyType: string, stage: string) {
    await (this.supabase
      .from('analytics_events') as any)
      .insert({
        client_id: leadId,
        event_type: 'journey_stage_update',
        event_data: {
          journey_type: journeyType,
          current_stage: stage,
          timestamp: new Date().toISOString(),
        },
        timestamp: new Date().toISOString(),
      });
  }

  async createCustomJourney(
    name: string,
    stages: CustomerJourneyStage[],
    triggers: string[]
  ): Promise<string> {
    const journeyId = `custom_${name.toLowerCase().replace(/\s+/g, '_')}`;
    this.journeyMap.set(journeyId, stages);
    
    // Store journey definition in database for persistence
    await (this.supabase
      .from('analytics_events') as any)
      .insert({
        client_id: 'system',
        event_type: 'custom_journey_created',
        event_data: {
          journey_id: journeyId,
          name,
          stages,
          triggers,
        },
        timestamp: new Date().toISOString(),
      });

    return journeyId;
  }

  private async updatePricing(action: JourneyAction, leadId: string, leadData: any) {
    // Update pricing based on journey stage and lead qualification
    const pricingUpdate = {
      new_price: action.data?.price,
      reason: action.data?.reason || 'Journey-based optimization',
      effective_date: action.data?.effective_date || new Date().toISOString(),
    };

    console.log('Updating pricing for lead:', leadId, pricingUpdate);
    // Implementation would update pricing in the database
  }

  private async updateSegmentation(action: JourneyAction, leadId: string, leadData: any) {
    // Update lead/client segmentation based on behavior and journey progress
    const segmentUpdate = {
      new_segment: action.data?.segment,
      criteria: action.data?.criteria,
      updated_at: new Date().toISOString(),
    };

    console.log('Updating segmentation for lead:', leadId, segmentUpdate);
    // Implementation would update segmentation in the database
  }
}

export const customerJourneyEngine = new CustomerJourneyEngine();