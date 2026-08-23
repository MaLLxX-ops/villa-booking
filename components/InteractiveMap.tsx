"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { Villa, formatHarga } from "@/lib/data";
import { useCurrency } from "@/context/CurrencyContext";
import { useLocale, useTranslations } from "next-intl";
import { Maximize2, Compass } from "lucide-react";

interface InteractiveMapProps {
  villas: Villa[];
  selectedVillaId?: string;
  onSelectVilla?: (id: string) => void;
  className?: string;
  singleVillaMode?: boolean;
  zoomLevel?: number;
}

export default function InteractiveMap({
  villas,
  selectedVillaId,
  onSelectVilla,
  className = "w-full h-[600px]",
  singleVillaMode = false,
  zoomLevel,
}: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layerGroupRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const onSelectVillaRef = useRef(onSelectVilla);
  const formatEstimateRef = useRef<any>(null);

  const { formatEstimate } = useCurrency();
  const locale = useLocale();
  const t = useTranslations("Map");

  onSelectVillaRef.current = onSelectVilla;
  formatEstimateRef.current = formatEstimate;

  const [mapReady, setMapReady] = useState(false);

  // Initialize Map Once
  useEffect(() => {
    if (!mapContainerRef.current || typeof window === "undefined") return;

    let isMounted = true;

    import("leaflet").then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Clean up previous instance if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const defaultCenter: [number, number] =
        singleVillaMode && villas.length > 0
          ? [villas[0].koordinat.lat, villas[0].koordinat.lng]
          : [-8.55, 115.18];

      const initialZoom = zoomLevel || (singleVillaMode ? 14 : 10);

      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: initialZoom,
        scrollWheelZoom: false,
        zoomControl: true,
      });

      // OpenStreetMap Tile Layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
      mapInstanceRef.current = map;

      setMapReady(true);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [singleVillaMode]);

  // Update Markers whenever villas, locale, or mapReady change
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !layerGroupRef.current) return;

    import("leaflet").then((L) => {
      const map = mapInstanceRef.current;
      const layerGroup = layerGroupRef.current;
      if (!map || !layerGroup) return;

      // Clear existing markers
      layerGroup.clearLayers();
      markersRef.current = {};

      const bounds = L.latLngBounds([]);

      villas.forEach((villa) => {
        const { lat, lng } = villa.koordinat;
        bounds.extend([lat, lng]);

        const estimate = formatEstimateRef.current
          ? formatEstimateRef.current(villa.harga_per_malam)
          : "";
        const detailUrl = `/${locale}/villa/${villa.id}`;

        const isSelected = selectedVillaId === villa.id;

        // Custom Pin HTML
        const pinIcon = L.divIcon({
          className: "stayvilla-map-pin",
          html: `
            <div style="
              background: ${isSelected ? "#152238" : "#BA5D38"};
              color: white;
              width: ${isSelected ? "44px" : "38px"};
              height: ${isSelected ? "44px" : "38px"};
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              display: flex;
              align-items: center;
              justify-content: center;
              border: 3px solid ${isSelected ? "#D4AF37" : "white"};
              box-shadow: 0 6px 18px rgba(0,0,0,0.35);
              cursor: pointer;
              transition: all 0.25s ease;
            ">
              <span style="transform: rotate(45deg); font-size: ${isSelected ? "18px" : "15px"};">🏡</span>
            </div>
          `,
          iconSize: [isSelected ? 44 : 38, isSelected ? 44 : 38],
          iconAnchor: [isSelected ? 22 : 19, isSelected ? 44 : 38],
          popupAnchor: [0, isSelected ? -44 : -38],
        });

        const popupContent = `
          <div style="font-family: inherit; width: 230px; border-radius: 12px; overflow: hidden; padding: 0;">
            <div style="position: relative; width: 100%; height: 120px; background: #E2D7C7;">
              <img src="${villa.galeri_foto[0]}" alt="${villa.nama}" style="width: 100%; height: 100%; object-fit: cover;" />
              <div style="position: absolute; top: 6px; left: 6px; background: rgba(21,34,56,0.85); color: white; font-size: 10px; font-weight: bold; padding: 2px 8px; border-radius: 99px;">
                ${villa.kategori}
              </div>
            </div>
            <div style="padding: 10px 12px;">
              <h4 style="margin: 0; font-size: 14px; font-weight: 800; color: #152238; line-height: 1.2;">
                ${villa.nama}
              </h4>
              <p style="margin: 3px 0 8px 0; font-size: 11px; color: #615A52;">
                📍 ${villa.lokasi}
              </p>
              <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 8px;">
                <div>
                  <span style="font-size: 13px; font-weight: 900; color: #934020;">
                    ${formatHarga(villa.harga_per_malam)}
                  </span>
                  ${
                    estimate
                      ? `<div style="font-size: 10px; color: #443E38; font-weight: bold;">${estimate}</div>`
                      : ""
                  }
                </div>
                <span style="font-size: 10px; color: #615A52;">${t("perNight")}</span>
              </div>
              <a href="${detailUrl}" style="
                display: block;
                text-align: center;
                background: #BA5D38;
                color: white;
                text-decoration: none;
                font-size: 11px;
                font-weight: 700;
                padding: 6px 12px;
                border-radius: 8px;
                transition: background 0.2s;
              ">
                ${t("viewDetail")} →
              </a>
            </div>
          </div>
        `;

        const marker = L.marker([lat, lng], { icon: pinIcon })
          .addTo(layerGroup)
          .bindPopup(popupContent, {
            maxWidth: 260,
            className: "stayvilla-custom-popup",
          });

        marker.on("click", () => {
          if (onSelectVillaRef.current) {
            onSelectVillaRef.current(villa.id);
          }
        });

        markersRef.current[villa.id] = marker;
      });

      // If in single villa mode or selected, focus immediately
      if (singleVillaMode && villas.length > 0) {
        map.setView([villas[0].koordinat.lat, villas[0].koordinat.lng], zoomLevel || 14);
      } else if (!selectedVillaId && villas.length > 0 && bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
      }
    });
  }, [villas, locale, mapReady, singleVillaMode, zoomLevel, t]);

  // Handle zooming smoothly to selectedVillaId
  useEffect(() => {
    if (!selectedVillaId || !mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    const marker = markersRef.current[selectedVillaId];

    if (marker) {
      const latLng = marker.getLatLng();
      map.flyTo(latLng, 14, {
        animate: true,
        duration: 0.75,
      });

      // Open popup after flight start
      setTimeout(() => {
        marker.openPopup();
      }, 400);
    }
  }, [selectedVillaId]);

  const fitAllBounds = () => {
    if (!mapInstanceRef.current || typeof window === "undefined") return;
    import("leaflet").then((L) => {
      const bounds = L.latLngBounds([]);
      villas.forEach((v) => bounds.extend([v.koordinat.lat, v.koordinat.lng]));
      if (bounds.isValid()) {
        mapInstanceRef.current.flyToBounds(bounds, {
          padding: [50, 50],
          duration: 0.8,
        });
      }
    });
  };

  return (
    <div
      className={`relative rounded-3xl overflow-hidden shadow-xl border border-sand bg-cream ${className}`}
    >
      <div ref={mapContainerRef} className="w-full h-full z-0 bg-sand/30" />

      {/* Quick Recenter / Fit All Control Button */}
      {!singleVillaMode && (
        <button
          type="button"
          onClick={fitAllBounds}
          className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-md hover:bg-white text-navy px-3 py-2 rounded-xl text-xs font-bold shadow-lg border border-sand flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Tampilkan Semua Villa di Bali"
        >
          <Compass className="w-4 h-4 text-terracotta" />
          <span>Lihat Semua ({villas.length})</span>
        </button>
      )}
    </div>
  );
}
