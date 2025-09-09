import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import * as fs from 'fs';
import { runPlaywrightTest } from '@/lib/playwright-runner';

export async function POST(req: NextRequest) {
  try {
    const { videoName } = await req.json();

    if (!videoName) {
      return NextResponse.json({ error: 'videoName is required' }, { status: 400 });
    }

    const result = await runPlaywrightTest("tests/jimeng-create.spec.ts", { videoName });
    console.log(result);
    
    return NextResponse.json({ message: `Images generated and saved for ${videoName}` });
  } catch (error) {
    console.error('Error generating images:', error);
    return NextResponse.json({ error: 'Failed to generate images' }, { status: 500 });
  }
}