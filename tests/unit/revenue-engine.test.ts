import { RevenueOptimizationEngine } from '@/lib/ai/revenue-engine';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// Mock dependencies
jest.mock('@supabase/supabase-js');
jest.mock('openai');

const mockSupabase = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
};

const mockOpenAI = {
  chat: {
    completions: {
      create: jest.fn(),
    },
  },
};

(createClient as jest.Mock).mockReturnValue(mockSupabase);
(OpenAI as jest.Mock).mockImplementation(() => mockOpenAI);

describe('RevenueOptimizationEngine', () => {
  let engine: RevenueOptimizationEngine;
  
  beforeEach(() => {
    engine = new RevenueOptimizationEngine();
    jest.clearAllMocks();
  });

  describe('analyzeRevenueOptimization', () => {
    const mockData = {
      clientId: 'client-123',
      historicalRevenue: [10000, 12000, 15000, 18000],
      customerLifetimeValue: 50000,
      churnRate: 0.05,
      acquisitionCost: 2500,
      industryMetrics: {
        averageTicketSize: 3500,
        seasonalTrends: [1.0, 1.2, 0.9, 1.1],
        competitorPricing: [3000, 3500, 4000],
      },
      marketingChannels: [
        { channel: 'google-ads', cost: 5000, conversions: 25, roi: 0.4 },
        { channel: 'linkedin', cost: 3000, conversions: 15, roi: 0.6 },
      ],
    };

    beforeEach(() => {
      mockOpenAI.chat.completions.create
        .mockResolvedValueOnce({
          choices: [{
            message: {
              content: JSON.stringify({
                growthOpportunities: ['Pricing optimization', 'Channel expansion'],
                costOptimization: ['Reduce acquisition cost'],
                insights: 'Strong revenue growth trajectory',
              }),
            },
          }],
        })
        .mockResolvedValueOnce({
          choices: [{
            message: {
              content: JSON.stringify([
                {
                  name: 'Dynamic pricing implementation',
                  revenueImpact: 15000,
                  steps: ['Analyze pricing elasticity', 'Implement A/B tests'],
                  timeframe: '90 days',
                  investment: 10000,
                  roi: 450,
                },
                {
                  name: 'Channel optimization',
                  revenueImpact: 8000,
                  steps: ['Optimize LinkedIn campaigns'],
                  timeframe: '30 days',
                  investment: 3000,
                  roi: 267,
                },
              ]),
            },
          }],
        });

      mockSupabase.from.mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ error: null }),
        }),
      });
    });

    it('should generate revenue optimization recommendations', async () => {
      const result = await engine.analyzeRevenueOptimization(mockData);

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        strategy: 'Dynamic pricing implementation',
        expectedImpact: 15000,
        priority: 'high',
        roi: 450,
      });
      expect(result[1]).toMatchObject({
        strategy: 'Channel optimization',
        expectedImpact: 8000,
        priority: 'medium',
        roi: 267,
      });
    });

    it('should prioritize recommendations by ROI', async () => {
      const result = await engine.analyzeRevenueOptimization(mockData);

      // Should be sorted by ROI descending
      expect(result[0].roi).toBeGreaterThan(result[1].roi);
      expect(result[0].priority).toBe('high');
    });

    it('should store recommendations in Supabase', async () => {
      await engine.analyzeRevenueOptimization(mockData);

      expect(mockSupabase.from).toHaveBeenCalledWith('clients');
      expect(mockSupabase.from().update).toHaveBeenCalledWith({
        performance_metrics: expect.objectContaining({
          revenue_optimization: expect.objectContaining({
            recommendations: expect.any(Array),
            generated_at: expect.any(String),
          }),
        }),
      });
    });

    it('should handle OpenAI API errors gracefully', async () => {
      mockOpenAI.chat.completions.create.mockRejectedValueOnce(
        new Error('OpenAI API error')
      );

      await expect(engine.analyzeRevenueOptimization(mockData))
        .rejects.toThrow();
    });
  });

  describe('generateDynamicPricing', () => {
    beforeEach(() => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: {
                id: 'client-123',
                company_name: 'Test Corp',
                industry: 'technology',
                monthly_price: 3000,
              },
            }),
          }),
        }),
      });

      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{
          message: {
            content: JSON.stringify({
              price: 3500,
              minPrice: 3000,
              maxPrice: 4500,
              reasoning: 'Value-based pricing with market premium',
              confidence: 0.88,
            }),
          },
        }],
      });
    });

    it('should generate pricing recommendations', async () => {
      const result = await engine.generateDynamicPricing(
        'client-123',
        'premium-support',
        { competitors: [3200, 3800, 4200] }
      );

      expect(result).toMatchObject({
        recommendedPrice: 3500,
        priceRange: { min: 3000, max: 4500 },
        reasoning: 'Value-based pricing with market premium',
        confidenceScore: 0.88,
      });
    });

    it('should enforce minimum pricing of $2500', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{
          message: {
            content: JSON.stringify({
              price: 2000, // Below minimum
              minPrice: 1800,
              maxPrice: 2200,
              reasoning: 'Low market positioning',
              confidence: 0.6,
            }),
          },
        }],
      });

      const result = await engine.generateDynamicPricing(
        'client-123',
        'basic-support',
        {}
      );

      expect(result.recommendedPrice).toBeGreaterThanOrEqual(2500);
      expect(result.priceRange.min).toBeGreaterThanOrEqual(2500);
    });
  });

  describe('generateRevenueForecast', () => {
    beforeEach(() => {
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: {
                monthly_price: 3500,
                industry: 'saas',
              },
            }),
          }),
        }),
      }).mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: [
                { amount: 3500, billing_period_start: '2024-01-01' },
                { amount: 3500, billing_period_start: '2024-02-01' },
                { amount: 4000, billing_period_start: '2024-03-01' },
              ],
            }),
          }),
        }),
      });

      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{
          message: {
            content: JSON.stringify({
              forecast: [4000, 4200, 4400, 4600],
              scenarios: {
                conservative: [3800, 3900, 4000, 4100],
                optimistic: [4500, 4800, 5100, 5400],
                aggressive: [5000, 5500, 6000, 6500],
              },
              confidence: 0.82,
              keyFactors: ['Market expansion', 'Product improvements'],
            }),
          },
        }],
      });
    });

    it('should generate revenue forecasts with scenarios', async () => {
      const result = await engine.generateRevenueForecast('client-123', 4);

      expect(result).toMatchObject({
        forecast: [4000, 4200, 4400, 4600],
        scenarios: {
          conservative: expect.any(Array),
          optimistic: expect.any(Array),
          aggressive: expect.any(Array),
        },
        confidence: 0.82,
        keyFactors: expect.arrayContaining(['Market expansion']),
      });
    });

    it('should handle missing historical data', async () => {
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { monthly_price: 3000 },
            }),
          }),
        }),
      }).mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: null,
            }),
          }),
        }),
      });

      const result = await engine.generateRevenueForecast('client-123');

      expect(result).toBeDefined();
      expect(Array.isArray(result.forecast)).toBe(true);
    });
  });
});