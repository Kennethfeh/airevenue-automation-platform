import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Simple prospect capture logic
    console.log('Prospect captured:', body);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Prospect captured successfully',
      prospect: body 
    });
  } catch (error) {
    console.error('Prospect capture error:', error);
    return NextResponse.json(
      { error: 'Failed to capture prospect' },
      { status: 500 }
    );
  }
}