import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { videoName, content } = await req.json();

    if (!videoName || !content) {
      return NextResponse.json({ error: 'Missing videoName or content' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'public', 'data', 'videos', videoName, 'content.txt');

    fs.writeFileSync(filePath, content);

    return NextResponse.json({ message: 'Content saved successfully' });
  } catch (error: any) {
    console.error('Error saving content:', error);
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
}