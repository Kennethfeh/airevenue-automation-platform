import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET() {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    checks: {
      database: 'unknown',
      redis: 'unknown',
      openai: 'unknown',
      memory: 'unknown',
      uptime: process.uptime(),
    },
  };

  let overallStatus = 'healthy';

  try {
    // Database health check
    const { error: dbError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    healthCheck.checks.database = dbError ? 'unhealthy' : 'healthy';
    if (dbError) overallStatus = 'degraded';
  } catch (error) {
    healthCheck.checks.database = 'unhealthy';
    overallStatus = 'unhealthy';
  }

  try {
    // Memory check
    const memoryUsage = process.memoryUsage();
    const memoryUsageMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
    healthCheck.checks.memory = memoryUsageMB < 500 ? 'healthy' : 'warning';
    
    if (memoryUsageMB > 1000) {
      overallStatus = 'degraded';
    }
  } catch (error) {
    healthCheck.checks.memory = 'unhealthy';
    overallStatus = 'degraded';
  }

  try {
    // OpenAI API check (simplified)
    if (process.env.OPENAI_API_KEY) {
      healthCheck.checks.openai = 'healthy';
    } else {
      healthCheck.checks.openai = 'unhealthy';
      overallStatus = 'degraded';
    }
  } catch (error) {
    healthCheck.checks.openai = 'unhealthy';
    overallStatus = 'degraded';
  }

  healthCheck.status = overallStatus;

  const statusCode = overallStatus === 'healthy' ? 200 : 
                    overallStatus === 'degraded' ? 200 : 503;

  return NextResponse.json(healthCheck, { status: statusCode });
}