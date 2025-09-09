'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Video } from '@/lib/videoUtils';
import { EditVideoDialog } from './EditVideoDialog';

interface VideoListItemProps {
  video: Video;
  handleAIParse: (videoName: string) => void;
  handleViewContent: (videoName: string) => void;
  handleViewImagePrompt: (videoName: string) => void;
  handleGenerateImage: (videoName: string) => void;
  handleViewImage: (videoName: string) => void;
  handleGenerateAudio: (videoName: string) => void;
  handleGenerateVideo: (videoName: string) => void;
  handleDeleteVideo: (videoId: string) => void;
  fetchVideoData: () => void;
}

export function VideoListItem({ 
  video, 
  handleAIParse, 
  handleViewContent, 
  handleViewImagePrompt, 
  handleGenerateImage, 
  handleViewImage, 
  handleGenerateAudio, 
  handleGenerateVideo, 
  handleDeleteVideo,
  fetchVideoData
}: VideoListItemProps) {
  return (
    <li key={video.id} className="bg-gray-100 p-3 rounded-md shadow-sm">
      <Link href={video.name} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
        {video.name}
      </Link>
      <p className="text-sm text-gray-500">创建时间: {video.createdAt}</p>
      <div className="mt-2 space-x-2">
        <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => handleAIParse(video.name)}>
          AI解析
        </button>
        <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => handleViewContent(video.name)}>
          查看内容
        </button>
        <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => handleViewImagePrompt(video.name)}>
          查看图片提示词
        </button>
        <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => handleGenerateImage(video.name)}>
          生成图片
        </button>
        <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => handleViewImage(video.name)}>
          查看图片
        </button>
        <button className="ml-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600" onClick={() => handleGenerateAudio(video.name)}>
          生成音频
        </button>
        
        <button
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={() => handleGenerateVideo(video.name)}
        >
          生成视频
        </button>
        <EditVideoDialog video={video} fetchVideoData={fetchVideoData} />

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">删除</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>确定要删除吗？</AlertDialogTitle>
              <AlertDialogDescription>
                此操作无法撤销。这将永久删除视频。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleDeleteVideo(video.id)}>删除</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </li>
  );
}