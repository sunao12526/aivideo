'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Trash2, FileText } from 'lucide-react';

interface ViewImageDialogProps {
  videoName: string;
  showImageDialog: boolean;
  setShowImageDialog: (show: boolean) => void;
}

export function ViewImageDialog({ videoName, showImageDialog, setShowImageDialog }: ViewImageDialogProps) {
  const [currentImages, setCurrentImages] = useState<string[]>([]);

  const handleDeleteImage = async (imageUrl: string) => {
    try {
      const response = await fetch(`/api/deleteImage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoName, imageUrl }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete image: ${response.statusText}`);
      }

      setCurrentImages(prevImages => prevImages.filter(img => img !== imageUrl));
      toast.success('图片删除成功！');
    } catch (error: any) {
      console.error("Error deleting image:", error);
      toast.error(`删除图片失败: ${error.message}`);
    }
  };

  const handleAddTextToImage = async (imageUrl: string) => {
    try {
      console.log(imageUrl)
      const response = await fetch(`/api/addTextToImage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoName, imageUrl }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add text to image: ${response.statusText}`);
      }

      const { imageUrl: newImageUrl } = await response.json();
      setCurrentImages(prevImages => prevImages.map(img => (img === imageUrl ? newImageUrl : img)));
      toast.success('文字添加成功！');
    } catch (error: any) {
      console.error("Error adding text to image:", error);
      toast.error(`添加文字失败: ${error.message}`);
    }
  };

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
    if(!showImageDialog){
      setCurrentImages([]);
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
            <div key={index} className="relative flex-shrink-0">
              <img src={imageUrl} alt={`Image ${index}`} className="w-90 h-160 object-cover rounded-md" />
              <button
                onClick={() => handleDeleteImage(imageUrl)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleAddTextToImage(imageUrl)}
                className="absolute top-2 right-10 bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                <FileText className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}