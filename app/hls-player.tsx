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
    let recoverTimer: number | undefined;
    let stallTimer: number | undefined;
    let fatalTries = 0;
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
    const later = (fn: () => void, ms: number) => {
      window.clearTimeout(recoverTimer);
      recoverTimer = window.setTimeout(fn, ms);
    };

    video.muted = true;
    video.addEventListener('playing', ok);
    video.addEventListener('error', fail);
    const onWaiting = () => {
      window.clearTimeout(stallTimer);
      stallTimer = window.setTimeout(() => {
        if (!cancelled && !video.ended) play();
      }, 1200);
    };
    video.addEventListener('waiting', onWaiting);

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: false,
        lowLatencyMode: false,
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 8,
        maxBufferLength: compact ? 8 : 12,
        maxMaxBufferLength: compact ? 16 : 24,
        manifestLoadingTimeOut: 8000,
        levelLoadingTimeOut: 8000,
        fragLoadingTimeOut: 8000,
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, play);
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (cancelled || !hls) return;
        if (!data.fatal) {
          if (data.details === Hls.ErrorDetails.BUFFER_STALLED_ERROR) play();
          return;
        }
        fatalTries += 1;
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR && fatalTries < 4) {
          later(() => hls?.startLoad(), 800 * fatalTries);
          return;
        }
        if (data.type === Hls.ErrorTypes.MEDIA_ERROR && fatalTries < 4) {
          hls.recoverMediaError();
          later(play, 400);
          return;
        }
        if (fatalTries < 6) {
          later(() => setRetry((value) => value + 1), 1500);
          return;
        }
        fail();
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      play();
    } else {
      fail();
    }

    const onVisible = () => {
      if (document.visibilityState === 'visible') play();
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      cancelled = true;
      window.clearTimeout(recoverTimer);
      window.clearTimeout(stallTimer);
      document.removeEventListener('visibilitychange', onVisible);
      video.removeEventListener('playing', ok);
      video.removeEventListener('error', fail);
      video.removeEventListener('waiting', onWaiting);
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
