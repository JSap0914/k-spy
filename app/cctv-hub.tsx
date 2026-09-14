'use client';

import { useEffect, useMemo, useState } from 'react';
import { Columns2, ExternalLink, Grid2x2, LayoutGrid, Radio, Search, Square, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Input } from '@/components/ui/input';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';
import { HlsPlayer } from './hls-player';
import { KoreaMap } from './korea-map';
import {
  CAMERAS,
  DEFAULT_CAMERA_ID,
  FLOOD_CAMERAS,
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
  'safety',
];

type ViewCount = 1 | 2 | 4 | 'wall';

function liveCameras(pool: Camera[]) {
  return pool.filter((camera) => camera.playMode === 'hls');
}

function fillSlots(ids: string[], count: number, pool: Camera[]): string[] {
  const next: string[] = [];
  const source = liveCameras(pool);
  const haystack = source.length > 0 ? source : pool;
  for (const id of ids) {
    if (next.length >= count) break;
    if (haystack.some((camera) => camera.id === id) && !next.includes(id)) next.push(id);
  }
  for (const camera of pool) {
    if (next.length >= count) break;
    if (camera.playMode === 'hls' && !next.includes(camera.id)) next.push(camera.id);
  }
  for (const camera of pool) {
    if (next.length >= count) break;
    if (!next.includes(camera.id)) next.push(camera.id);
  }
  return next;
}

function CameraList({
  cameras,
  selectedIds,
  focusedId,
  onSelect,
}: {
  cameras: Camera[];
  selectedIds: string[];
  focusedId: string | null;
  onSelect: (camera: Camera) => void;
}) {
  return (
    <ul className="px-2 pb-3">
      {cameras.map((camera) => {
        const focused = focusedId === camera.id;
        const pinned = selectedIds.includes(camera.id);
        return (
          <li key={camera.id}>
            <Item
              render={<button type="button" aria-label={camera.name} onClick={() => onSelect(camera)} />}
              variant={focused ? 'muted' : 'default'}
              size="sm"
              className={cn(
                'w-full border-transparent text-left',
                focused
                  ? 'bg-primary text-primary-foreground hover:bg-primary'
                  : pinned
                    ? 'bg-muted/80 hover:bg-muted'
                    : 'hover:bg-muted/50',
              )}
            >
              <ItemContent>
                <ItemTitle className={cn('text-sm', focused && 'text-primary-foreground')}>
                  {camera.name}
                </ItemTitle>
                <ItemDescription className={cn(focused && 'text-primary-foreground/70')}>
                  {camera.region} · {camera.source}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Badge
                  variant={camera.playMode === 'hls' ? 'secondary' : 'outline'}
                  className={cn(
                    'rounded-md',
                    focused &&
                      'border-primary-foreground/30 bg-primary-foreground/15 text-primary-foreground',
                  )}
                >
                  {camera.playMode === 'hls' ? 'LIVE' : '링크'}
                </Badge>
              </ItemActions>
            </Item>
          </li>
        );
      })}
    </ul>
  );
}

function OutboundPanel({ camera }: { camera: Camera }) {
  return (
    <Empty className="h-full min-h-[180px] border-0">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Radio />
        </EmptyMedia>
        <EmptyTitle>{camera.name}</EmptyTitle>
        <EmptyDescription>
          {camera.note ?? '이 제공처는 공식 사이트에서 실시간 영상을 봅니다.'}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button render={<a href={camera.url} target="_blank" rel="noreferrer" aria-label={camera.source + '에서 보기'} />}>
          {camera.source}에서 보기
        </Button>
      </EmptyContent>
    </Empty>
  );
}

function PlayerPanel({
  camera,
  compact,
  active,
  onFocus,
  onClose,
}: {
  camera: Camera | null;
  compact?: boolean;
  active?: boolean;
  onFocus?: () => void;
  onClose?: () => void;
}) {
  if (!camera) {
    return (
      <button
        type="button"
        onClick={onFocus}
        className={cn(
          'flex h-full min-h-[180px] w-full items-center justify-center border border-dashed border-border bg-card text-sm text-muted-foreground',
          active && 'border-primary',
        )}
      >
        목록에서 카메라를 고르세요
      </button>
    );
  }

  return (
    <div
      className={cn(
        'flex h-full min-h-0 flex-col bg-card',
        active && compact && 'ring-1 ring-inset ring-primary',
      )}
    >
      <div className="flex items-start justify-between gap-3 px-3 py-2">
        <button type="button" onClick={onFocus} className="min-w-0 flex-1 text-left">
          <p className="truncate text-[11px] tracking-[0.14em] text-muted-foreground">
            {camera.source}
          </p>
          <h2
            className={cn(
              'truncate font-semibold text-foreground',
              compact ? 'text-sm' : 'text-base',
            )}
          >
            {camera.name}
          </h2>
        </button>
        <div className="flex shrink-0 items-center gap-1.5">
          <Button
            size="sm"
            variant="outline"
            render={<a href={camera.pageUrl ?? camera.url} target="_blank" rel="noreferrer" aria-label={camera.name + ' 공식 페이지'} />}
          >
            공식
            <ExternalLink />
          </Button>
          {onClose ? (
            <Button
              size="icon-sm"
              variant="ghost"
              aria-label={camera.name + ' 닫기'}
              onClick={onClose}
            >
              <X />
            </Button>
          ) : null}
        </div>
      </div>
      <div
        role="presentation"
        className="min-h-0 flex-1 bg-black"
        onClick={onFocus}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') onFocus?.();
        }}
      >
        {camera.playMode === 'hls' ? (
          <HlsPlayer key={camera.id} src={camera.url} title={camera.name} compact={compact} />
        ) : (
          <OutboundPanel camera={camera} />
        )}
      </div>
    </div>
  );
}

export function CctvHub() {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState<CameraGroup | 'all'>('all');
  const [viewCount, setViewCount] = useState<ViewCount>(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([DEFAULT_CAMERA_ID]);
  const [focusIndex, setFocusIndex] = useState(0);
  const [highways, setHighways] = useState<Camera[]>([]);
  const [cities, setCities] = useState<Camera[]>([]);

  useEffect(() => {
    if (group !== 'highway') return;
    let cancelled = false;
    void fetch('/api/its')
      .then((res) => res.json() as Promise<{ cameras?: Camera[] }>)
      .then((payload) => {
        if (!cancelled) setHighways(payload.cameras ?? []);
      })
      .catch(() => {
        if (!cancelled) setHighways([]);
      });
    return () => {
      cancelled = true;
    };
  }, [group]);

  useEffect(() => {
    if (group !== 'city' && group !== 'seoul') return;
    let cancelled = false;
    void fetch('/api/topis')
      .then((res) => res.json() as Promise<{ cameras?: Camera[] }>)
      .then((payload) => {
        if (!cancelled) setCities(payload.cameras ?? []);
      })
      .catch(() => {
        if (!cancelled) setCities([]);
      });
    return () => {
      cancelled = true;
    };
  }, [group]);

  const cameras = useMemo(() => {
    if (group === 'highway') return [...CAMERAS, ...highways];
    if (group === 'city' || group === 'seoul') return [...CAMERAS, ...cities];
    if (group === 'safety') return [...CAMERAS, ...FLOOD_CAMERAS];
    return CAMERAS;
  }, [cities, group, highways]);

  const filtered = useMemo(() => {
    const needle = query.trim();
    return cameras.filter((camera) => {
      const groupOk = group === 'all' || camera.group === group;
      if (!groupOk) return false;
      if (!needle) return true;
      return (camera.name + ' ' + camera.region + ' ' + camera.source).includes(needle);
    });
  }, [cameras, group, query]);

  const live = useMemo(() => liveCameras(filtered), [filtered]);
  const wallCount = Math.max(live.length, 1);
  const slotCount = viewCount === 'wall' ? wallCount : viewCount;
  const displayIds = useMemo(() => {
    if (viewCount === 'wall') {
      return live.map((camera) => camera.id);
    }
    const next = selectedIds.slice(0, slotCount);
    while (next.length < slotCount) next.push('');
    return next;
  }, [live, selectedIds, slotCount, viewCount]);
  const focusedId =
    displayIds[Math.min(focusIndex, Math.max(slotCount - 1, 0))] ||
    displayIds.find(Boolean) ||
    live[0]?.id ||
    null;
  const selected =
    filtered.find((camera) => camera.id === focusedId) ??
    live[0] ??
    filtered[0] ??
    null;
  const liveCount = live.length;
  const mapCameras = useMemo(() => {
    if (filtered.length <= 28) return filtered;
    const pinned = new Set(displayIds.filter(Boolean));
    const keep = filtered.filter(
      (camera) => pinned.has(camera.id) || !camera.id.startsWith('flood-'),
    );
    const extraFlood = filtered
      .filter((camera) => camera.id.startsWith('flood-') && !pinned.has(camera.id))
      .slice(0, 12);
    return [...keep, ...extraFlood];
  }, [displayIds, filtered]);

  function selectCamera(camera: Camera) {
    const existing = displayIds.indexOf(camera.id);
    if (existing >= 0) {
      setFocusIndex(existing);
      setSelectedIds(displayIds);
      return;
    }
    if (viewCount === 1) {
      setSelectedIds([camera.id]);
      setFocusIndex(0);
      return;
    }
    const next = [...displayIds];
    next[Math.min(focusIndex, slotCount - 1)] = camera.id;
    setSelectedIds(next.slice(0, slotCount));
  }

  function changeView(next: ViewCount) {
    setViewCount(next);
    const count = next === 'wall' ? Math.max(live.length, 1) : next;
    setSelectedIds(next === 'wall' ? live.map((camera) => camera.id) : fillSlots(selectedIds, count, filtered));
    setFocusIndex((index) => Math.min(index, count - 1));
  }

  function closeSlot(index: number) {
    const next = [...displayIds];
    next[index] = '';
    setSelectedIds(next);
    setFocusIndex(index);
  }

  return (
    <div className="min-h-dvh bg-background text-foreground lg:h-dvh lg:overflow-hidden">
      <header className="flex items-center justify-between gap-4 border-b px-4 py-3">
        <div>
          <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground">
            공개 실시간
          </p>
          <h1 className="text-balance text-[1.2rem] font-semibold tracking-tight">실시간 CCTV</h1>
        </div>
        <div className="flex items-center gap-2">
          <ToggleGroup
            value={[String(viewCount)]}
            onValueChange={(values) => {
              const raw = values[0];
              if (raw === 'wall') {
                changeView('wall');
                return;
              }
              const next = Number(raw);
              if (next === 1 || next === 2 || next === 4) changeView(next);
            }}
            variant="outline"
            size="sm"
            className="border border-input p-0.5"
            aria-label="한 번에 볼 화면 수"
          >
            <ToggleGroupItem value="1" aria-label="1화면">
              <Square />
              1
            </ToggleGroupItem>
            <ToggleGroupItem value="2" aria-label="2화면">
              <Columns2 />
              2
            </ToggleGroupItem>
            <ToggleGroupItem value="4" aria-label="4화면">
              <Grid2x2 />
              4
            </ToggleGroupItem>
            <ToggleGroupItem value="wall" aria-label="전체 병렬">
              <LayoutGrid />
              전체
            </ToggleGroupItem>
          </ToggleGroup>
          <Badge variant="outline" className="rounded-md">
            {liveCount}곳
          </Badge>
        </div>
      </header>

      <div
        className={cn(
          'grid lg:h-[calc(100dvh-4.25rem)]',
          viewCount === 1
            ? 'lg:grid-cols-[280px_minmax(0,1fr)_minmax(320px,400px)]'
            : 'lg:grid-cols-[280px_minmax(0,1fr)]',
        )}
      >
        <aside className="order-2 flex min-h-0 flex-col border-t bg-card lg:order-none lg:border-t-0 lg:border-r">
          <div className="space-y-3 p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
              <Input
                id="camera-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="장소, 공원, 도시"
                aria-label="카메라 검색"
                className="h-9 pl-8"
              />
            </div>
            <ToggleGroup
              value={[group]}
              onValueChange={(values) => {
                const next = values[0] as CameraGroup | 'all' | undefined;
                if (!next) return;
                setGroup(next);
                setSelectedIds([]);
                setFocusIndex(0);
              }}
              variant="outline"
              size="sm"
              className="flex w-full flex-wrap justify-start gap-1.5"
              aria-label="카메라 분류"
            >
              {GROUPS.map((item) => (
                <ToggleGroupItem key={item} value={item} className="px-2.5">
                  {GROUP_LABEL[item]}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          <ScrollArea className="h-[28vh] min-h-0 lg:h-auto lg:flex-1">
            {filtered.length === 0 ? (
              <Empty className="border-0 py-10">
                <EmptyHeader>
                  <EmptyTitle>조건에 맞는 카메라가 없습니다</EmptyTitle>
                  <EmptyDescription>검색어나 분류를 바꿔 보세요.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <CameraList
                cameras={filtered}
                selectedIds={displayIds.filter(Boolean)}
                focusedId={focusedId}
                onSelect={selectCamera}
              />
            )}
          </ScrollArea>
        </aside>

        {viewCount === 1 ? (
          <>
            <section className="relative order-3 hidden min-h-[280px] overflow-hidden bg-card lg:order-none lg:block lg:min-h-0">
              <KoreaMap
                cameras={mapCameras}
                selectedId={selected?.id ?? null}
                onSelect={(id) => {
                  const camera = filtered.find((item) => item.id === id);
                  if (camera) selectCamera(camera);
                }}
              />
            </section>
            <section className="order-1 flex min-h-[42vh] flex-col bg-card lg:order-none lg:min-h-0 lg:border-l">
              <PlayerPanel camera={selected} />
            </section>
          </>
        ) : (
          <section
            className={cn(
              'order-1 grid min-h-[48vh] gap-px overflow-auto bg-border lg:order-none lg:min-h-0',
              viewCount === 'wall'
                ? 'grid-cols-2 auto-rows-[minmax(180px,28vh)] md:grid-cols-3 xl:grid-cols-4'
                : viewCount === 4
                  ? 'grid-cols-2 grid-rows-2'
                  : 'grid-cols-1 md:grid-cols-2',
            )}
          >
            {Array.from({ length: slotCount }, (_, index) => {
              const camera = filtered.find((item) => item.id === displayIds[index]) ?? null;
              return (
                <PlayerPanel
                  key={displayIds[index] || 'empty-' + index}
                  camera={camera}
                  compact
                  active={index === focusIndex}
                  onFocus={() => setFocusIndex(index)}
                  onClose={viewCount === 'wall' ? undefined : camera ? () => closeSlot(index) : undefined}
                />
              );
            })}
          </section>
        )}
      </div>
    </div>
  );
}
