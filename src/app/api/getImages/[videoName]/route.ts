import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import * as fs from 'fs';

export async function GET(req: NextRequest, { params }: { params: { videoName: string } }) {
  try {
    const { videoName } = params;

    if (!videoName) {
      return NextResponse.json({ error: 'videoName is required' }, { status: 400 });
    }

    const baseDir = process.cwd();
    const imagesDir = path.join(baseDir, 'public', 'data', 'videos', videoName, 'images');

    if (!fs.existsSync(imagesDir)) {
      return NextResponse.json({ images: [] });
    }

    // const files = fs.readdirSync(imagesDir);
    // const imageFiles = files.filter(file => file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg'));
    const imageFiles = fs.readdirSync(imagesDir)
      .filter(file => file.endsWith('.png'))
      .sort((a, b) => {
        const getOrder = (filename: string) => {
          const match = filename.match(/(\d+)-(\d+)\.png$/);
          if (match) {
            return parseInt(match[1]) * 100 + parseInt(match[2]);
          }
          return Infinity;
        };
        return getOrder(a) - getOrder(b);
      });
    const imageUrls = imageFiles.map(file => `/data/videos/${videoName}/images/${file}`);


    
    return NextResponse.json({ images: imageUrls });
  } catch (error) {
    console.error('Error getting images:', error);
    return NextResponse.json({ error: 'Failed to get images' }, { status: 500 });
  }
}