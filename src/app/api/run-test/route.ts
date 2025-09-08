import { NextRequest, NextResponse } from 'next/server';
import { runPlaywrightTest } from '@/lib/playwright-runner';

export async function POST(req: NextRequest) {
  try {
    const { testFile, params } = await req.json();

    if (!testFile) {
      return NextResponse.json({ error: 'testFile is required' }, { status: 400 });
    }

    const result = await runPlaywrightTest(testFile, params || {});

    return NextResponse.json(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to run test', details: errorMessage }, { status: 500 });
  }
}