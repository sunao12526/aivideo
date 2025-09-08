import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import * as fs from 'fs';

export async function POST(req: NextRequest) {
  try {
    const { videoName, imageData, index } = await req.json();

    if (!videoName || !imageData || index === undefined) {
      return NextResponse.json({ error: 'videoName, imageData, and index are required' }, { status: 400 });
    }

    const baseDir = process.cwd();
    const outputDir = path.join(baseDir, 'public', 'data', 'videos', videoName, 'images');

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const imageBuffer = Buffer.from(imageData, 'base64');
    const imagePath = path.join(outputDir, `image_${index}.png`);
    fs.writeFileSync(imagePath, imageBuffer);

    return NextResponse.json({ message: `Image saved to ${imagePath}` });
  } catch (error) {
    console.error('Error saving image:', error);
    return NextResponse.json({ error: 'Failed to save image' }, { status: 500 });
  }
}