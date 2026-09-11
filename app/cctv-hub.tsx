'use client';

import { useMemo, useState } from 'react';
import { ExternalLink, MapPinned, Radio, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HlsPlayer } from './hls-player';
import {
  CAMERAS,
  GROUP_LABEL,
  type Camera,
  type CameraGroup,
} from '@/lib/cameras';

const GROUPS: Array<CameraGroup | 'all'> = [
  'all',
  'park',
  'halla',
  'highway',
  'city',
  'seoul',
  'gyeonggi',
];

function toMap(cameras: Camera[]) {
  const minLat = Math.min(...cameras.map((c) => c.lat));
  const maxLat = Math.max(...cameras.map((c) => c.lat));
  const minLng = Math.min(...cameras.map((c) => c.lng));
  const maxLng = Math.max(...cameras.map((c) => c.lng));
  const latSpan = Math.max(maxLat - minLat, 0.8);
  const lngSpan = Math.max(maxLng - minLng, 1.2);
  return cameras.map((camera) => ({
    camera,
    x: ((camera.lng - minLng) / lngSpan) * 100,
    y: ((maxLat - camera.lat) / latSpan) * 100,
  }));
}

export function CctvHub() {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState<CameraGroup | 'all'>('all');
  const [selectedId, setSelectedId] = useState(CAMERAS[0].id);

  const filtered = useMemo(() => {
    const needle = query.trim();
    return CAMERAS.filter((camera) => {
      const groupOk = group === 'all' || camera.group === group;
      const text = camera.name + ' ' + camera.region + ' ' + camera.source;
      return groupOk && (!needle || text.includes(needle));
    });
  }, [group, query]);

  const selected =
    filtered.find((camera) => camera.id === selectedId) ?? filtered[0] ?? null;
  const pins = useMemo(() => toMap(CAMERAS), []);

  return (
    <div className="flex min-h-dvh flex-col bg-[#f3f1ea] text-zinc-900">
      <header className="flex items-center justify-between gap-4 border-b border-zinc-300/70 bg-[#f7f4ec] px-4 py-3 sm:px-6">
        <div>
          <p className="text-xs font-medium tracking-[0.16em] text-zinc-500">
            LIVE PUBLIC CAMERAS
          </p>
          <h1 className="text-[1.35rem] font-semibold tracking-tight">실시간 CCTV</h1>
        </div>
        <Badge variant="outline" className="rounded-md border-zinc-400 bg-white">
          {CAMERAS.length}곳
        </Badge>
      </header>

      <div className="grid flex-1 lg:grid-cols-[280px_minmax(0,1fr)_minmax(320px,42%)]">
        <aside className="border-b border-zinc-300/70 bg-white lg:border-r lg:border-b-0">
          <div className="space-y-3 p-4">
            <div className="relative">
              <Search className="pointer-events-none absolute top-2.5 left-2.5 size-4 text-zinc-400" />
              <Input
                id="camera-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="장소, 공원, 도시"
                aria-label="카메라 검색"
                className="h-9 bg-[#f7f4ec] pl-8"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {GROUPS.map((item) => (
                <Button
                  key={item}
                  size="sm"
                  variant={group === item ? 'default' : 'outline'}
                  onClick={() => setGroup(item)}
                >
                  {GROUP_LABEL[item]}
                </Button>
              ))}
            </div>
          </div>
          <ScrollArea className="h-[38vh] lg:h-[calc(100dvh-11rem)]">
            <ul className="px-2 pb-4">
              {filtered.map((camera) => {
                const active = selected?.id === camera.id;
                return (
                  <li key={camera.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(camera.id)}
                      className={
                        'w-full rounded-lg px-3 py-2.5 text-left ' +
                        (active ? 'bg-[#1f3a2e] text-white' : 'hover:bg-[#f3f1ea]')
                      }
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium">{camera.name}</span>
                        <span className={'text-xs ' + (active ? 'text-white/70' : 'text-zinc-500')}>
                          {camera.region}
                        </span>
                      </div>
                      <p className={'mt-0.5 text-xs ' + (active ? 'text-white/70' : 'text-zinc-500')}>
                        {camera.source}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ul>
          </ScrollArea>
        </aside>

        <section className="relative min-h-[280px] overflow-hidden bg-[#d7e1d4]">
          <div className="absolute inset-4 rounded-[28px] border border-[#9aa890] bg-[#dce6d6]">
            {pins.map(({ camera, x, y }) => {
              const active = selected?.id === camera.id;
              return (
                <button
                  key={camera.id}
                  type="button"
                  aria-label={camera.name}
                  onClick={() => {
                    setSelectedId(camera.id);
                    setGroup(camera.group);
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: Math.min(92, Math.max(8, x)) + '%',
                    top: Math.min(90, Math.max(8, y)) + '%',
                  }}
                >
                  <span
                    className={
                      'block rounded-full border ' +
                      (active
                        ? 'size-3 border-white bg-[#b42318]'
                        : 'size-2.5 border-[#1f3a2e] bg-[#1f3a2e]')
                    }
                  />
                </button>
              );
            })}
          </div>
          <p className="absolute right-6 bottom-6 left-6 flex items-center gap-2 text-xs text-zinc-600">
            <MapPinned className="size-3.5" />
            공개된 실시간 카메라만 모았습니다. 방범·시설 CCTV는 넣지 않습니다.
          </p>
        </section>

        <section className="flex min-h-[420px] flex-col border-t border-zinc-300/70 bg-[#11150f] text-[#f4f1ea] lg:border-t-0 lg:border-l">
          {selected ? (
            <>
              <div className="flex items-start justify-between gap-3 px-4 py-3">
                <div>
                  <p className="text-xs tracking-[0.14em] text-white/50">{selected.source}</p>
                  <h2 className="text-lg font-semibold">{selected.name}</h2>
                </div>
                <a
                  href={selected.playMode === 'outbound' ? selected.url : 'https://www.its.go.kr/?mapTab=cctv'}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/20 px-2.5 text-sm"
                >
                  공식 페이지
                  <ExternalLink className="size-3.5" />
                </a>
              </div>
              <div className="min-h-0 flex-1 bg-black">
                {selected.playMode === 'hls' ? (
                  <HlsPlayer src={selected.url} title={selected.name} />
                ) : (
                  <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-3 px-8 text-center">
                    <Radio className="size-8 text-white/50" />
                    <p className="max-w-sm text-sm text-white/70">
                      {selected.note ?? '이 제공처는 공식 사이트에서 실시간 영상을 봅니다.'}
                    </p>
                    <a
                      href={selected.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-8 items-center rounded-lg bg-[#f6f3ea] px-3 text-sm font-medium text-[#1f3a2e]"
                    >
                      {selected.source}에서 보기
                    </a>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-white/60">
              조건에 맞는 카메라가 없습니다.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}