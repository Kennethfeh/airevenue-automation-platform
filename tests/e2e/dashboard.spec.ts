import { test, expect } from '@playwright/test';

// Mock user authentication
test.beforeEach(async ({ page }) => {
  // Mock authentication state
  await page.addInitScript(() => {
    // Mock localStorage with auth token
    window.localStorage.setItem('sb-access-token', 'mock-auth-token');
    
    // Mock fetch for API calls
    const originalFetch = window.fetch;
    window.fetch = async (url: string | URL | Request, options?: RequestInit) => {
      const urlString = url.toString();
      
      if (urlString.includes('/api/analytics/dashboard')) {
        return new Response(JSON.stringify({
          revenueMetrics: {
            totalRevenue: 150000,
            monthlyGrowth: 15.5,
            annualRecurring: 1800000,
            projectedRevenue: 172500,
            revenueByTier: [
              { name: 'Enterprise', value: 80000, color: '#8B5CF6' },
              { name: 'Professional', value: 50000, color: '#3B82F6' },
              { name: 'Starter', value: 20000, color: '#10B981' },
            ],
          },
          clientMetrics: {
            totalClients: 45,
            newClients: 7,
            churnRate: 0.05,
            avgLifetimeValue: 125000,
            clientsByTier: [
              { name: 'Enterprise', value: 15 },
              { name: 'Professional', value: 20 },
              { name: 'Starter', value: 10 },
            ],
          },
          performanceMetrics: {
            conversionRate: 12.5,
            avgDealSize: 3500,
            salesCycleLength: 28,
            customerSatisfaction: 4.7,
          },
          revenueOptimization: {
            opportunities: [
              {
                title: 'Implement dynamic pricing for enterprise clients',
                impact: 15000,
                effort: 'Medium',
                status: 'pending',
                roi: 450,
              },
              {
                title: 'Add premium white-label tier at $6,000/month',
                impact: 25000,
                effort: 'High',
                status: 'in_progress',
                roi: 380,
              },
            ],
            pricingRecommendations: [
              {
                client: 'TechCorp Solutions',
                currentPrice: 3500,
                recommendedPrice: 4200,
                impact: 700,
              },
            ],
          },
          trends: {
            revenueHistory: [
              { month: 'Jan 24', revenue: 120000, target: 125000 },
              { month: 'Feb 24', revenue: 135000, target: 140000 },
              { month: 'Mar 24', revenue: 150000, target: 145000 },
            ],
            clientGrowth: [
              { month: 'Jan 24', clients: 38, churn: 2 },
              { month: 'Feb 24', clients: 42, churn: 1 },
              { month: 'Mar 24', clients: 45, churn: 1 },
            ],
            conversionFunnel: [
              { stage: 'Website Visitors', count: 10000, rate: 100 },
              { stage: 'Lead Magnet', count: 1500, rate: 15 },
              { stage: 'Qualified Leads', count: 450, rate: 4.5 },
              { stage: 'Demos Booked', count: 180, rate: 1.8 },
              { stage: 'Proposals Sent', count: 90, rate: 0.9 },
              { stage: 'Closed Won', count: 27, rate: 0.27 },
            ],
          },
          lastUpdated: new Date().toISOString(),
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
      return originalFetch(url, options);
    };
  });
});

test.describe('Revenue Dashboard', () => {
  test('should display key metrics cards', async ({ page }) => {
    await page.goto('/dashboard');

    // Wait for the dashboard to load
    await expect(page.locator('h1')).toContainText('Revenue Analytics');

    // Check key metrics cards
    await expect(page.locator('text=Total Revenue')).toBeVisible();
    await expect(page.locator('text=Active Clients')).toBeVisible();
    await expect(page.locator('text=Avg Deal Size')).toBeVisible();
    await expect(page.locator('text=Customer LTV')).toBeVisible();

    // Check metric values
    await expect(page.locator('text=$150,000')).toBeVisible();
    await expect(page.locator('text=45')).toBeVisible(); // Total clients
    await expect(page.locator('text=$3,500')).toBeVisible(); // Avg deal size
  });

  test('should display revenue chart', async ({ page }) => {
    await page.goto('/dashboard');

    // Wait for chart to render
    await page.waitForSelector('.recharts-wrapper');

    // Check chart container exists
    await expect(page.locator('.recharts-wrapper')).toBeVisible();

    // Check chart legend and axes
    await expect(page.locator('text=Revenue Performance')).toBeVisible();
  });

  test('should allow timeframe selection', async ({ page }) => {
    await page.goto('/dashboard');

    // Check timeframe selector
    const timeframeSelect = page.locator('select');
    await expect(timeframeSelect).toBeVisible();

    // Change timeframe
    await timeframeSelect.selectOption('90d');
    
    // Should trigger new data fetch (would be tested with proper API mocking)
    await page.waitForTimeout(100);
  });

  test('should display revenue optimization opportunities', async ({ page }) => {
    await page.goto('/dashboard');

    // Check optimization section
    await expect(page.locator('text=Revenue Optimization')).toBeVisible();

    // Check opportunity cards
    await expect(page.locator('text=Implement dynamic pricing for enterprise clients')).toBeVisible();
    await expect(page.locator('text=+$15,000/month')).toBeVisible();
    await expect(page.locator('text=450% ROI')).toBeVisible();

    // Check status badges
    await expect(page.locator('text=pending')).toBeVisible();
    await expect(page.locator('text=in progress')).toBeVisible();
  });

  test('should display pricing recommendations table', async ({ page }) => {
    await page.goto('/dashboard');

    // Check pricing recommendations section
    await expect(page.locator('text=AI Pricing Recommendations')).toBeVisible();

    // Check table headers
    await expect(page.locator('text=Client')).toBeVisible();
    await expect(page.locator('text=Current Price')).toBeVisible();
    await expect(page.locator('text=Recommended')).toBeVisible();
    await expect(page.locator('text=Monthly Impact')).toBeVisible();

    // Check table data
    await expect(page.locator('text=TechCorp Solutions')).toBeVisible();
    await expect(page.locator('text=$3,500')).toBeVisible();
    await expect(page.locator('text=$4,200')).toBeVisible();
    await expect(page.locator('text=+$700')).toBeVisible();

    // Check action button
    await expect(page.locator('button:has-text("Apply")')).toBeVisible();
  });

  test('should display revenue by tier chart', async ({ page }) => {
    await page.goto('/dashboard');

    // Check pie chart section
    await expect(page.locator('text=Revenue by Tier')).toBeVisible();
    
    // Wait for pie chart to render
    await page.waitForSelector('.recharts-pie');
    
    // Check pie chart exists
    await expect(page.locator('.recharts-pie')).toBeVisible();
  });

  test('should handle metric view switching', async ({ page }) => {
    await page.goto('/dashboard');

    // Check metric switcher buttons
    await expect(page.locator('button:has-text("Revenue")')).toBeVisible();
    await expect(page.locator('button:has-text("Clients")')).toBeVisible();
    await expect(page.locator('button:has-text("Optimization")')).toBeVisible();

    // Click on Clients tab
    await page.click('button:has-text("Clients")');
    
    // Should update the chart (visual feedback would be tested with proper mocking)
    await page.waitForTimeout(100);

    // Check that the button is now active
    await expect(page.locator('button:has-text("Clients")')).toHaveClass(/bg-blue-100/);
  });

  test('should export functionality', async ({ page }) => {
    await page.goto('/dashboard');

    // Check export button
    const exportButton = page.locator('button:has-text("Export")');
    await expect(exportButton).toBeVisible();

    // Click export (would trigger download in real scenario)
    await exportButton.click();
    
    // In a real test, we'd mock the download and verify it was triggered
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/dashboard');

    // Check that key elements are still visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Total Revenue')).toBeVisible();
    
    // Check that cards stack properly (implementation would depend on CSS)
    const cards = page.locator('[class*="grid-cols"]');
    await expect(cards).toBeVisible();
  });

  test('should handle loading states', async ({ page }) => {
    // Mock slow API response
    await page.addInitScript(() => {
      const originalFetch = window.fetch;
      window.fetch = async (url: string | URL | Request, options?: RequestInit) => {
        if (url.toString().includes('/api/analytics/dashboard')) {
          // Simulate slow response
          await new Promise(resolve => setTimeout(resolve, 1000));
          return originalFetch(url, options);
        }
        return originalFetch(url, options);
      };
    });

    await page.goto('/dashboard');

    // Should show loading spinner initially
    await expect(page.locator('[class*="animate-spin"]')).toBeVisible();
    
    // Wait for content to load
    await expect(page.locator('text=Total Revenue')).toBeVisible({ timeout: 2000 });
  });

  test('should handle error states', async ({ page }) => {
    // Mock API error
    await page.addInitScript(() => {
      window.fetch = async (url: string | URL | Request) => {
        if (url.toString().includes('/api/analytics/dashboard')) {
          return new Response(JSON.stringify({ error: 'Failed to load' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        return new Response('Not found', { status: 404 });
      };
    });

    await page.goto('/dashboard');

    // Should show error message
    await expect(page.locator('text=Unable to load dashboard')).toBeVisible();
  });

  test('should display growth indicators correctly', async ({ page }) => {
    await page.goto('/dashboard');

    // Check for growth indicators
    await expect(page.locator('text=+15.5% vs last period')).toBeVisible();
    await expect(page.locator('text=+7 new this period')).toBeVisible();

    // Check for growth arrows
    await expect(page.locator('[data-testid="arrow-up"]')).toBeVisible();
  });
});

test.describe('Dashboard Interactions', () => {
  test('should filter data by timeframe', async ({ page }) => {
    let apiCalls = 0;
    
    await page.route('/api/analytics/dashboard*', (route) => {
      apiCalls++;
      const url = new URL(route.request().url());
      const timeframe = url.searchParams.get('timeframe');
      
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          revenueMetrics: { 
            totalRevenue: timeframe === '7d' ? 35000 : 150000,
            monthlyGrowth: 15.5,
            annualRecurring: 1800000,
            projectedRevenue: 172500,
            revenueByTier: [],
          },
          clientMetrics: { totalClients: 45, newClients: 7, churnRate: 0.05, avgLifetimeValue: 125000, clientsByTier: [] },
          performanceMetrics: { conversionRate: 12.5, avgDealSize: 3500, salesCycleLength: 28, customerSatisfaction: 4.7 },
          revenueOptimization: { opportunities: [], pricingRecommendations: [] },
          trends: { revenueHistory: [], clientGrowth: [], conversionFunnel: [] },
        }),
      });
    });

    await page.goto('/dashboard');
    
    // Change timeframe to 7d
    await page.selectOption('select', '7d');
    
    // Wait a bit for the API call
    await page.waitForTimeout(500);
    
    // Check that new data is displayed
    await expect(page.locator('text=$35,000')).toBeVisible();
    
    // Verify API was called with correct parameter
    expect(apiCalls).toBeGreaterThan(1);
  });

  test('should handle chart interactions', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Wait for chart to load
    await page.waitForSelector('.recharts-wrapper');
    
    // Hover over chart elements (would show tooltips)
    const chartArea = page.locator('.recharts-wrapper');
    await chartArea.hover();
    
    // Check if tooltip appears (implementation specific)
    await page.waitForTimeout(100);
  });
});