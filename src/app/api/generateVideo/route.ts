import { NextResponse } from 'next/server';
// import ffmpeg from 'fluent-ffmpeg';
import { VideoCreator } from '@/lib/videoCreator'
import path from 'path';


export async function POST(request: Request) {
  try {
    const { videoUrl } = await request.json();

    if (!videoUrl) {
      return NextResponse.json({ error: 'Video URL is required' }, { status: 400 });
    }

    // Here you would implement your video generation logic using fluent-ffmpeg
    // For demonstration, let's just log the URL and return a success message.
    console.log(`Received request to generate video for URL: ${videoUrl}`);

    // Example: You might want to process the video here
    // ffmpeg(videoUrl).output('output.mp4').run();


    // 单个视频创建示例
    const inputImage = path.join('public', 'data', 'input', 'image1.png');
    const inputImage1 = path.join('public', 'data', 'input', 'image2.png');
    const inputImage2 = path.join('public', 'data', 'input', 'image3.png');
    const inputAudio = path.join('public', 'data', 'input', 'audio.mp3');
    const outputVideo = path.join('public', 'data', 'output', 'video.mp4');
    const result = await VideoCreator.createVideoFromImagesAndAudio({
      inputImages: [inputImage, inputImage1, inputImage2],
      inputAudio: inputAudio,
      outputVideo: outputVideo,
    });

    if (result.success) {
      console.log('视频创建成功:', result.outputPath);
    } else {
      console.error('视频创建失败:', result.error);
    }
    return NextResponse.json({ message: `Video generation initiated for ${videoUrl}` });
  } catch (error) {
    console.error('Error generating video:', error);
    return NextResponse.json({ error: 'Failed to generate video' }, { status: 500 });
  }
}