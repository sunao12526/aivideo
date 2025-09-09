import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { videoName, imageUrl } = await req.json();

    if (!videoName || !imageUrl) {
      return NextResponse.json({ error: 'Missing videoName or imageUrl' }, { status: 400 });
    }
     console.log(imageUrl)
    // Extract the relative path from the imageUrl
    const imagePath = path.join(process.cwd(), 'public',imageUrl);
    // Check if the file exists before attempting to delete
    try {
      await fs.access(imagePath);
    } catch (error) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    await fs.unlink(imagePath);
    return NextResponse.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}