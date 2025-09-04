import { NextResponse } from 'next/server';
import { readVideoList, writeVideoList, Video, VideoList } from '@/lib/videoUtils';

/**
 * 处理 GET 请求，获取视频列表。
 * @returns 包含视频列表的JSON响应。
 */
export async function GET() {
  try {
    const videoList = await readVideoList();
    return NextResponse.json(videoList.list);
  } catch (error) {
    console.error('Failed to read video list:', error);
    return NextResponse.json({ error: 'Failed to load video list' }, { status: 500 });
  }
}

/**
 * 处理 POST 请求，添加新视频。
 * @param request 包含新视频数据的请求对象。
 * @returns 包含新视频信息的JSON响应。
 */
export async function POST(request: Request) {
  try {
    const newVideoData = await request.json();
    let videoList = await readVideoList();

    const newVideo: Video = {
      id: Date.now().toString(), // 简单的唯一ID生成方式
      createdAt: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }), // 自动赋值创建时间，格式化为中文日期和时间
      ...newVideoData,
    };

    videoList.list.push(newVideo);
    await writeVideoList(videoList);

    return NextResponse.json(newVideo, { status: 201 });
  } catch (error) {
    console.error('Failed to add video:', error);
    return NextResponse.json({ error: 'Failed to add video' }, { status: 500 });
  }
}