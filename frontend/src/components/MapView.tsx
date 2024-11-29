import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapViewProps {
  center?: [number, number];
}

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export function MapView({ center }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const newMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: center || [-74.5, 40],
      zoom: 9,
      attributionControl: false
    });

    newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
    newMap.addControl(new mapboxgl.AttributionControl({ compact: true }));

    newMap.on('load', () => {
      setMapLoaded(true);
    });

    map.current = newMap;

    return () => {
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (center && map.current && mapLoaded) {
      // Remove previous marker if it exists
      if (marker.current) {
        marker.current.remove();
      }

      // Add new marker
      marker.current = new mapboxgl.Marker({
        color: '#4287f5',
        draggable: false
      })
        .setLngLat(center)
        .addTo(map.current);

      // Fly to new location
      map.current.flyTo({
        center,
        zoom: 10,
        duration: 2000,
        essential: true
      });
    }
  }, [center, mapLoaded]);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm h-full">
      <h2 className="text-xl font-semibold mb-6">Map View</h2>
      <div 
        ref={mapContainer} 
        className="rounded-2xl h-[calc(100%-3rem)] overflow-hidden"
      />
    </div>
  );
}