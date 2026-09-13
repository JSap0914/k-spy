'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type PlayerState = 'loading' | 'playing' | 'error';

export function HlsPlayer({
  src,
  title,
  compact,
}: {
  src: string;
  title: string;
  compact?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<PlayerState>('loading');
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const video = ref.current;
    if (!video || !src) return;

    let cancelled = false;
    let hls: Hls | null = null;
    setState('loading');

    const fail = () => {
      if (!cancelled) setState('error');
    };
    const ok = () => {
      if (!cancelled) setState('playing');
    };
    const play = () => {
      void video.play().then(ok).catch(() => {
        if (video.readyState >= 2) ok();
      });
    };

    video.muted = true;
    video.addEventListener('playing', ok);
    video.addEventListener('error', fail);

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: false,
        maxBufferLength: compact ? 4 : 8,
        maxMaxBufferLength: compact ? 8 : 12,
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, play);
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) fail();
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      play();
    } else {
      fail();
    }

    return () => {
      cancelled = true;
      video.removeEventListener('playing', ok);
      video.removeEventListener('error', fail);
      hls?.destroy();
      video.removeAttribute('src');
      video.load();
    };
  }, [compact, src, retry]);

  return (
    <div
      className={cn(
        'relative h-full min-h-0 w-full bg-black',
        compact ? 'min-h-[140px]' : 'min-h-[180px] sm:min-h-[220px]',
      )}
    >
      <video
        ref={ref}
        title={title}
        controls
        playsInline
        autoPlay
        muted
        className="h-full w-full object-contain"
      />
      {state !== 'playing' ? (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/50 px-6 text-center">
          <p className="text-sm text-muted-foreground">
            {state === 'error' ? '실시간 영상을 연결하지 못했어요.' : '실시간 영상을 연결하는 중'}
          </p>
          {state === 'error' ? (
            <Button
              size="sm"
              className="pointer-events-auto"
              onClick={() => setRetry((value) => value + 1)}
            >
              다시 연결
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

