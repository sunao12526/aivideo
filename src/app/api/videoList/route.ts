import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'videoList.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    return NextResponse.json(data.list);
  } catch (error) {
    console.error('Failed to read video list:', error);
    return NextResponse.json({ error: 'Failed to load video list' }, { status: 500 });
  }
}