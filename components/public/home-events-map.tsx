"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type HomeMapEvent = {
  id: string;
  title: string;
  startTimeLabel: string;
  venueName: string;
  city: string;
  latitude: number;
  longitude: number;
};

type HomeEventsMapProps = {
  events: HomeMapEvent[];
  selectedDate: string;
};

type LeafletMap = {
  fitBounds: (bounds: [number, number][], options: { padding: [number, number]; maxZoom: number }) => void;
  setView: (center: [number, number], zoom: number) => void;
  remove: () => void;
};

type LeafletLayerGroup = {
  addTo: (map: LeafletMap) => LeafletLayerGroup;
  clearLayers: () => void;
};

type LeafletMarker = {
  bindPopup: (content: HTMLElement) => LeafletMarker;
  addTo: (layer: LeafletLayerGroup) => void;
};

type LeafletNamespace = {
  map: (
    container: HTMLDivElement,
    options: { center: [number, number]; zoom: number; scrollWheelZoom: boolean }
  ) => LeafletMap;
  tileLayer: (url: string, options: { attribution: string }) => { addTo: (map: LeafletMap) => void };
  layerGroup: () => LeafletLayerGroup;
  marker: (latLng: [number, number]) => LeafletMarker;
};

const WISCONSIN_CENTER: [number, number] = [44.5, -89.5];
const WISCONSIN_ZOOM = 6;
const LEAFLET_CSS_ID = "leaflet-css";
const LEAFLET_SCRIPT_ID = "leaflet-script";

declare global {
  interface Window {
    L?: LeafletNamespace;
  }
}

function createPopupContent(eventRow: HomeMapEvent, selectedDate: string) {
  const wrapper = document.createElement("div");
  wrapper.className = "space-y-1";

  const venueName = document.createElement("p");
  venueName.className = "text-sm font-semibold";
  venueName.textContent = eventRow.venueName;

  const city = document.createElement("p");
  city.className = "text-sm";
  city.textContent = eventRow.city;

  const title = document.createElement("p");
  title.className = "text-sm";
  title.textContent = eventRow.title;

  const start = document.createElement("p");
  start.className = "text-sm";
  start.textContent = `Starts at ${eventRow.startTimeLabel}`;

  const link = document.createElement("a");
  link.href = `/event/${eventRow.id}?date=${selectedDate}`;
  link.className = "text-sm text-blue-700 underline";
  link.textContent = "View event details";

  wrapper.append(venueName, city, title, start, link);

  return wrapper;
}

function ensureLeafletCss() {
  if (document.getElementById(LEAFLET_CSS_ID)) {
    return;
  }

  const link = document.createElement("link");
  link.id = LEAFLET_CSS_ID;
  link.rel = "stylesheet";
  link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
  link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
  link.crossOrigin = "";
  document.head.appendChild(link);
}

function loadLeafletScript() {
  return new Promise<void>((resolve, reject) => {
    if (window.L) {
      resolve();
      return;
    }

    const existingScript = document.getElementById(LEAFLET_SCRIPT_ID) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Failed to load Leaflet.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = LEAFLET_SCRIPT_ID;
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
    script.crossOrigin = "";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Leaflet."));
    document.body.appendChild(script);
  });
}

export function HomeEventsMap({ events, selectedDate }: HomeEventsMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerLayerRef = useRef<LeafletLayerGroup | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const eventBounds = useMemo(() => events.map((eventRow) => [eventRow.latitude, eventRow.longitude] as [number, number]), [events]);

  useEffect(() => {
    let isMounted = true;

    async function setupMap() {
      if (!mapContainerRef.current) {
        return;
      }

      try {
        ensureLeafletCss();
        await loadLeafletScript();

        if (!isMounted || !window.L || !mapContainerRef.current) {
          return;
        }

        const L = window.L;

        if (!mapRef.current) {
          mapRef.current = L.map(mapContainerRef.current, {
            center: WISCONSIN_CENTER,
            zoom: WISCONSIN_ZOOM,
            scrollWheelZoom: false
          });

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(mapRef.current);

          markerLayerRef.current = L.layerGroup().addTo(mapRef.current);
        }

        markerLayerRef.current?.clearLayers();

        for (const eventRow of events) {
          const marker = L.marker([eventRow.latitude, eventRow.longitude]);
          marker.bindPopup(createPopupContent(eventRow, selectedDate));
          marker.addTo(markerLayerRef.current as LeafletLayerGroup);
        }

        if (eventBounds.length > 0) {
          mapRef.current.fitBounds(eventBounds, { padding: [24, 24], maxZoom: 12 });
        } else {
          mapRef.current.setView(WISCONSIN_CENTER, WISCONSIN_ZOOM);
        }

        setLoadError(null);
      } catch (error) {
        console.error(error);

        if (isMounted) {
          setLoadError("Map could not be loaded. You can still use the event list below.");
        }
      }
    }

    setupMap();

    return () => {
      isMounted = false;
    };
  }, [events, eventBounds, selectedDate]);

  useEffect(() => {
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      markerLayerRef.current = null;
    };
  }, []);

  return (
    <section className="space-y-3 rounded-md border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base font-semibold text-slate-900">Map view</h2>
        <p className="text-xs text-slate-500">OpenStreetMap + Leaflet</p>
      </div>

      {loadError ? (
        <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">{loadError}</p>
      ) : null}

      <div ref={mapContainerRef} className="h-80 w-full overflow-hidden rounded-md border border-slate-200 md:h-96" />

      <p className="text-xs text-slate-600">
        Showing {events.length} event{events.length === 1 ? "" : "s"} for this date. Tap a marker to view details.
      </p>

      <p className="text-sm text-slate-700">Prefer the list view? You can still browse all events below.</p>
    </section>
  );
}
