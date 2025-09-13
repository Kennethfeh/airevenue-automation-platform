import { createMocks } from 'node-mocks-http';
import { GET } from '@/app/api/analytics/dashboard/route';
import { createClient } from '@supabase/supabase-js';

// Mock Supabase
jest.mock('@supabase/supabase-js');

const mockSupabaseData = {
  billing_records: [
    { amount: 3500, currency: 'USD', billing_period_start: '2024-01-01', client_id: '1' },
    { amount: 4000, currency: 'USD', billing_period_start: '2024-02-01', client_id: '2' },
    { amount: 2500, currency: 'USD', billing_period_start: '2024-03-01', client_id: '3' },
  ],
  clients: [
    { id: '1', monthly_price: 3500, plan_type: 'professional', status: 'active' },
    { id: '2', monthly_price: 4000, plan_type: 'enterprise', status: 'active' },
    { id: '3', monthly_price: 2500, plan_type: 'starter', status: 'active' },
  ],
  prospects: [
    { 
      id: 'p1', 
      status: 'won', 
      created_at: '2024-01-15T10:00:00Z', 
      lead_score: 85,
      email: 'test1@example.com',
      full_name: 'Test User 1'
    },
    { 
      id: 'p2', 
      status: 'qualified', 
      created_at: '2024-02-10T10:00:00Z', 
      lead_score: 72,
      email: 'test2@example.com',
      full_name: 'Test User 2'
    },
    { 
      id: 'p3', 
      status: 'new', 
      created_at: '2024-03-05T10:00:00Z', 
      lead_score: 45,
      email: 'test3@example.com',
      full_name: 'Test User 3'
    },
  ],
};

const mockSupabase = {
  from: jest.fn((table: string) => ({
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    lte: jest.fn().mockReturnThis(),
    lt: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    then: jest.fn((callback) => {
      const data = mockSupabaseData[table as keyof typeof mockSupabaseData];
      return Promise.resolve(callback({ data, error: null }));
    }),
  })),
};

// Setup mock to return our mock instance
(createClient as jest.Mock).mockReturnValue(mockSupabase);

describe('/api/analytics/dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup consistent mock responses
    mockSupabase.from.mockImplementation((table: string) => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gte: jest.fn().mockReturnThis(),
        lte: jest.fn().mockReturnThis(),
        lt: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnThis(),
      };

      // Add a promise-like behavior
      Object.assign(mockQuery, {
        then: jest.fn((callback) => {
          const data = mockSupabaseData[table as keyof typeof mockSupabaseData] || [];
          return Promise.resolve(callback({ data, error: null }));
        }),
      });

      return mockQuery;
    });
  });

  describe('GET', () => {
    it('should return dashboard data for 30d timeframe', async () => {
      const { req } = createMocks({
        method: 'GET',
        url: '/api/analytics/dashboard?timeframe=30d',
      });

      const response = await GET(req as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('revenueMetrics');
      expect(data).toHaveProperty('clientMetrics');
      expect(data).toHaveProperty('performanceMetrics');
      expect(data).toHaveProperty('revenueOptimization');
      expect(data).toHaveProperty('trends');
      expect(data).toHaveProperty('lastUpdated');
    });

    it('should return proper revenue metrics structure', async () => {
      const { req } = createMocks({
        method: 'GET',
        url: '/api/analytics/dashboard?timeframe=30d',
      });

      const response = await GET(req as any);
      const data = await response.json();

      expect(data.revenueMetrics).toMatchObject({
        totalRevenue: expect.any(Number),
        monthlyGrowth: expect.any(Number),
        annualRecurring: expect.any(Number),
        projectedRevenue: expect.any(Number),
        revenueByTier: expect.any(Array),
      });

      // Check revenue by tier structure
      if (data.revenueMetrics.revenueByTier.length > 0) {
        expect(data.revenueMetrics.revenueByTier[0]).toMatchObject({
          name: expect.any(String),
          value: expect.any(Number),
          color: expect.any(String),
        });
      }
    });

    it('should return proper client metrics structure', async () => {
      const { req } = createMocks({
        method: 'GET',
        url: '/api/analytics/dashboard?timeframe=30d',
      });

      const response = await GET(req as any);
      const data = await response.json();

      expect(data.clientMetrics).toMatchObject({
        totalClients: expect.any(Number),
        newClients: expect.any(Number),
        churnRate: expect.any(Number),
        avgLifetimeValue: expect.any(Number),
        clientsByTier: expect.any(Array),
      });
    });

    it('should return performance metrics', async () => {
      const { req } = createMocks({
        method: 'GET',
        url: '/api/analytics/dashboard?timeframe=30d',
      });

      const response = await GET(req as any);
      const data = await response.json();

      expect(data.performanceMetrics).toMatchObject({
        conversionRate: expect.any(Number),
        avgDealSize: expect.any(Number),
        salesCycleLength: expect.any(Number),
        customerSatisfaction: expect.any(Number),
      });

      // Validate ranges
      expect(data.performanceMetrics.conversionRate).toBeGreaterThanOrEqual(0);
      expect(data.performanceMetrics.conversionRate).toBeLessThanOrEqual(100);
      expect(data.performanceMetrics.customerSatisfaction).toBeGreaterThanOrEqual(0);
      expect(data.performanceMetrics.customerSatisfaction).toBeLessThanOrEqual(5);
    });

    it('should return revenue optimization data', async () => {
      const { req } = createMocks({
        method: 'GET',
        url: '/api/analytics/dashboard?timeframe=30d',
      });

      const response = await GET(req as any);
      const data = await response.json();

      expect(data.revenueOptimization).toMatchObject({
        opportunities: expect.any(Array),
        pricingRecommendations: expect.any(Array),
      });

      // Check opportunities structure
      if (data.revenueOptimization.opportunities.length > 0) {
        expect(data.revenueOptimization.opportunities[0]).toMatchObject({
          title: expect.any(String),
          impact: expect.any(Number),
          effort: expect.any(String),
          status: expect.stringMatching(/pending|in_progress|completed/),
          roi: expect.any(Number),
        });
      }

      // Check pricing recommendations structure
      if (data.revenueOptimization.pricingRecommendations.length > 0) {
        expect(data.revenueOptimization.pricingRecommendations[0]).toMatchObject({
          client: expect.any(String),
          currentPrice: expect.any(Number),
          recommendedPrice: expect.any(Number),
          impact: expect.any(Number),
        });
      }
    });

    it('should return trend data with proper structure', async () => {
      const { req } = createMocks({
        method: 'GET',
        url: '/api/analytics/dashboard?timeframe=90d',
      });

      const response = await GET(req as any);
      const data = await response.json();

      expect(data.trends).toMatchObject({
        revenueHistory: expect.any(Array),
        clientGrowth: expect.any(Array),
        conversionFunnel: expect.any(Array),
      });

      // Check revenue history structure
      if (data.trends.revenueHistory.length > 0) {
        expect(data.trends.revenueHistory[0]).toMatchObject({
          month: expect.any(String),
          revenue: expect.any(Number),
          target: expect.any(Number),
        });
      }

      // Check conversion funnel structure
      expect(data.trends.conversionFunnel).toHaveLength(6); // Should have 6 stages
      expect(data.trends.conversionFunnel[0]).toMatchObject({
        stage: expect.any(String),
        count: expect.any(Number),
        rate: expect.any(Number),
      });
    });

    it('should handle different timeframe parameters', async () => {
      const timeframes = ['7d', '30d', '90d', '1y'];

      for (const timeframe of timeframes) {
        const { req } = createMocks({
          method: 'GET',
          url: `/api/analytics/dashboard?timeframe=${timeframe}`,
        });

        const response = await GET(req as any);
        expect(response.status).toBe(200);

        const data = await response.json();
        expect(data).toHaveProperty('revenueMetrics');
        expect(data).toHaveProperty('lastUpdated');
      }
    });

    it('should default to 30d when no timeframe specified', async () => {
      const { req } = createMocks({
        method: 'GET',
        url: '/api/analytics/dashboard',
      });

      const response = await GET(req as any);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty('revenueMetrics');
    });

    it('should handle database errors gracefully', async () => {
      // Mock database error
      mockSupabase.from.mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gte: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        then: jest.fn(() => Promise.reject(new Error('Database connection failed'))),
      }));

      const { req } = createMocks({
        method: 'GET',
        url: '/api/analytics/dashboard?timeframe=30d',
      });

      const response = await GET(req as any);
      expect(response.status).toBe(500);

      const data = await response.json();
      expect(data).toMatchObject({
        error: 'Failed to fetch dashboard data',
      });
    });

    it('should validate timeframe parameter', async () => {
      const { req } = createMocks({
        method: 'GET',
        url: '/api/analytics/dashboard?timeframe=invalid',
      });

      const response = await GET(req as any);
      
      // Should still return 200 but default to 30d behavior
      expect(response.status).toBe(200);
    });

    it('should return consistent data types for calculations', async () => {
      const { req } = createMocks({
        method: 'GET',
        url: '/api/analytics/dashboard?timeframe=30d',
      });

      const response = await GET(req as any);
      const data = await response.json();

      // All revenue values should be numbers
      expect(typeof data.revenueMetrics.totalRevenue).toBe('number');
      expect(typeof data.revenueMetrics.monthlyGrowth).toBe('number');
      expect(typeof data.revenueMetrics.annualRecurring).toBe('number');

      // All client metrics should be numbers
      expect(typeof data.clientMetrics.totalClients).toBe('number');
      expect(typeof data.clientMetrics.churnRate).toBe('number');
      expect(typeof data.clientMetrics.avgLifetimeValue).toBe('number');

      // Performance metrics should be in valid ranges
      expect(data.performanceMetrics.conversionRate).toBeGreaterThanOrEqual(0);
      expect(data.performanceMetrics.customerSatisfaction).toBeLessThanOrEqual(5);
    });
  });
});