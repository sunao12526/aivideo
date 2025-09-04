import { NextResponse } from 'next/server';
import { readVideoList, writeVideoList, Video, VideoList } from '@/lib/videoUtils';

/**
 * 处理 GET 请求，根据ID获取单个视频。
 * @param request 请求对象。
 * @param params 包含视频ID的参数。
 * @returns 包含视频信息的JSON响应，如果未找到则返回404。
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const videoList = await readVideoList();
    const video = videoList.list.find((v) => v.id === id);

    if (video) {
      return NextResponse.json(video);
    } else {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Failed to get video:', error);
    return NextResponse.json({ error: 'Failed to retrieve video' }, { status: 500 });
  }
}

/**
 * 处理 PUT 请求，根据ID更新单个视频。
 * @param request 包含更新视频数据的请求对象。
 * @param params 包含视频ID的参数。
 * @returns 包含更新后视频信息的JSON响应，如果未找到则返回404。
 */
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const updatedVideoData = await request.json();

    let videoList = await readVideoList();
    const videoIndex = videoList.list.findIndex((v) => v.id === id);

    if (videoIndex !== -1) {
      videoList.list[videoIndex] = { ...videoList.list[videoIndex], ...updatedVideoData };
      await writeVideoList(videoList);
      return NextResponse.json(videoList.list[videoIndex]);
    } else {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Failed to update video:', error);
    return NextResponse.json({ error: 'Failed to update video' }, { status: 500 });
  }
}

/**
 * 处理 DELETE 请求，根据ID删除单个视频。
 * @param request 请求对象。
 * @param params 包含视频ID的参数。
 * @returns 删除成功消息的JSON响应，如果未找到则返回404。
 */
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    let videoList = await readVideoList();
    const initialLength = videoList.list.length;
    videoList.list = videoList.list.filter((v) => v.id !== id);

    if (videoList.list.length < initialLength) {
      await writeVideoList(videoList);
      return NextResponse.json({ message: 'Video deleted successfully' });
    } else {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Failed to delete video:', error);
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 });
  }
}