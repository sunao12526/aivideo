'use client';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface ContentDialogProps {
  videoName: string;
  showContentDialog: boolean;
  setShowContentDialog: (show: boolean) => void;
}

export function ContentDialog({ videoName, showContentDialog, setShowContentDialog }: ContentDialogProps) {
  const [currentContent, setCurrentContent] = useState('');

  useEffect(() => {
    if (videoName && showContentDialog) {
      const fetchContent = async () => {
        try {
          const response = await fetch(`/data/videos/${videoName}/content.txt`);
          if (!response.ok) {
            throw new Error(`Failed to fetch content for ${videoName}`);
          }
          const content = await response.text();
          setCurrentContent(content);
        } catch (error: any) {
          console.error("Error viewing content:", error);
          toast.error(`查看内容失败: ${error.message}`);
        }
      };
      fetchContent();
    }
    if(!showContentDialog){
      setCurrentContent('')
    }

  }, [videoName, showContentDialog]);

  const handleSaveContent = async () => {
    toast.loading('正在保存内容...'); 
    try {
      const response = await fetch(`/api/saveContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoName, content: currentContent }),
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
    } finally {
      toast.dismiss();
    }
  };

  return (
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
  );
}