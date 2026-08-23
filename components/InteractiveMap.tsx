"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { Villa, formatHarga } from "@/lib/data";
import { useCurrency } from "@/context/CurrencyContext";
import { useLocale, useTranslations } from "next-intl";

interface InteractiveMapProps {
  villas: Villa[];
  selectedVillaId?: string;
  onSelectVilla?: (id: string) => void;
  className?: string;
}

export default function InteractiveMap({
  villas,
  selectedVillaId,
  onSelectVilla,
  className = "w-full h-[600px]",
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const { formatEstimate } = useCurrency();
  const locale = useLocale();
  const t = useTranslations("Map");

  useEffect(() => {
    if (!mapRef.current || typeof window === "undefined") return;

    // Dynamically import Leaflet
    let isMounted = true;

    import("leaflet").then((L) => {
      if (!isMounted || !mapRef.current) return;

      // Clean up previous instance if exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Default center: Bali (near Ubud/Denpasar)
      const map = L.map(mapRef.current, {
        center: [-8.55, 115.18],
        zoom: 10,
        scrollWheelZoom: false,
      });

      mapInstanceRef.current = map;

      // OpenStreetMap Tile Layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      // Create Custom Pins for each villa
      markersRef.current = {};
      const bounds = L.latLngBounds([]);

      villas.forEach((villa) => {
        const { lat, lng } = villa.koordinat;
        bounds.extend([lat, lng]);

        const estimate = formatEstimate(villa.harga_per_malam);
        const detailUrl = `/${locale}/villa/${villa.id}`;

        // Custom HTML Marker Pin
        const pinIcon = L.divIcon({
          className: "stayvilla-map-pin",
          html: `
            <div style="
              background: #BA5D38;
              color: white;
              width: 38px;
              height: 38px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              display: flex;
              align-items: center;
              justify-content: center;
              border: 3px solid white;
              box-shadow: 0 4px 14px rgba(186,93,56,0.5);
              cursor: pointer;
              transition: transform 0.2s ease;
            ">
              <span style="transform: rotate(45deg); font-size: 16px;">🏡</span>
            </div>
          `,
          iconSize: [38, 38],
          iconAnchor: [19, 38],
          popupAnchor: [0, -38],
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
          .addTo(map)
          .bindPopup(popupContent, {
            maxWidth: 260,
            className: "stayvilla-custom-popup",
          });

        marker.on("click", () => {
          if (onSelectVilla) onSelectVilla(villa.id);
        });

        markersRef.current[villa.id] = marker;
      });

      if (villas.length > 0 && bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [villas, locale, formatEstimate, onSelectVilla, t]);

  // Handle zooming / popup trigger when selectedVillaId changes
  useEffect(() => {
    if (!selectedVillaId || !mapInstanceRef.current) return;
    const marker = markersRef.current[selectedVillaId];
    if (marker) {
      mapInstanceRef.current.setView(marker.getLatLng(), 13, {
        animate: true,
      });
      marker.openPopup();
    }
  }, [selectedVillaId]);

  return (
    <div className={`relative rounded-3xl overflow-hidden shadow-xl border border-sand ${className}`}>
      <div ref={mapRef} className="w-full h-full z-0 bg-sand/30" />
    </div>
  );
}
