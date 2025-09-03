'use client';

import React from 'react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Video {
  id: number;
  name: string;
}

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
  useEffect(() => {
    const fetchVideoData = async () => {
      const data = await getVideoList();
      setVideoList(data);
    };
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
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Failed to generate video:', error);
      alert('Failed to generate video.');
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

              <button
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={(e) => console.log(e)}
              >
                11111
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}