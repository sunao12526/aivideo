'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface ViewImageDialogProps {
  videoName: string;
  showImageDialog: boolean;
  setShowImageDialog: (show: boolean) => void;
}

export function ViewImageDialog({ videoName, showImageDialog, setShowImageDialog }: ViewImageDialogProps) {
  const [currentImages, setCurrentImages] = useState<string[]>([]);

  useEffect(() => {
    if (videoName && showImageDialog) {
      const fetchImages = async () => {
        try {
          const response = await fetch(`/api/getImages/${videoName}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch images for ${videoName}`);
          }
          const { images } = await response.json();
          if (images.length > 0) {
            setCurrentImages(images);
          } else {
            toast.info(`没有找到 ${videoName} 的图片。`);
          }
        } catch (error: any) {
          console.error("Error viewing images:", error);
          toast.error(`查看图片失败: ${error.message}`);
        }
      };
      fetchImages();
    }
  }, [videoName, showImageDialog]);

  return (
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
  );
}