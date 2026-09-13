'use client';

import { useEffect, useRef } from 'react';
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
  }, [cameras, selectedId]);

  useEffect(() => {
    const map = mapRef.current;
    const selected = cameras.find((camera) => camera.id === selectedId);
    if (!map || !selected) return;
    if (lastSelectedRef.current === selected.id) return;
    lastSelectedRef.current = selected.id;
    map.panTo([selected.lat, selected.lng], { animate: false });
  }, [cameras, selectedId]);

  return (
    <div
      ref={hostRef}
      className="absolute inset-0 bg-[#14161a]"
      aria-label="대한민국 공개 CCTV 지도"
    />
  );
}
