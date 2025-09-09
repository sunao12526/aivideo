'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Video } from '@/lib/videoUtils';

interface EditVideoDialogProps {
  video: Video;
  fetchVideoData: () => Promise<void>;
}

export function EditVideoDialog({ video, fetchVideoData }: EditVideoDialogProps) {
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [editVideoName, setEditVideoName] = useState('');
  const [editVideoDescription, setEditVideoDescription] = useState('');
  const [editVideoImagePath, setEditVideoImagePath] = useState('');
  const [editVideoAudioPath, setEditVideoAudioPath] = useState('');

  useEffect(() => {
    if (video) {
      setEditingVideo(video);
      setEditVideoName(video.name);
      setEditVideoDescription(video.description);
      setEditVideoImagePath(video.imagePath);
      setEditVideoAudioPath(video.audioPath);
    }
  }, [video]);

  const handleSaveEdit = async () => {
    if (!editingVideo) {
      toast.error('请先选择要编辑的视频');
      return;
    }
    toast.loading('正在修改视频...'); 
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
        toast.error('视频修改失败');
      }
    } catch (error: any) {
      console.error('修改视频时发生错误:', error);
      toast.error('修改视频时发生错误');
    } finally {
      toast.dismiss();
    }
  };

  return (
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
  );
}