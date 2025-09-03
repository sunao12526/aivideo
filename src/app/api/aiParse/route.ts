import { NextRequest, NextResponse } from 'next/server';
import { generateText } from '@/lib/google-ai';
import path from 'path';
import * as fs from 'fs';
import { parseVideoScript } from '@/lib/videoCreator';

export async function POST(req: NextRequest) {
  try {
    const { videoName } = await req.json();

    if (!videoName) {
      return NextResponse.json({ error: 'videoName is required' }, { status: 400 });
    }

    // 读取prompt文件内容
    const baseDir = process.cwd();
    const promptPath = path.join(baseDir, 'public', 'data', 'geminiCreateVideoPrompt.md');
    const promptContent = fs.readFileSync(promptPath, 'utf8');
    const prompt = promptContent.replace('{{theme}}', videoName);
    console.log(prompt);

    // In a real application, you would send the video to a service that can process it
    // and then use the AI to analyze the transcript or visual content.
    // For this example, we'll just simulate the AI response based on the URL.

    const text = await generateText(prompt);
    console.log(text);

    // 保存Gemini的回答到文件
    const outputDir = path.join(baseDir, 'public', 'data', 'videos', videoName);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    const outputPath = path.join(outputDir, 'geminiCreateVideopPompt.txt');
    fs.writeFileSync(outputPath, text);
    console.log(`Gemini's response saved to ${outputPath}`);

    await parseVideoScript(videoName);
    return NextResponse.json({ analysis: 'text' });
  } catch (error) {
    console.error('Error in AI parsing:', error);
    return NextResponse.json({ error: 'Failed to parse video with AI' }, { status: 500 });
  }
}