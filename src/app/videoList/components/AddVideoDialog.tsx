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
import { useState } from 'react';
import { toast } from 'sonner';

interface AddVideoDialogProps {
  fetchVideoData: () => Promise<void>;
}

export function AddVideoDialog({ fetchVideoData }: AddVideoDialogProps) {
  const [newVideoName, setNewVideoName] = useState('');
  const [newVideoDescription, setNewVideoDescription] = useState('');
  const [newVideoImagePath, setNewVideoImagePath] = useState('');
  const [newVideoAudioPath, setNewVideoAudioPath] = useState('');
  const [showAddVideoDialog, setShowAddVideoDialog] = useState(false);

  const handleAddVideo = async () => {
    toast.loading('正在添加视频...'); 
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
        await fetchVideoData();
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
      toast.error('添加视频时发生错误');
    } finally {
      toast.dismiss();
    } 
  };

  return (
    <Dialog open={showAddVideoDialog} onOpenChange={setShowAddVideoDialog}>
      <DialogTrigger asChild>
        <Button className="mb-4" variant="outline" onClick={() => setShowAddVideoDialog(true)}>新增视频</Button>
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
  );
}