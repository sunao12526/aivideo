import { NextResponse } from 'next/server';
// import ffmpeg from 'fluent-ffmpeg';
import { VideoCreator } from '@/lib/videoCreator'
import path from 'path';
import * as fs from 'fs';


export async function POST(request: Request) {
  try {
    const { videoName } = await request.json();

    if (!videoName) {
      return NextResponse.json({ error: 'Video URL is required' }, { status: 400 });
    }

    // Here you would implement your video generation logic using fluent-ffmpeg
    // For demonstration, let's just log the URL and return a success message.
    console.log(`Received request to generate video for URL: ${videoName}`);

    // 单个视频创建示例
    const inputAudio = path.join('public', 'data', 'videos', videoName, 'audio', 'speech.mp3');
    const outputVideo = path.join('public', 'data', 'videos', videoName,'video', 'video.mp4');
    const imageDir = path.join('public', 'data', 'videos', videoName, 'images');
    const imageFiles = fs.readdirSync(imageDir)
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

    const inputImages = imageFiles.map(file => path.join(imageDir, file));
    const result = await VideoCreator.createVideoFromImagesAndAudio({
      inputImages,
      inputAudio: inputAudio,
      outputVideo: outputVideo,
    });

    if (result.success) {
      console.log('视频创建成功:', result.outputPath);
    } else {
      console.error('视频创建失败:', result.error);
    }
    return NextResponse.json({ message: `Video generation initiated for ${videoName}` });
  } catch (error) {
    console.error('Error generating video:', error);
    return NextResponse.json({ error: 'Failed to generate video' }, { status: 500 });
  }
}