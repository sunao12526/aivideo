'use client';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface ImagePromptDialogProps {
  videoName: string;
  showImagePromptDialog: boolean;
  setShowImagePromptDialog: (show: boolean) => void;
}

export function ImagePromptDialog({ videoName, showImagePromptDialog, setShowImagePromptDialog }: ImagePromptDialogProps) {
  const [currentImagePrompts, setCurrentImagePrompts] = useState<string[]>([]);

  useEffect(() => {
    if (videoName && showImagePromptDialog) {
      const fetchImagePrompts = async () => {
        try {
          const response = await fetch(`/data/videos/${videoName}/imagePrompts.json`);
          if (!response.ok) {
            throw new Error(`Failed to fetch image prompts for ${videoName}`);
          }
          const imagePrompts = await response.json();
          setCurrentImagePrompts(imagePrompts);
        } catch (error: any) {
          console.error("Error viewing image prompts:", error);
          toast.error(`查看图片提示词失败: ${error.message}`);
        }
      };
      fetchImagePrompts();
    }
    if(!showImagePromptDialog){
      setCurrentImagePrompts([])
    }
  }, [videoName, showImagePromptDialog]);

  const handleSavePrompts = async () => {
    toast.loading('正在保存提示词...');     
    try {
      const response = await fetch(`/api/saveImagePrompts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoName, prompts: currentImagePrompts }),
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
    } finally {
      toast.dismiss();
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
  );
}