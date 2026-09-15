'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { HlsPlayer } from '../hls-player';
import { FLOOD_CAMERAS } from '@/lib/cameras';

export function VideoGallery() {
  const [selected, setSelected] = useState<string | null>(null);
  const camera = FLOOD_CAMERAS.find((item) => item.id === selected);

  return (
    <section className="space-y-3 rounded-lg border p-4" aria-label="바로 보는 영상">
      <h2 className="text-lg font-semibold">이 화면에서 영상 보기</h2>
      <p className="text-sm leading-6 text-muted-foreground">실제 하천 감시 카메라의 공개 영상을 재생합니다. 골목 방범 영상은 현재 연결되지 않았습니다.</p>
      <label className="block space-y-2 text-sm">
        <span>실시간 하천 CCTV 선택</span>
        <select className="w-full rounded-md border bg-background p-2" value={camera?.id ?? ''} onChange={(event) => setSelected(event.target.value || null)}>
          <option value="">카메라를 선택하세요</option>
          {FLOOD_CAMERAS.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
      </label>
      <div className="flex flex-wrap gap-2">
        {selected && <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>영상 닫기</Button>}
      </div>
      {camera && (
        <div className="aspect-video overflow-hidden rounded-md bg-black">
          <HlsPlayer key={camera.id} src={camera.url} title={camera.name} />
        </div>
      )}
    </section>
  );
}
