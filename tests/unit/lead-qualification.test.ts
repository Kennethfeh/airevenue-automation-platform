import { LeadQualificationEngine } from '@/lib/ai/lead-qualification';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// Mock dependencies
jest.mock('@supabase/supabase-js');
jest.mock('openai');

const mockSupabase = {
  from: jest.fn().mockReturnThis(),
  insert: jest.fn().mockResolvedValue({ error: null }),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
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

describe('LeadQualificationEngine', () => {
  let engine: LeadQualificationEngine;
  
  beforeEach(() => {
    engine = new LeadQualificationEngine();
    jest.clearAllMocks();
  });

  describe('qualifyLead', () => {
    const mockLeadData = {
      email: 'ceo@techcorp.com',
      fullName: 'John Smith',
      companyName: 'TechCorp Solutions',
      website: 'https://techcorp.com',
      industry: 'technology',
      companySize: '100-500',
      currentVolume: 5000,
      painPoints: ['high support costs', 'long response times'],
      source: 'google-ads',
      jobTitle: 'CEO',
    };

    beforeEach(() => {
      // Mock company enrichment
      mockOpenAI.chat.completions.create
        .mockResolvedValueOnce({
          choices: [{
            message: {
              content: JSON.stringify({
                revenue: 15000000,
                employees: 250,
                techStack: ['React', 'Node.js'],
                fundingStage: 'Series B',
                budgetCapacity: 'high',
                decisionMakers: ['CEO', 'CTO'],
                painPoints: ['scaling customer support'],
              }),
            },
          }],
        })
        // Mock industry enrichment
        .mockResolvedValueOnce({
          choices: [{
            message: {
              content: JSON.stringify({
                averageVolume: 8000,
                budgetRange: '3000-8000',
                roiExpectations: '300%',
                adoptionRate: 'high',
              }),
            },
          }],
        })
        // Mock AI qualification
        .mockResolvedValueOnce({
          choices: [{
            message: {
              content: JSON.stringify({
                baseScore: 75,
                reasoning: 'Strong fit: High revenue, clear pain points, decision maker contact',
                urgency: 'high',
                nextSteps: ['Schedule demo call', 'Send ROI calculation'],
                closeTime: '30 days',
                risks: ['Competitive evaluation'],
                opportunities: ['Upsell to enterprise tier'],
              }),
            },
          }],
        });
    });

    it('should qualify enterprise tier leads correctly', async () => {
      const result = await engine.qualifyLead(mockLeadData);

      expect(result).toMatchObject({
        tier: 'enterprise',
        urgency: 'high',
        nextSteps: expect.arrayContaining(['Schedule demo call']),
        recommendedPrice: expect.any(Number),
        revenueProjection: expect.any(Number),
      });
      expect(result.score).toBeGreaterThan(80);
      expect(result.recommendedPrice).toBeGreaterThanOrEqual(2500);
    });

    it('should handle professional tier leads', async () => {
      const professionalLeadData = {
        ...mockLeadData,
        companySize: '25-100',
        currentVolume: 2000,
      };

      // Mock lower score for professional tier
      mockOpenAI.chat.completions.create.mockResolvedValueOnce({
        choices: [{
          message: {
            content: JSON.stringify({
              revenue: 5000000,
              employees: 75,
              budgetCapacity: 'medium',
            }),
          },
        }],
      }).mockResolvedValueOnce({
        choices: [{ message: { content: JSON.stringify({}) } }],
      }).mockResolvedValueOnce({
        choices: [{
          message: {
            content: JSON.stringify({
              baseScore: 65,
              reasoning: 'Good fit: Medium company, clear need',
              urgency: 'medium',
            }),
          },
        }],
      });

      const result = await engine.qualifyLead(professionalLeadData);

      expect(result.tier).toBe('professional');
      expect(result.score).toBeLessThan(80);
      expect(result.score).toBeGreaterThanOrEqual(60);
    });

    it('should identify unqualified leads', async () => {
      const unqualifiedLead = {
        email: 'info@smallbiz.com',
        fullName: 'Jane Doe',
        companySize: '1-5',
        currentVolume: 100,
      };

      mockOpenAI.chat.completions.create
        .mockResolvedValueOnce({
          choices: [{
            message: {
              content: JSON.stringify({
                revenue: 100000,
                employees: 3,
                budgetCapacity: 'low',
              }),
            },
          }],
        })
        .mockResolvedValueOnce({
          choices: [{ message: { content: JSON.stringify({}) } }],
        })
        .mockResolvedValueOnce({
          choices: [{
            message: {
              content: JSON.stringify({
                baseScore: 25,
                reasoning: 'Poor fit: Too small, insufficient budget',
                urgency: 'low',
              }),
            },
          }],
        });

      const result = await engine.qualifyLead(unqualifiedLead);

      expect(result.tier).toBe('unqualified');
      expect(result.score).toBeLessThan(40);
    });

    it('should store qualified leads in database', async () => {
      await engine.qualifyLead(mockLeadData);

      expect(mockSupabase.from).toHaveBeenCalledWith('prospects');
      expect(mockSupabase.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          email: mockLeadData.email,
          full_name: mockLeadData.fullName,
          company_name: mockLeadData.companyName,
          lead_score: expect.any(Number),
          audit_data: expect.objectContaining({
            qualification: expect.any(Object),
            recommended_price: expect.any(Number),
          }),
        })
      );
    });

    it('should calculate revenue projections accurately', async () => {
      const result = await engine.qualifyLead(mockLeadData);

      expect(result.revenueProjection).toBeGreaterThan(0);
      // Enterprise tier should have higher projections
      if (result.tier === 'enterprise') {
        expect(result.revenueProjection).toBeGreaterThan(50000);
      }
    });

    it('should handle API failures gracefully', async () => {
      mockOpenAI.chat.completions.create.mockRejectedValue(
        new Error('OpenAI API error')
      );

      await expect(engine.qualifyLead(mockLeadData))
        .rejects.toThrow('OpenAI API error');
    });
  });

  describe('batchQualifyLeads', () => {
    const mockLeads = [
      {
        email: 'ceo1@company1.com',
        fullName: 'Alice Johnson',
        companyName: 'Company 1',
      },
      {
        email: 'ceo2@company2.com',
        fullName: 'Bob Wilson',
        companyName: 'Company 2',
      },
      {
        email: 'ceo3@company3.com',
        fullName: 'Carol Brown',
        companyName: 'Company 3',
      },
    ];

    beforeEach(() => {
      // Mock responses for batch processing
      mockOpenAI.chat.completions.create
        .mockResolvedValue({
          choices: [{
            message: {
              content: JSON.stringify({
                baseScore: 70,
                reasoning: 'Good qualification',
                urgency: 'medium',
                nextSteps: ['Follow up'],
                closeTime: '45 days',
                risks: [],
                opportunities: ['Upsell potential'],
              }),
            },
          }],
        });
    });

    it('should process leads in batches', async () => {
      const results = await engine.batchQualifyLeads(mockLeads);

      expect(results).toHaveLength(3);
      expect(results.every(result => result.score > 0)).toBe(true);
    });

    it('should respect batch size limits', async () => {
      const largeBatch = Array(12).fill(null).map((_, i) => ({
        email: `test${i}@company.com`,
        fullName: `Test User ${i}`,
        companyName: `Company ${i}`,
      }));

      const results = await engine.batchQualifyLeads(largeBatch);

      expect(results).toHaveLength(12);
      // Should have processed in batches of 5
      expect(mockOpenAI.chat.completions.create.mock.calls.length).toBeGreaterThan(12);
    });
  });

  describe('score calculation', () => {
    it('should apply company size bonuses correctly', () => {
      // This would test the private calculateCompositeScore method
      // For now, we test through the public interface
      const largeCompanyLead = {
        email: 'ceo@largecorp.com',
        fullName: 'CEO Large',
        companySize: '500+',
        industry: 'e-commerce',
      };

      mockOpenAI.chat.completions.create
        .mockResolvedValue({
          choices: [{ message: { content: JSON.stringify({ employees: 1000, revenue: 50000000 }) } }],
        })
        .mockResolvedValue({
          choices: [{ message: { content: JSON.stringify({}) } }],
        })
        .mockResolvedValue({
          choices: [{
            message: {
              content: JSON.stringify({
                baseScore: 60,
                reasoning: 'Base qualification',
              }),
            },
          }],
        });

      return engine.qualifyLead(largeCompanyLead).then(result => {
        // Score should be boosted due to large company size and high-volume industry
        expect(result.score).toBeGreaterThan(60);
      });
    });
  });
});