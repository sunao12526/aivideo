import { NextRequest, NextResponse } from 'next/server';
import { VideoCreator } from '@/lib/videoCreator';
import path from 'path';
import fs from 'fs';

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, videoName } = await req.json();
   
    if (!imageUrl || !videoName) {
      return NextResponse.json({ message: 'Missing imageUrl or videoName' }, { status: 400 });
    }

    const imagePath = path.join('public',imageUrl);
 
    const outputImagePath = path.join('public', 'data', 'videos', videoName, 'images','index-0-0.png');
 
    const result = await VideoCreator.addTextToImage({
      imagePath,
      text: '光绪为啥干不过慈禧？权力、变法与一场注定失败的较量！',
      outputPath: outputImagePath,
    });
    console.log(result);
    if (result.success) {
      return NextResponse.json({ message: 'Text added successfully', imageUrl: path.join('data', 'videos', videoName, 'images','index-0-0.png') });
    } else {
      return NextResponse.json({ message: `Failed to add text: ${result.error}` }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error adding text to image:', error);
    return NextResponse.json({ message: `Error adding text to image: ${error.message}` }, { status: 500 });
  }
}