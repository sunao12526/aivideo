import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { videoName, prompts } = await req.json();

    if (!videoName || !prompts) {
      return NextResponse.json({ error: 'Missing videoName or prompts' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'public', 'data', 'videos', videoName, 'imagePrompts.json');

    await fs.promises.writeFile(filePath, JSON.stringify(prompts, null, 2));

    return NextResponse.json({ message: 'Prompts saved successfully' });
  } catch (error: any) {
    console.error('Error saving prompts:', error);
    return NextResponse.json({ error: 'Failed to save prompts' }, { status: 500 });
  }
}