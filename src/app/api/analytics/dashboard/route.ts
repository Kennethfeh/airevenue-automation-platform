import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import { revenueEngine } from '@/lib/ai/revenue-engine';

const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '30d';
    
    const [
      revenueMetrics,
      clientMetrics,
      performanceMetrics,
      revenueOptimization,
      trends
    ] = await Promise.all([
      getRevenueMetrics(timeframe),
      getClientMetrics(timeframe),
      getPerformanceMetrics(timeframe),
      getRevenueOptimizationData(timeframe),
      getTrendData(timeframe)
    ]);

    const dashboardData = {
      revenueMetrics,
      clientMetrics,
      performanceMetrics,
      revenueOptimization,
      trends,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}

async function getRevenueMetrics(timeframe: string) {
  const timeFilter = getTimeFilter(timeframe);
  
  const { data: billingData } = await supabase
    .from('billing_records')
    .select('amount, currency, billing_period_start, client_id')
    .eq('status', 'paid')
    .gte('billing_period_start', timeFilter)
    .order('billing_period_start', { ascending: false });

  const { data: clientsData } = await supabase
    .from('clients')
    .select('monthly_price, plan_type, status')
    .eq('status', 'active');

  const totalRevenue = billingData?.reduce((sum: number, record: any) => sum + (record.amount || 0), 0) || 0;
  const annualRecurring = (clientsData?.reduce((sum: number, client: any) => sum + (client.monthly_price || 0), 0) || 0) * 12;
  
  // Calculate growth rate
  const previousPeriodFilter = getPreviousPeriodFilter(timeframe);
  const { data: previousData } = await supabase
    .from('billing_records')
    .select('amount')
    .eq('status', 'paid')
    .gte('billing_period_start', previousPeriodFilter)
    .lt('billing_period_start', timeFilter);
  
  const previousRevenue = previousData?.reduce((sum: number, record: any) => sum + (record.amount || 0), 0) || 1;
  const monthlyGrowth = ((totalRevenue - previousRevenue) / previousRevenue) * 100;

  // Revenue by tier
  const revenueByTier = clientsData?.reduce((acc: any[], client: any) => {
    const existingTier = acc.find(item => item.name === client.plan_type);
    if (existingTier) {
      existingTier.value += (client.monthly_price || 0);
    } else {
      acc.push({
        name: client.plan_type || 'unknown',
        value: client.monthly_price || 0,
        color: getTierColor(client.plan_type || 'unknown'),
      });
    }
    return acc;
  }, []) || [];

  return {
    totalRevenue,
    monthlyGrowth,
    annualRecurring,
    projectedRevenue: totalRevenue * 1.15, // AI projection would be more sophisticated
    revenueByTier,
  };
}

async function getClientMetrics(timeframe: string) {
  const timeFilter = getTimeFilter(timeframe);
  
  const { data: clients } = await supabase
    .from('clients')
    .select('status, created_at, monthly_price, plan_type')
    .eq('status', 'active');

  const { data: newClients } = await supabase
    .from('clients')
    .select('id')
    .gte('created_at', timeFilter);

  const { data: churnedClients } = await supabase
    .from('clients')
    .select('id')
    .eq('status', 'churned')
    .gte('updated_at', timeFilter);

  const totalClients = clients?.length || 0;
  const newClientsCount = newClients?.length || 0;
  const churnCount = churnedClients?.length || 0;
  const churnRate = churnCount / (totalClients + churnCount);

  // Calculate average LTV
  const avgLifetimeValue = clients?.reduce((sum: number, client: any) => {
    const monthlyRevenue = client.monthly_price || 0;
    const estimatedLifetime = getTierLifetime(client.plan_type || 'professional');
    return sum + (monthlyRevenue * estimatedLifetime);
  }, 0) || 0;

  const clientsByTier = clients?.reduce((acc: any[], client: any) => {
    const existingTier = acc.find(item => item.name === client.plan_type);
    if (existingTier) {
      existingTier.value += 1;
    } else {
      acc.push({ name: client.plan_type || 'unknown', value: 1 });
    }
    return acc;
  }, []) || [];

  return {
    totalClients,
    newClients: newClientsCount,
    churnRate,
    avgLifetimeValue: Math.round(avgLifetimeValue / totalClients),
    clientsByTier,
  };
}

async function getPerformanceMetrics(timeframe: string) {
  const timeFilter = getTimeFilter(timeframe);
  
  const { data: prospects } = await supabase
    .from('prospects')
    .select('status, created_at, lead_score')
    .gte('created_at', timeFilter);

  const { data: clients } = await supabase
    .from('clients')
    .select('monthly_price')
    .eq('status', 'active');

  const totalProspects = prospects?.length || 0;
  const wonProspects = prospects?.filter((p: any) => p.status === 'won').length || 0;
  const conversionRate = totalProspects > 0 ? (wonProspects / totalProspects) * 100 : 0;

  const avgDealSize = clients?.reduce((sum: number, client: any) => sum + (client.monthly_price || 0), 0) || 0;
  const avgDealSizeFinal = clients?.length ? avgDealSize / clients.length : 0;

  // Mock data for customer satisfaction - in production, this would come from surveys/feedback
  const customerSatisfaction = 4.7; // Out of 5
  
  // Mock sales cycle length - in production, calculate from prospect creation to client conversion
  const salesCycleLength = 21; // days

  return {
    conversionRate,
    avgDealSize: Math.round(avgDealSizeFinal),
    salesCycleLength,
    customerSatisfaction,
  };
}

async function getRevenueOptimizationData(timeframe: string) {
  // Mock optimization opportunities - in production, these would be generated by AI
  const opportunities = [
    {
      title: "Implement dynamic pricing for enterprise clients",
      impact: 15000,
      effort: "Medium",
      status: "pending" as const,
      roi: 450,
    },
    {
      title: "Add premium white-label tier at $6,000/month",
      impact: 25000,
      effort: "High",
      status: "in_progress" as const,
      roi: 380,
    },
    {
      title: "Optimize starter plan conversion funnel",
      impact: 8000,
      effort: "Low",
      status: "pending" as const,
      roi: 320,
    },
    {
      title: "Introduce annual billing discounts",
      impact: 12000,
      effort: "Low",
      status: "pending" as const,
      roi: 280,
    },
  ];

  // Mock pricing recommendations - in production, generated by AI pricing optimizer
  const pricingRecommendations = [
    {
      client: "TechCorp Solutions",
      currentPrice: 3500,
      recommendedPrice: 4200,
      impact: 700,
    },
    {
      client: "Global Retail Inc",
      currentPrice: 2800,
      recommendedPrice: 3400,
      impact: 600,
    },
    {
      client: "FinanceFlow LLC",
      currentPrice: 4000,
      recommendedPrice: 4800,
      impact: 800,
    },
  ];

  return {
    opportunities,
    pricingRecommendations,
  };
}

async function getTrendData(timeframe: string) {
  const months = getMonthsArray(timeframe);
  
  // Generate revenue history
  const revenueHistory = await Promise.all(
    months.map(async (month) => {
      const { data } = await supabase
        .from('billing_records')
        .select('amount')
        .eq('status', 'paid')
        .gte('billing_period_start', `${month}-01`)
        .lt('billing_period_start', getNextMonth(month));
      
      const revenue = data?.reduce((sum: number, record: any) => sum + (record.amount || 0), 0) || 0;
      const target = revenue * 1.1; // 10% growth target
      
      return {
        month: formatMonth(month),
        revenue,
        target,
      };
    })
  );

  // Generate client growth data
  const clientGrowth = await Promise.all(
    months.map(async (month) => {
      const { data: activeClients } = await supabase
        .from('clients')
        .select('id')
        .eq('status', 'active')
        .lte('created_at', `${getNextMonth(month)}-01`);
      
      const { data: churnedClients } = await supabase
        .from('clients')
        .select('id')
        .eq('status', 'churned')
        .gte('updated_at', `${month}-01`)
        .lt('updated_at', getNextMonth(month));
      
      return {
        month: formatMonth(month),
        clients: activeClients?.length || 0,
        churn: churnedClients?.length || 0,
      };
    })
  );

  // Mock conversion funnel data
  const conversionFunnel = [
    { stage: 'Website Visitors', count: 10000, rate: 100 },
    { stage: 'Lead Magnet', count: 1500, rate: 15 },
    { stage: 'Qualified Leads', count: 450, rate: 4.5 },
    { stage: 'Demos Booked', count: 180, rate: 1.8 },
    { stage: 'Proposals Sent', count: 90, rate: 0.9 },
    { stage: 'Closed Won', count: 27, rate: 0.27 },
  ];

  return {
    revenueHistory,
    clientGrowth,
    conversionFunnel,
  };
}

function getTimeFilter(timeframe: string): string {
  const now = new Date();
  const days = {
    '7d': 7,
    '30d': 30,
    '90d': 90,
    '1y': 365,
  }[timeframe] || 30;
  
  const filterDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return filterDate.toISOString().split('T')[0];
}

function getPreviousPeriodFilter(timeframe: string): string {
  const now = new Date();
  const days = {
    '7d': 14,
    '30d': 60,
    '90d': 180,
    '1y': 730,
  }[timeframe] || 60;
  
  const filterDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return filterDate.toISOString().split('T')[0];
}

function getTierColor(tier: string): string {
  const colors = {
    starter: '#10B981',
    professional: '#3B82F6',
    enterprise: '#8B5CF6',
    custom: '#F59E0B',
  };
  return colors[tier as keyof typeof colors] || '#6B7280';
}

function getTierLifetime(tier: string): number {
  const lifetimes = {
    starter: 18,
    professional: 24,
    enterprise: 36,
    custom: 48,
  };
  return lifetimes[tier as keyof typeof lifetimes] || 24;
}

function getMonthsArray(timeframe: string): string[] {
  const months: string[] = [];
  const now = new Date();
  const monthCount = {
    '7d': 1,
    '30d': 3,
    '90d': 6,
    '1y': 12,
  }[timeframe] || 6;
  
  for (let i = monthCount - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
  }
  
  return months;
}

function getNextMonth(month: string): string {
  const [year, monthNum] = month.split('-').map(Number);
  const nextDate = new Date(year, monthNum, 1); // monthNum is already 1-based
  return `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}`;
}

function formatMonth(month: string): string {
  const [year, monthNum] = month.split('-');
  const date = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
}