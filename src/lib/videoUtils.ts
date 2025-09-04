import { promises as fs } from 'fs';
import path from 'path';

// 定义视频接口，包含视频的ID、名称、描述、图片路径和音频路径
export interface Video {
  id: string;
  name: string;
  description: string;
  imagePath: string;
  audioPath: string;
  createdAt: string;
}

// 定义视频列表接口，包含一个视频数组
export interface VideoList {
  list: Video[];
}

// 视频列表JSON文件的路径
const VIDEO_LIST_PATH = path.join(process.cwd(), 'public', 'data', 'videoList.json');

/**
 * 读取视频列表数据。
 * @returns 包含视频列表的Promise对象。
 */
export async function readVideoList(): Promise<VideoList> {
  try {
    const fileContents = await fs.readFile(VIDEO_LIST_PATH, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Failed to read video list:', error);
    // 如果文件不存在或读取失败，返回一个空列表
    return { list: [] };
  }
}

/**
 * 写入视频列表数据。
 * @param data 要写入的视频列表数据。
 * @returns Promise对象，表示写入操作的完成。
 */
export async function writeVideoList(data: VideoList): Promise<void> {
  try {
    await fs.writeFile(VIDEO_LIST_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Failed to write video list:', error);
    throw new Error('Failed to save video list');
  }
}