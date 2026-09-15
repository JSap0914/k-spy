'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PUBLIC_RESOURCES, type ResourceKind } from '@/lib/public-resources';
import { VideoGallery } from './video-gallery';

const KINDS: Array<ResourceKind | '전체'> = ['전체', '위치 지도', '설치 데이터', '영상 자료', '열람 안내'];

export default function ResourcesPage() {
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState<ResourceKind | '전체'>('전체');
  const needle = query.trim().toLocaleLowerCase();
  const resources = PUBLIC_RESOURCES.filter((resource) =>
    (kind === '전체' || resource.kind === kind) &&
    `${resource.name} ${resource.source} ${resource.region} ${resource.description}`.toLocaleLowerCase().includes(needle),
  );

  return (
    <main className="mx-auto min-h-dvh max-w-5xl space-y-6 px-4 py-6 sm:px-8">
      <header className="space-y-4">
        <Button variant="outline" render={<Link href="/" aria-label="실시간 CCTV로 돌아가기" />}>← 실시간 CCTV</Button>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">방범·공개자료</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            골목 방범 위치부터 공개 영상 자료, 열람 신청까지 모았습니다.
            위쪽에서 영상을 재생하고, 아래에서 위치·자료·신청 안내를 찾으세요.
          </p>
        </div>
      </header>
      <VideoGallery />
      <section className="space-y-3" aria-label="공개자료 검색">
        <Input aria-label="공개자료 검색" placeholder="지역, 기관, 자료 검색" value={query} onChange={(event) => setQuery(event.target.value)} />
        <fieldset className="flex flex-wrap gap-2" aria-label="자료 종류">
          {KINDS.map((item) => (
            <Button key={item} size="sm" variant={kind === item ? 'default' : 'outline'} aria-pressed={kind === item} onClick={() => setKind(item)}>{item}</Button>
          ))}
        </fieldset>
        <output className="block text-sm text-muted-foreground">{resources.length}개 자료 · 확인일 2026-09-15</output>
      </section>
      <ul className="divide-y border-y">
        {resources.map((resource) => (
          <li key={resource.id} className="space-y-3 py-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{resource.kind}</Badge>
              <span className="text-xs text-muted-foreground">{resource.region} · {resource.source}</span>
            </div>
            <h2 className="text-lg font-medium">{resource.name}</h2>
            <p className="text-sm leading-6 text-muted-foreground">{resource.description}</p>
            <p className="text-sm">{resource.access}</p>
            <Button variant="outline" size="sm" render={<a href={resource.url} target="_blank" rel="noreferrer" aria-label={`${resource.name} 공식 자료 열기`} />}>
              공식 자료 열기 <ExternalLink />
            </Button>
          </li>
        ))}
      </ul>
      {resources.length === 0 && <p className="py-8 text-center text-muted-foreground">일치하는 자료가 없습니다. 검색어나 자료 종류를 바꿔 보세요.</p>}
      <p className="text-xs leading-5 text-muted-foreground">확인한 공개 경로를 수록했습니다. 전국 모든 자료를 수집했다는 뜻은 아닙니다. 원본 영상의 다운로드·재사용 조건은 각 제공처를 확인하세요.</p>
    </main>
  );
}
