'use client';

import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

export function HlsPlayer({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      void video.play().catch(() => {});
      return;
    }

    if (!Hls.isSupported()) return;

    const hls = new Hls({ enableWorker: true });
    hls.loadSource(src);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      void video.play().catch(() => {});
    });

    return () => {
      hls.destroy();
    };
  }, [src]);

  return (
    <video
      ref={ref}
      title={title}
      controls
      playsInline
      autoPlay
      muted
      className="h-full min-h-[320px] w-full bg-black object-contain"
    />
  );
}
