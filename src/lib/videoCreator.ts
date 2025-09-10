import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';

/**
 * Helper function to get the duration of an audio file using ffprobe.
 * @param audioPath - The absolute path to the audio file.
 * @returns A promise that resolves with the duration in seconds.
 */
const getAudioDuration = (audioPath: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(audioPath, (err, metadata) => {
      if (err) {
        return reject(new Error(`ffprobe error: ${err.message}`));
      }
      if (metadata.format && typeof metadata.format.duration === 'number') {
        resolve(metadata.format.duration);
      } else {
        reject(new Error('Could not retrieve audio duration.'));
      }
    });
  });
};

export async function createAudio(videoName: string) {
  const baseDir = process.cwd();
  const contentPath = path.join(baseDir, 'public', 'data', 'videos', videoName, 'content.txt');
  const audioOutputPath = path.join(baseDir, 'public', 'data', 'videos', videoName, 'audio.mp3');

  if (!fs.existsSync(contentPath)) {
    throw new Error(`Content file not found for video: ${videoName}`);
  }

  const content = fs.readFileSync(contentPath, 'utf8');

  // Using edge-tts to convert text to speech
  // You might need to install it: pip install edge-tts
  // And ensure it's in your PATH or provide the full path to the executable
  const command = `edge-tts --text "${content}" --write-media "${audioOutputPath}" --voice zh-CN-XiaoyiNeural`;

  return new Promise<void>((resolve, reject) => {
    exec(command, (error: any, stdout: any, stderr: any) => {
      if (error) {
        console.error(`exec error: ${error}`);
        console.error(`stderr: ${stderr}`);
        return reject(new Error(`Failed to generate audio: ${error.message}`));
      }
      console.log(`Audio generated: ${stdout}`);
      resolve();
    });
  });
}



export async function parseVideoScript(videoName: string) {
  const baseDir = process.cwd();
  const scriptPath = path.join(baseDir, 'public', 'data', 'videos', videoName, 'geminiCreateVideopPompt.txt');
  const scriptContent = fs.readFileSync(scriptPath, 'utf8');

  const contentMatch = scriptContent.match(/视频脚本旁白内容：\n([\s\S]*?)(?=\n视频图片的中文提示词：|$)/);
  const imagePromptsMatch = scriptContent.match(/视频图片的中文提示词：\n```json\n([\s\S]*?)\n```/);

  if (contentMatch && contentMatch[1]) {
    const content = contentMatch[1].trim();
    const contentPath = path.join(baseDir, 'public', 'data', 'videos', videoName, 'content.txt');
    fs.writeFileSync(contentPath, content);
    console.log(`Video content saved to ${contentPath}`);
  }

  if (imagePromptsMatch && imagePromptsMatch[1]) {
    const imagePrompts = JSON.parse(imagePromptsMatch[1]);
    const imagePromptsPath = path.join(baseDir, 'public', 'data', 'videos', videoName, 'imagePrompts.json');
    fs.writeFileSync(imagePromptsPath, JSON.stringify(imagePrompts, null, 2));
    console.log(`Image prompts saved to ${imagePromptsPath}`);
  }

  if (!contentMatch && !imagePromptsMatch) {
    console.warn('No video content or image prompts found in the script.');
  }
}

/**
 * Interface for the result of a video creation operation.
 */
interface VideoCreationResult {
  success: boolean;
  outputPath: string;
  duration: number;
  error?: string;
}

/**
 * Interface for the options for creating a video from images and audio.
 */
interface VideoFromImagesAndAudioOptions {
  inputImages: string[];
  inputAudio: string;
  outputVideo: string;
  resolution?: string;
}

/**
 * Interface for the options for adding text to an image.
 */
interface AddTextToImageOptions {
  imagePath: string;
  text: string;
  outputPath: string;
  x?: string;
  y?: string;
  boxColor?: string;
}

/**
 * Interface for the result of adding text to an image.
 */
interface TextToImageResult {
  success: boolean;
  outputPath: string;
  error?: string;
}

/**
 * A class to create videos from images and audio using ffmpeg.
 */
export class VideoCreator {
  /**
   * Creates a video from multiple images and a single audio file.
   * The video's duration is determined by the audio file's duration.
   * Each image is displayed for 5 seconds, with the last image filling the remaining time.
   * @param options - The options for video creation.
   * @returns A promise that resolves with the result of the video creation.
   */
  static async createVideoFromImagesAndAudio(options: VideoFromImagesAndAudioOptions): Promise<VideoCreationResult> {
    const { inputImages, inputAudio, outputVideo, resolution = '720x1280' } = options;
    const [width, height] = resolution.split('x').map(Number);
    const baseDir = process.cwd();
    const fullOutputVideoPath = path.join(baseDir, outputVideo);

    if (!inputImages || inputImages.length === 0) {
      return {
        success: false,
        outputPath: outputVideo,
        duration: 0,
        error: 'No input images provided.',
      };
    }

    const fullAudioPath = path.join(baseDir, inputAudio);
    if (!fs.existsSync(fullAudioPath)) {
      return {
        success: false,
        outputPath: outputVideo,
        duration: 0,
        error: `Input audio file not found: ${fullAudioPath}`,
      };
    }

    try {
      const audioDuration = await getAudioDuration(fullAudioPath);
      const command = ffmpeg();
      const imageDisplayDuration = 5;
      let complexFilter: string[] = [];
      let videoStreams = '';
      let imageCount = 0;

      for (let i = 0; i < inputImages.length; i++) {
        const fullImagePath = path.join(baseDir, inputImages[i]);
        if (!fs.existsSync(fullImagePath)) {
          console.warn(`Input image file not found, skipping: ${fullImagePath}`);
          continue;
        }

        const timePassed = imageCount * imageDisplayDuration;

        if (timePassed >= audioDuration) {
          break; // No more time left for more images
        }

        let duration;
        if (i < inputImages.length - 1) {
          duration = Math.min(imageDisplayDuration, audioDuration - timePassed);
        } else { // last image
          duration = audioDuration - timePassed;
        }

        if (duration > 0) {
          command.input(fullImagePath);
          command.inputOptions([`-loop`, `1`, `-t`, `${duration}`]);
          // Scale and pad the image to fit the resolution
          complexFilter.push(`[${imageCount}:v]scale=${resolution}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2:color=black,setsar=1[v${imageCount}]`);
          videoStreams += `[v${imageCount}]`;
          imageCount++;
        }
      }

      if (imageCount === 0) {
        return {
          success: false,
          outputPath: outputVideo,
          duration: 0,
          error: 'No valid input images found or audio duration is too short.',
        };
      }

      command.input(fullAudioPath);

      complexFilter.push(`${videoStreams}concat=n=${imageCount}:v=1:a=0[outv]`);

      return new Promise<VideoCreationResult>((resolve) => {
        command
          .complexFilter(complexFilter)
          .outputOptions([
            '-map', '[outv]',
            '-map', `${imageCount}:a`,
            '-c:v', 'libx264',
            '-pix_fmt', 'yuv420p', // for compatibility
            '-c:a', 'aac',
            '-shortest',
          ])
          .output(fullOutputVideoPath)
          .on('start', (commandLine) => {
            console.log('FFmpeg command: ' + commandLine);
          })
          .on('end', () => {
            resolve({
              success: true,
              outputPath: outputVideo,
              duration: audioDuration,
            });
          })
          .on('error', (err, stdout, stderr) => {
            console.error('ffmpeg stderr:', stderr);
            resolve({
              success: false,
              outputPath: outputVideo,
              duration: 0,
              error: err.message,
            });
          })
          .run();
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return {
        success: false,
        outputPath: outputVideo,
        duration: 0,
        error: errorMessage,
      };
    }
  }

  /**
   * Adds text to an image using ffmpeg.
   * @param options - The options for adding text to the image.
   * @returns A promise that resolves with the result of the operation.
   */
  static async addTextToImage(options: AddTextToImageOptions): Promise<TextToImageResult> {
    const {
      imagePath,
      text,
      outputPath,
      x = '(w-text_w)/2',
      y = '200',
      boxColor = '#FDDF05',
    } = options;

    const fullImagePath = path.join(process.cwd(), imagePath);
    const fullOutputPath = path.join(process.cwd(), outputPath);

    if (!fs.existsSync(fullImagePath)) {
      return {
        success: false,
        outputPath,
        error: `Input image file not found: ${fullImagePath}`,
      };
    }

    return new Promise<TextToImageResult>((resolve) => {
    
      let wrappedText;
      const textToRender = text.substring(0, 27);
      const len = textToRender.length;

      if (len <= 9) {
        wrappedText = textToRender;
      } else if (len <= 18) {
        wrappedText = `${textToRender.substring(0, 9)}\n${textToRender.substring(9)}`;
      } else {
        wrappedText = `${textToRender.substring(0, 9)}\n${textToRender.substring(9, 18)}\n${textToRender.substring(18)}`;
      }

      let videoFilter = `drawtext=text='${wrappedText}':fontcolor=black:fontsize=80:x=${x}:y=${y}`;
      if (boxColor) {
        videoFilter += `:box=1:boxcolor=${boxColor}:boxborderw=20:shadowcolor=${boxColor}`;
      }
      ffmpeg(fullImagePath)
        .videoFilter(videoFilter)
        .output(fullOutputPath)
        .on('end', () => {
          resolve({
            success: true,
            outputPath,
          });
        })
        .on('error', (err) => {
          resolve({
            success: false,
            outputPath,
            error: err.message,
          });
        })
        .run();
    });
  }
}

