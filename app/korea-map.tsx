'use client';

import { useEffect, useRef, useState } from 'react';
import type * as LeafletNS from 'leaflet';
import type { Camera } from '@/lib/cameras';
import 'leaflet/dist/leaflet.css';

const TILE_URL =
  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

function leafletFrom(mod: unknown) {
  const typed = mod as { default?: typeof LeafletNS };
  return typed.default ?? (mod as typeof LeafletNS);
}

export function KoreaMap({
  cameras,
  selectedId,
  onSelect,
}: {
  cameras: Camera[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const mapRef = useRef<LeafletNS.Map | null>(null);
  const markersRef = useRef<Map<string, LeafletNS.CircleMarker>>(new Map());
  const onSelectRef = useRef(onSelect);
  const lastSetRef = useRef('');
  const lastSelectedRef = useRef<string | null>(null);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    let resizeObserver: ResizeObserver | undefined;
    const markers = markersRef.current;

    void import('leaflet').then((leaflet) => {
      if (cancelled || !hostRef.current || mapRef.current) return;
      const L = leafletFrom(leaflet);
      const map = L.map(hostRef.current, {
        center: [36.35, 127.85],
        zoom: 7,
        minZoom: 6,
        maxZoom: 14,
        zoomControl: false,
        attributionControl: true,
        preferCanvas: true,
      });
      L.control.zoom({ position: 'bottomleft' }).addTo(map);
      L.tileLayer(TILE_URL, {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 14,
      }).addTo(map);
      mapRef.current = map;
      setReady(true);
      const refresh = () => {
        if (cancelled || mapRef.current !== map) return;
        const size = map.getSize();
        if (size.x === 0 || size.y === 0) return;
        map.invalidateSize({ animate: false });
      };
      requestAnimationFrame(refresh);
      resizeObserver = new ResizeObserver(refresh);
      resizeObserver.observe(hostRef.current);
    });

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      markers.clear();
      const map = mapRef.current;
      map?.remove();
      if (mapRef.current === map) mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    void import('leaflet').then((leaflet) => {
      const L = leafletFrom(leaflet);
      const nextIds = new Set(cameras.map((camera) => camera.id));
      for (const [id, marker] of markersRef.current) {
        if (!nextIds.has(id)) {
          marker.remove();
          markersRef.current.delete(id);
        }
      }
      cameras.forEach((camera) => {
        const selected = camera.id === selectedId;
        const style = {
          radius: selected ? 7 : 4,
          weight: selected ? 2 : 1,
          color: selected ? '#f4f1ea' : '#c45c26',
          fillColor: selected ? '#e23b2e' : '#d8793a',
          fillOpacity: 0.9,
        };
        const existing = markersRef.current.get(camera.id);
        if (existing) {
          existing.setStyle(style);
          existing.setLatLng([camera.lat, camera.lng]);
          return;
        }
        const marker = L.circleMarker([camera.lat, camera.lng], style);
        const label = document.createElement('span');
        label.textContent = `${camera.name} · ${camera.playMode === 'hls' ? '영상' : '공식 링크'}`;
        marker.bindTooltip(label);
        marker.on('click', () => onSelectRef.current(camera.id));
        marker.addTo(map);
        markersRef.current.set(camera.id, marker);
      });

      const setKey = cameras.map((camera) => camera.id).join('|');
      const size = map.getSize();
      if (cameras.length >= 2 && lastSetRef.current !== setKey && size.x > 0 && size.y > 0) {
        lastSetRef.current = setKey;
        map.fitBounds(
          L.latLngBounds(cameras.map((camera) => [camera.lat, camera.lng])),
          { padding: [28, 28], maxZoom: 9, animate: false },
        );
      }
    });
  }, [cameras, selectedId, ready]);

  useEffect(() => {
    const map = mapRef.current;
    const selected = cameras.find((camera) => camera.id === selectedId);
    if (!map || !selected) return;
    if (lastSelectedRef.current === selected.id) return;
    lastSelectedRef.current = selected.id;
    map.panTo([selected.lat, selected.lng], { animate: false });
  }, [cameras, selectedId, ready]);

  return (
    <>
    <div
      ref={hostRef}
      className="absolute inset-0 bg-[#14161a]"
      aria-label="대한민국 공개 CCTV 지도"
    />
    <div className="absolute left-3 top-3 z-[500] max-w-[calc(100%-1.5rem)] rounded-md border bg-background/95 px-3 py-2 text-xs shadow-sm">
      <p className="font-medium">{cameras.find((camera) => camera.id === selectedId)?.name ?? '대한민국 공개 CCTV'}</p>
      <p className="mt-1 font-mono text-muted-foreground">
        {(() => { const camera = cameras.find((item) => item.id === selectedId); return camera ? `${camera.lat.toFixed(4)}° N  ${camera.lng.toFixed(4)}° E` : `${cameras.length}개 지점`; })()}
      </p>
      <button type="button" className="mt-2 underline underline-offset-4" onClick={() => {
        const map = mapRef.current;
        if (!map || cameras.length === 0) return;
        map.fitBounds(cameras.map((camera) => [camera.lat, camera.lng]), { padding: [40, 40], maxZoom: 10, animate: false });
      }}>전체 지점 보기</button>
    </div>
    </>
  );
}
