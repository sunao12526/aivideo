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

  const fetchVideoData = async () => {
    const data = await getVideoList();
    setVideoList(data);
  };

  const handleSaveEdit = async () => {
    if (!editingVideo) return;

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
        console.log('视频修改成功');
        await fetchVideoData();
        setEditingVideo(null); // Close the dialog
      } else {
        console.error('视频修改失败');
      }
    } catch (error) {
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
        console.log('视频添加成功');
        // 刷新视频列表
        await fetchVideoData();
        // 清空表单
        setNewVideoName('');
        setNewVideoDescription('');
        setNewVideoImagePath('');
        setNewVideoAudioPath('');
      } else {
        console.error('视频添加失败');
      }
    } catch (error) {
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
    } catch (error) {
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
        console.log('视频删除成功');
        fetchVideoData(); // Refresh the video list
      } else {
        console.error('视频删除失败');
      }
    } catch (error) {
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
    } catch (error) {
      console.error('Failed to generate video:', error);
      alert('Failed to generate video.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">视频列表</h1>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4">添加视频</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>添加视频</DialogTitle>
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
      <ul className="space-y-2">
        {videoList.map((video) => (
          <li key={video.id} className="bg-gray-100 p-3 rounded-md shadow-sm">
            <Link href={video.name} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {video.name}
            </Link>
            <div className="mt-2 space-x-2">
              <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => handleAIParse(video.name)}>
                AI解析
              </button>
              <button
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={() => handleGenerateVideo(video.name)}
              >
                生成视频
              </button>
              <Dialog onOpenChange={(open) => {
                if (open) {
                  setEditingVideo(video);
                  setEditVideoName(video.name);
                  setEditVideoDescription(video.description);
                  setEditVideoImagePath(video.imagePath);
                  setEditVideoAudioPath(video.audioPath);
                }
              }}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">修改</Button>
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