'use client';

import { Button } from '@/components/ui/button';
import { Video } from '@/lib/videoUtils';
import { EditVideoDialog } from './EditVideoDialog';
import { toast } from 'sonner';
import { DeleteVideoDialog } from './DeleteVideoDialog';
import { Sparkles, Eye, ImagePlus, Image, FileImage, Music, Video as VideoIcon } from 'lucide-react';

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
  fetchVideoData: () => Promise<void>;
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

  const handleViewAudio = (videoName: string) => {
    const audioUrl = `/data/videos/${videoName}/audio/speech.mp3`;
    fetch(audioUrl, { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          window.open(audioUrl, '_blank');
        } else {
          toast.error('音频文件不存在或无法访问。');
        }
      })
      .catch(error => {
        console.error('检查音频文件时发生错误:', error);
        toast.error('检查音频文件时发生错误。');
      });
  };

  const handleViewVideo = (videoName: string) => {
    const videoUrl = `/data/videos/${videoName}/video/video.mp4`;
    fetch(videoUrl, { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          window.open(videoUrl, '_blank');
        } else {
          toast.error('视频文件不存在或无法访问。');
        }
      })
      .catch(error => {
        console.error('检查视频文件时发生错误:', error);
        toast.error('检查视频文件时发生错误。');
      });
  };

  const copyToClipboard = async (text: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        toast.success('视频名称已复制到剪贴板！')
      } catch (err) {
        console.error('无法复制文本: ', err);
        fallbackCopyToClipboard(text);
      }
    } else {
      fallbackCopyToClipboard(text);
    }
  };

  const fallbackCopyToClipboard = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed'; // Avoid scrolling to bottom of page in MS Edge.
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      toast.success('视频名称已复制到剪贴板！')
    } catch (err) {
      console.error('Fallback: 无法复制文本: ', err);
      toast.error('复制失败，请手动复制。');
    }
    document.body.removeChild(textArea);
  };

  return (
    <li key={video.id} className="bg-gray-100 p-3 rounded-md shadow-sm">
      <div className="flex items-center justify-between">
        <span
          onClick={() => copyToClipboard(video.name)}
          className="text-blue-600 hover:underline cursor-pointer"
          tabIndex={0}
          role="Button"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              copyToClipboard(video.name);
            }
          }}
        >
          {video.name}
        </span>
        <div className="flex items-center space-x-2">
          <EditVideoDialog video={video} fetchVideoData={fetchVideoData} />
          <DeleteVideoDialog video={video} handleDeleteVideo={handleDeleteVideo} />
        </div>
      </div>
      <p className="text-sm text-gray-500">创建时间: {video.createdAt}</p>
      <div className="flex items-center mt-2 space-x-2">
        <Button onClick={() => handleAIParse(video.name)}>
          <Sparkles className="w-4 h-4 mr-2" />
          AI解析
        </Button>
        <div>-----</div>
        <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => handleViewContent(video.name)}>
          <Eye className="w-4 h-4 mr-2" />
          查看内容
        </Button>
        <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => handleViewImagePrompt(video.name)}>
          <ImagePlus className="w-4 h-4 mr-2" />
          查看图片提示词
        </Button>
        <div>-----</div>
        <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => handleGenerateImage(video.name)}>
          <Image className="w-4 h-4 mr-2" />
          生成图片
        </Button>
        <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => handleViewImage(video.name)}>
          <FileImage className="w-4 h-4 mr-2" />
          查看图片
        </Button>

      </div>
      <div className="flex items-center mt-2 space-x-2">
        <Button className="bg-green-500 hover:bg-green-600" onClick={() => handleGenerateAudio(video.name)}>
          <Music className="w-4 h-4 mr-2" />
          生成音频
        </Button>
        <Button className="bg-green-500 hover:bg-green-600" onClick={() => handleViewAudio(video.name)}>
          <Music className="w-4 h-4 mr-2" />
          查看音频
        </Button>
        <div>-----</div>
        <Button
          className="bg-yellow-500 hover:bg-yellow-600"
          onClick={() => handleGenerateVideo(video.name)}
        >
          <VideoIcon className="w-4 h-4 mr-2" />
          生成视频
        </Button>
        <Button className="bg-yellow-500 hover:bg-yellow-600" onClick={() => handleViewVideo(video.name)}>
          <VideoIcon className="w-4 h-4 mr-2" />
          查看视频
        </Button>
      </div>
    </li>
  );
}