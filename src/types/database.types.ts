export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'super_admin' | 'admin' | 'client' | 'user'
          company_name: string | null
          phone: string | null
          timezone: string | null
          preferences: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'super_admin' | 'admin' | 'client' | 'user'
          company_name?: string | null
          phone?: string | null
          timezone?: string | null
          preferences?: Json | null
        }
        Update: {
          full_name?: string | null
          avatar_url?: string | null
          role?: 'super_admin' | 'admin' | 'client' | 'user'
          company_name?: string | null
          phone?: string | null
          timezone?: string | null
          preferences?: Json | null
          updated_at?: string
        }
      }
      prospects: {
        Row: {
          id: string
          email: string
          full_name: string
          company_name: string | null
          phone: string | null
          website: string | null
          industry: string | null
          company_size: string | null
          current_volume: number | null
          pain_points: string[] | null
          lead_score: number | null
          status: 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'won' | 'lost'
          source: string | null
          utm_params: Json | null
          audit_generated: boolean
          audit_data: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          email: string
          full_name: string
          company_name?: string | null
          phone?: string | null
          website?: string | null
          industry?: string | null
          company_size?: string | null
          current_volume?: number | null
          pain_points?: string[] | null
          lead_score?: number | null
          status?: 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'won' | 'lost'
          source?: string | null
          utm_params?: Json | null
          audit_generated?: boolean
          audit_data?: Json | null
        }
        Update: {
          full_name?: string
          company_name?: string | null
          phone?: string | null
          website?: string | null
          industry?: string | null
          company_size?: string | null
          current_volume?: number | null
          pain_points?: string[] | null
          lead_score?: number | null
          status?: 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'won' | 'lost'
          source?: string | null
          utm_params?: Json | null
          audit_generated?: boolean
          audit_data?: Json | null
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          prospect_id: string | null
          profile_id: string
          company_name: string
          industry: string
          website: string | null
          monthly_volume: number
          plan_type: 'starter' | 'professional' | 'enterprise' | 'custom'
          monthly_price: number
          billing_cycle: 'monthly' | 'quarterly' | 'yearly'
          status: 'active' | 'paused' | 'cancelled' | 'churned'
          onboarding_status: 'pending' | 'in_progress' | 'completed'
          go_live_date: string | null
          contract_start: string
          contract_end: string | null
          white_label_enabled: boolean
          custom_domain: string | null
          branding_config: Json | null
          integration_settings: Json | null
          performance_metrics: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          prospect_id?: string | null
          profile_id: string
          company_name: string
          industry: string
          website?: string | null
          monthly_volume: number
          plan_type: 'starter' | 'professional' | 'enterprise' | 'custom'
          monthly_price: number
          billing_cycle?: 'monthly' | 'quarterly' | 'yearly'
          status?: 'active' | 'paused' | 'cancelled' | 'churned'
          onboarding_status?: 'pending' | 'in_progress' | 'completed'
          go_live_date?: string | null
          contract_start: string
          contract_end?: string | null
          white_label_enabled?: boolean
          custom_domain?: string | null
          branding_config?: Json | null
          integration_settings?: Json | null
          performance_metrics?: Json | null
        }
        Update: {
          company_name?: string
          industry?: string
          website?: string | null
          monthly_volume?: number
          plan_type?: 'starter' | 'professional' | 'enterprise' | 'custom'
          monthly_price?: number
          billing_cycle?: 'monthly' | 'quarterly' | 'yearly'
          status?: 'active' | 'paused' | 'cancelled' | 'churned'
          onboarding_status?: 'pending' | 'in_progress' | 'completed'
          go_live_date?: string | null
          contract_end?: string | null
          white_label_enabled?: boolean
          custom_domain?: string | null
          branding_config?: Json | null
          integration_settings?: Json | null
          performance_metrics?: Json | null
          updated_at?: string
        }
      }
      chatbots: {
        Row: {
          id: string
          client_id: string
          name: string
          description: string | null
          status: 'training' | 'active' | 'paused' | 'error'
          model_type: 'gpt-4' | 'gpt-3.5-turbo' | 'custom'
          training_data: Json | null
          personality: Json | null
          languages: string[]
          channels: string[]
          response_time_ms: number | null
          accuracy_score: number | null
          satisfaction_score: number | null
          total_conversations: number
          escalation_rules: Json | null
          knowledge_base: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          client_id: string
          name: string
          description?: string | null
          status?: 'training' | 'active' | 'paused' | 'error'
          model_type?: 'gpt-4' | 'gpt-3.5-turbo' | 'custom'
          training_data?: Json | null
          personality?: Json | null
          languages?: string[]
          channels?: string[]
          response_time_ms?: number | null
          accuracy_score?: number | null
          satisfaction_score?: number | null
          total_conversations?: number
          escalation_rules?: Json | null
          knowledge_base?: Json | null
        }
        Update: {
          name?: string
          description?: string | null
          status?: 'training' | 'active' | 'paused' | 'error'
          model_type?: 'gpt-4' | 'gpt-3.5-turbo' | 'custom'
          training_data?: Json | null
          personality?: Json | null
          languages?: string[]
          channels?: string[]
          response_time_ms?: number | null
          accuracy_score?: number | null
          satisfaction_score?: number | null
          total_conversations?: number
          escalation_rules?: Json | null
          knowledge_base?: Json | null
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          chatbot_id: string
          customer_id: string | null
          channel: 'web' | 'whatsapp' | 'facebook' | 'email' | 'voice' | 'api'
          status: 'active' | 'resolved' | 'escalated' | 'abandoned'
          messages: Json[]
          sentiment_score: number | null
          resolution_time_seconds: number | null
          escalated_to_human: boolean
          customer_satisfaction: number | null
          tags: string[] | null
          metadata: Json | null
          started_at: string
          ended_at: string | null
          created_at: string
        }
        Insert: {
          chatbot_id: string
          customer_id?: string | null
          channel: 'web' | 'whatsapp' | 'facebook' | 'email' | 'voice' | 'api'
          status?: 'active' | 'resolved' | 'escalated' | 'abandoned'
          messages: Json[]
          sentiment_score?: number | null
          resolution_time_seconds?: number | null
          escalated_to_human?: boolean
          customer_satisfaction?: number | null
          tags?: string[] | null
          metadata?: Json | null
          started_at: string
          ended_at?: string | null
        }
        Update: {
          status?: 'active' | 'resolved' | 'escalated' | 'abandoned'
          messages?: Json[]
          sentiment_score?: number | null
          resolution_time_seconds?: number | null
          escalated_to_human?: boolean
          customer_satisfaction?: number | null
          tags?: string[] | null
          metadata?: Json | null
          ended_at?: string | null
        }
      }
      analytics_events: {
        Row: {
          id: string
          client_id: string
          event_type: string
          event_data: Json
          user_id: string | null
          session_id: string | null
          timestamp: string
          created_at: string
        }
        Insert: {
          client_id: string
          event_type: string
          event_data: Json
          user_id?: string | null
          session_id?: string | null
          timestamp: string
        }
        Update: {
          event_data?: Json
        }
      }
      billing_records: {
        Row: {
          id: string
          client_id: string
          stripe_subscription_id: string | null
          stripe_customer_id: string | null
          amount: number
          currency: string
          status: 'pending' | 'paid' | 'failed' | 'refunded'
          billing_period_start: string
          billing_period_end: string
          usage_data: Json | null
          invoice_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          client_id: string
          stripe_subscription_id?: string | null
          stripe_customer_id?: string | null
          amount: number
          currency?: string
          status?: 'pending' | 'paid' | 'failed' | 'refunded'
          billing_period_start: string
          billing_period_end: string
          usage_data?: Json | null
          invoice_url?: string | null
        }
        Update: {
          status?: 'pending' | 'paid' | 'failed' | 'refunded'
          usage_data?: Json | null
          invoice_url?: string | null
          updated_at?: string
        }
      }
      integrations: {
        Row: {
          id: string
          client_id: string
          integration_type: string
          config: Json
          status: 'active' | 'inactive' | 'error'
          last_sync: string | null
          error_message: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          client_id: string
          integration_type: string
          config: Json
          status?: 'active' | 'inactive' | 'error'
          last_sync?: string | null
          error_message?: string | null
        }
        Update: {
          config?: Json
          status?: 'active' | 'inactive' | 'error'
          last_sync?: string | null
          error_message?: string | null
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          resource_type: string
          resource_id: string | null
          details: Json | null
          ip_address: string | null
          user_agent: string | null
          timestamp: string
        }
        Insert: {
          user_id?: string | null
          action: string
          resource_type: string
          resource_id?: string | null
          details?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          timestamp: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]