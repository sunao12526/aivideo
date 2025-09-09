import { NextRequest, NextResponse } from 'next/server';
import { runPlaywrightTest } from '@/lib/playwright-runner';
export async function POST(req: NextRequest) {
  try {
    const { videoName } = await req.json();

    if (!videoName) {
      return NextResponse.json({ error: 'Video name is required' }, { status: 400 });
    }
    const result = await runPlaywrightTest("tests/createAudio.spec.ts", { videoName });
    console.log(result);

    return NextResponse.json({ message: 'Audio generation started successfully' });
  } catch (error: any) {
    console.error('Error generating audio:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}