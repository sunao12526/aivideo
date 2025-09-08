'use client';

import React from 'react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Video } from '@/lib/videoUtils';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';


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
  const [newVideoName, setNewVideoName] = useState('');
  const [newVideoDescription, setNewVideoDescription] = useState('');
  const [newVideoImagePath, setNewVideoImagePath] = useState('');
  const [newVideoAudioPath, setNewVideoAudioPath] = useState('');

  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [editVideoName, setEditVideoName] = useState('');
  const [editVideoDescription, setEditVideoDescription] = useState('');
  const [editVideoImagePath, setEditVideoImagePath] = useState('');
  const [editVideoAudioPath, setEditVideoAudioPath] = useState('');
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [showAddVideoDialog, setShowAddVideoDialog] = useState(false);
  const [showContentDialog, setShowContentDialog] = useState(false);
  const [currentContent, setCurrentContent] = useState('');
  const [currentVideoName, setCurrentVideoName] = useState('');
  const [showImagePromptDialog, setShowImagePromptDialog] = useState(false);
  const [currentImagePrompts, setCurrentImagePrompts] = useState<string[]>([]);
  const [currentVideoNameForPrompts, setCurrentVideoNameForPrompts] = useState('');


  const fetchVideoData = async () => {
    const data = await getVideoList();
    setVideoList(data);
  };

  const handleSaveEdit = async () => {
    if (!editingVideo) {
      toast.error('请先选择要编辑的视频');
      return;
    };

    try {
      const response = await fetch(`/api/videoList/${editingVideo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editVideoName,
          description: editVideoDescription,
          imagePath: editVideoImagePath,
          audioPath: editVideoAudioPath,
        }),
      });

      if (response.ok) {
        toast.success('视频修改成功');
        await fetchVideoData();
        setEditingVideo(null);  
      } else {
        console.error('视频修改失败');
      }
    } catch (error: any) {
      console.error('修改视频时发生错误:', error);
    }
  };

  const handleAddVideo = async () => {
    // TODO: 实现新增视频的逻辑，包括发送请求到后端 API
    console.log('添加视频:', { newVideoName, newVideoDescription, newVideoImagePath, newVideoAudioPath });

    try {
      const response = await fetch('/api/videoList', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newVideoName,
          description: newVideoDescription,
          imagePath: newVideoImagePath,
          audioPath: newVideoAudioPath,
        }),
      });

      if (response.ok) {
        // 刷新视频列表
        await fetchVideoData();
        // 清空表单
        setNewVideoName('');
        setNewVideoDescription('');
        setNewVideoImagePath('');
        setNewVideoAudioPath('');
        setShowAddVideoDialog(false);
        toast.success('视频添加成功');
      } else {
        console.error('视频添加失败');
      }
    } catch (error: any) {
      console.error('添加视频时发生错误:', error);
    }

  };

  useEffect(() => {
    fetchVideoData();
  }, []);

  const handleGenerateVideo = async (videoUrl: string) => {
    try {
      const response = await fetch('/api/generateVideo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoUrl }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        fetchVideoData();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error: any) {
      console.error('Failed to generate video:', error);
      alert('Failed to generate video.');
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    try {
      const response = await fetch(`/api/videoList/${videoId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('视频删除成功');
        fetchVideoData(); // Refresh the video list
      } else {
        console.error('视频删除失败');
      }
    } catch (error: any) {
      console.error('删除视频时发生错误:', error);
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

  const handleViewContent = async (videoName: string) => {
    try {
      const response = await fetch(`/data/videos/${videoName}/content.txt`);
      if (!response.ok) {
        throw new Error(`Failed to fetch content for ${videoName}`);
      }
      const content = await response.text();
      setCurrentContent(content);
      setCurrentVideoName(videoName);
      setShowContentDialog(true);
    } catch (error: any) {
      console.error("Error viewing content:", error);
      alert(`查看内容失败: ${error.message}`);
    }
  };

  const handleViewImagePrompt = async (videoName: string) => {
    try {
      const response = await fetch(`/data/videos/${videoName}/imagePrompts.json`);
      if (!response.ok) {
        throw new Error(`Failed to fetch image prompts for ${videoName}`);
      }
      const imagePrompts = await response.json();
      setCurrentImagePrompts(imagePrompts);
      setCurrentVideoNameForPrompts(videoName);
      setShowImagePromptDialog(true);
    } catch (error: any) {
      console.error("Error viewing image prompts:", error);
      alert(`查看图片提示词失败: ${error.message}`);
    }
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

  const handleViewImage = async (videoName: string) => {
    try {
      const response = await fetch(`/api/getImages/${videoName}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch images for ${videoName}`);
      }
      const { images } = await response.json();
      if (images.length > 0) {
        // 在这里显示图片，例如使用一个弹窗或新的页面
        setCurrentImages(images);
        setShowImageDialog(true);
      } else {
        alert(`没有找到 ${videoName} 的图片。`);
      }
    } catch (error: any) {
      console.error("Error viewing images:", error);
      alert(`查看图片失败: ${error.message}`);
    }
  };

  const handleSaveContent = async () => {
    try {
      const response = await fetch(`/api/saveContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoName: currentVideoName, content: currentContent }),
      });

      if (response.ok) {
        toast.success('内容保存成功');
        setShowContentDialog(false);
      } else {
        toast.error('内容保存失败');
      }
    } catch (error) {
      console.error('保存内容时发生错误:', error);
      toast.error('保存内容时发生错误');
    }
  };

  const handleSavePrompts = async () => {
    try {
      const response = await fetch(`/api/saveImagePrompts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoName: currentVideoNameForPrompts, prompts: currentImagePrompts }),
      });

      if (response.ok) {
        toast.success('提示词保存成功');
        setShowImagePromptDialog(false);
      } else {
        toast.error('提示词保存失败');
      }
    } catch (error) {
      console.error('保存提示词时发生错误:', error);
      toast.error('保存提示词时发生错误');
    }
  };

  const handlePromptChange = (index: number, newPrompt: string) => {
    const updatedPrompts = [...currentImagePrompts];
    updatedPrompts[index] = newPrompt;
    setCurrentImagePrompts(updatedPrompts);
  };

  const handleDeletePrompt = (index: number) => {
    const updatedPrompts = [...currentImagePrompts];
    updatedPrompts.splice(index, 1);
    setCurrentImagePrompts(updatedPrompts);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">视频列表</h1>

      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>查看图片</DialogTitle>
          </DialogHeader>
          <div className="flex overflow-x-auto space-x-4 pb-4">  
            {currentImages.map((imageUrl, index) => (
              <img key={index} src={imageUrl} alt={`Image ${index}`} className="flex-shrink-0 w-90 h-160 object-cover rounded-md" />
            ))}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={showAddVideoDialog} onOpenChange={setShowAddVideoDialog}>
        <DialogTrigger asChild>
          <Button  className="mb-4" variant="outline" onClick={() => setShowAddVideoDialog(true)}>新增视频</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>新增视频</DialogTitle>
            <DialogDescription>
              在这里添加新视频的信息。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                名称
              </Label>
              <Input id="name" value={newVideoName} onChange={(e) => setNewVideoName(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                描述
              </Label>
              <Input id="description" value={newVideoDescription} onChange={(e) => setNewVideoDescription(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imagePath" className="text-right">
                图片路径
              </Label>
              <Input id="imagePath" value={newVideoImagePath} onChange={(e) => setNewVideoImagePath(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="audioPath" className="text-right">
                音频路径
              </Label>
              <Input id="audioPath" value={newVideoAudioPath} onChange={(e) => setNewVideoAudioPath(e.target.value)} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddVideo}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showContentDialog} onOpenChange={setShowContentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>查看/编辑内容</DialogTitle>
          </DialogHeader>
          <Textarea
            value={currentContent}
            onChange={(e) => setCurrentContent(e.target.value)}
            className="min-h-[300px]"
          />
          <DialogFooter>
            <Button onClick={handleSaveContent}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showImagePromptDialog} onOpenChange={setShowImagePromptDialog}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>查看/编辑图片提示词</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">提示词</th>
                  <th className="text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                {currentImagePrompts.map((prompt, index) => (
                  <tr key={index}>
                    <td>
                      <Input
                        value={prompt}
                        onChange={(e) => handlePromptChange(index, e.target.value)}
                      />
                    </td>
                    <td className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeletePrompt(index)}
                      >
                        删除
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <DialogFooter>
            <Button onClick={handleSavePrompts}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ul className="space-y-2">
        {videoList.map((video) => (
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
              <button
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={() => handleGenerateVideo(video.name)}
              >
                生成视频
              </button>
              <Dialog 
              onOpenChange={(open) => {
                if (open) {
                  setEditingVideo(video);
                  setEditVideoName(video.name);
                  setEditVideoDescription(video.description);
                  setEditVideoImagePath(video.imagePath);
                  setEditVideoAudioPath(video.audioPath);
                } 
              }}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" >修改</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>修改视频</DialogTitle>
                    <DialogDescription>
                      在这里修改视频信息。
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="editName" className="text-right">
                        名称
                      </Label>
                      <Input id="editName" value={editVideoName} onChange={(e) => setEditVideoName(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="editDescription" className="text-right">
                        描述
                      </Label>
                      <Input id="editDescription" value={editVideoDescription} onChange={(e) => setEditVideoDescription(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="editImagePath" className="text-right">
                        图片路径
                      </Label>
                      <Input id="editImagePath" value={editVideoImagePath} onChange={(e) => setEditVideoImagePath(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="editAudioPath" className="text-right">
                        音频路径
                      </Label>
                      <Input id="editAudioPath" value={editVideoAudioPath} onChange={(e) => setEditVideoAudioPath(e.target.value)} className="col-span-3" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleSaveEdit}>保存</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">删除</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>确定要删除此视频吗？</AlertDialogTitle>
                    <AlertDialogDescription>
                      此操作不可撤销。这将永久删除此视频。
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
        ))}
      </ul>
    </div>
  );
}