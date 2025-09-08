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
    const baseDir = process.cwd();
    const imagePromptsPath = path.join(baseDir, 'public', 'data', 'videos', videoName, 'imagePrompts.json');
    if (!fs.existsSync(imagePromptsPath)) {
      return NextResponse.json({ error: `imagePrompts.json not found for ${videoName}` }, { status: 404 });
    }
    const imagePrompts = JSON.parse(fs.readFileSync(imagePromptsPath, 'utf8'));
    // console.log(imagePrompts);

    const result = await runPlaywrightTest("tests/api-test.spec.ts", { videoName });
    //  const result = await runPlaywrightTest("tests/jimeng-create.spec.ts", { videoName });
    console.log(result);

    return NextResponse.json({ message: `Images generated and saved for ${videoName}` });
  } catch (error) {
    console.error('Error generating images:', error);
    return NextResponse.json({ error: 'Failed to generate images' }, { status: 500 });
  }
}