'use client';

import React, { useEffect, useState } from 'react';
import { Video } from '@/lib/videoUtils';
import { toast } from 'sonner';
import { AddVideoDialog } from './components/AddVideoDialog';
import { ContentDialog } from './components/ContentDialog';
import { ImagePromptDialog } from './components/ImagePromptDialog';
import { ViewImageDialog } from './components/ViewImageDialog';
import { VideoListItem } from './components/VideoListItem';

async function getVideoList(): Promise<Video[]> {
  const res = await fetch('/api/videoList');
  if (!res.ok) {
    throw new Error('Failed to fetch video list');
  }
  const data = await res.json();
  return data;
}

export default function VideoListPage() {
  const [videoList, setVideoList] = useState<Video[]>([]);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showContentDialog, setShowContentDialog] = useState(false);
  const [currentVideoName, setCurrentVideoName] = useState('');
  const [showImagePromptDialog, setShowImagePromptDialog] = useState(false);

  const fetchVideoData = async () => {
    const data = await getVideoList();
    setVideoList(data);
  };

  useEffect(() => {
    fetchVideoData();
  }, []);

  const handleGenerateVideo = async (videoName: string) => {
    toast.loading('正在生成视频...');
    try {
      const response = await fetch('/api/generateVideo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoName }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
      } else {
        toast.error(`Error: ${data.error}`);
      }
    } catch (error: any) {
      console.error('Failed to generate video:', error);
      toast.error('Failed to generate video.');
    } finally {
      toast.dismiss();
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    toast.loading('正在删除视频...'); 
    try {
      const response = await fetch(`/api/videoList/${videoId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('视频删除成功');
        fetchVideoData(); // Refresh the video list
      } else {
        console.error('视频删除失败');
        toast.error('视频删除失败');
      }
    } catch (error: any) {
      console.error('删除视频时发生错误:', error);
      toast.error('删除视频时发生错误');
    } finally {
      toast.dismiss();
    }
  };

  const handleAIParse = async (videoName: string) => {
    try {
      const response = await fetch('/api/aiParse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoName }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error: any) {
      console.error('Failed to generate video:', error);
      alert('Failed to generate video.');
    }
  };

  const handleGenerateAudio = async (videoName: string) => {
    toast.loading('正在生成音频...');
    try {
      const response = await fetch('/api/generateAudio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoName }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
      } else {
        toast.error(`Error: ${data.error}`);
      }
    } catch (error: any) {
      console.error('Failed to generate audio:', error);
      toast.error('Failed to generate audio.');
    } finally {
      toast.dismiss();
    }
  };

  const handleViewContent = (videoName: string) => {
    setCurrentVideoName(videoName);
    setShowContentDialog(true);
  };

  const handleViewImagePrompt = (videoName: string) => {
    setCurrentVideoName(videoName);
    setShowImagePromptDialog(true);
  };

  const handleGenerateImage = async (videoName: string) => {
    toast.loading('正在生成图片...');
    try {
      const response = await fetch('/api/generateImage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoName }),
      });
      if (!response.ok) {
        throw new Error(`Failed to generate images for ${videoName}`);
      }
      toast.success(`所有图片已生成并保存到 ${videoName}/images/ 目录下`);
    } catch (error: any) {
      console.error("Error generating images:", error);
      toast.error(`生成图片失败: ${error.message}`)
    } finally {
      toast.dismiss();
    }
  };

  const handleViewImage = (videoName: string) => {
    setCurrentVideoName(videoName);
    setShowImageDialog(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">视频列表</h1>

      <AddVideoDialog fetchVideoData={fetchVideoData} />

      <ContentDialog 
        videoName={currentVideoName} 
        showContentDialog={showContentDialog} 
        setShowContentDialog={setShowContentDialog} 
      />

      <ImagePromptDialog 
        videoName={currentVideoName} 
        showImagePromptDialog={showImagePromptDialog} 
        setShowImagePromptDialog={setShowImagePromptDialog} 
      />

      <ViewImageDialog 
        videoName={currentVideoName} 
        showImageDialog={showImageDialog} 
        setShowImageDialog={setShowImageDialog} 
      />

      <ul className="space-y-2">
        {videoList.map((video) => (
          <VideoListItem
            key={video.id}
            video={video}
            handleAIParse={handleAIParse}
            handleViewContent={handleViewContent}
            handleViewImagePrompt={handleViewImagePrompt}
            handleGenerateImage={handleGenerateImage}
            handleViewImage={handleViewImage}
            handleGenerateAudio={handleGenerateAudio}
            handleGenerateVideo={handleGenerateVideo}
            handleDeleteVideo={handleDeleteVideo}
            fetchVideoData={fetchVideoData}
          />
        ))}
      </ul>
    </div>
  );
}