"use client";

import { useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface DeliveryLocation {
  id: number;
  name: string;
  region: string;
  delivery_fee: number | null;
  is_active: boolean;
}

interface LocationCoordinates {
  [key: string]: { lat: number; lng: number };
}

interface MapComponentProps {
  shopLocation: { lat: number; lng: number };
  selectedLocation: { lat: number; lng: number } | null;
  userLocation: { lat: number; lng: number } | null;
  showDirections: boolean;
  allLocations: DeliveryLocation[];
  locationCoordinates: LocationCoordinates;
}

export default function MapComponent({
  shopLocation,
  selectedLocation,
  userLocation,
  showDirections,
  allLocations,
  locationCoordinates,
}: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const routeRef = useRef<L.Polyline | null>(null);
  const isInitializedRef = useRef(false);

  // Fix for default marker icons in Next.js
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    });
  }, []);

  const updateMarkers = useCallback(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Clear existing route
    if (routeRef.current) {
      routeRef.current.remove();
      routeRef.current = null;
    }

    // Add shop marker (always visible)
    const shopIcon = L.icon({
      iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const shopMarker = L.marker([shopLocation.lat, shopLocation.lng], { icon: shopIcon })
      .addTo(map)
      .bindPopup("<b>Our Shop</b><br>Lamin");
    markersRef.current.push(shopMarker);

    // Add markers for all delivery locations
    const locationIcon = L.icon({
      iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    allLocations.forEach((location) => {
      const coords = locationCoordinates[location.name];
      if (coords && location.is_active) {
        // Handle both string and number delivery_fee
        const feeValue = typeof location.delivery_fee === 'string' 
          ? parseFloat(location.delivery_fee) 
          : location.delivery_fee;
        
        const fee = feeValue !== null && feeValue > 0 
          ? `D${feeValue.toFixed(2)}` 
          : "Free";
        
        const marker = L.marker([coords.lat, coords.lng], { icon: locationIcon })
          .addTo(map)
          .bindPopup(`
            <div style="text-align: center; min-width: 120px;">
              <b style="font-size: 14px; color: #2563eb;">${location.name}</b><br>
              <span style="font-size: 12px; color: #666;">Delivery Fee: <strong style="color: #9333ea;">${fee}</strong></span>
            </div>
          `);
        markersRef.current.push(marker);
      }
    });

    // Highlight selected location with different icon
    if (selectedLocation) {
      const selectedIcon = L.icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        iconSize: [30, 48],
        iconAnchor: [15, 48],
        popupAnchor: [1, -40],
        shadowSize: [48, 48],
      });

      // Find the location data
      const locationData = allLocations.find(loc => {
        const coords = locationCoordinates[loc.name];
        return coords && coords.lat === selectedLocation.lat && coords.lng === selectedLocation.lng;
      });

      const feeValue = typeof locationData?.delivery_fee === 'string' 
        ? parseFloat(locationData.delivery_fee) 
        : locationData?.delivery_fee;
      const fee = feeValue !== null && feeValue !== undefined && feeValue > 0 
        ? `D${feeValue.toFixed(2)}` 
        : "Free";

      const selectedMarker = L.marker([selectedLocation.lat, selectedLocation.lng], { icon: selectedIcon })
        .addTo(map)
        .bindPopup(`
          <div style="text-align: center; min-width: 140px;">
            <b style="font-size: 16px; color: #9333ea;">${locationData?.name || 'Selected Location'}</b><br>
            <span style="font-size: 13px; color: #666;">Delivery Fee: <strong style="color: #9333ea; font-size: 16px;">${fee}</strong></span><br>
            <span style="font-size: 11px; color: #9333ea; font-weight: bold;">✓ Selected</span>
          </div>
        `);
      markersRef.current.push(selectedMarker);
    }

    // Add user location marker if available
    if (userLocation) {
      const userIcon = L.icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(map)
        .bindPopup("<b>Your Location</b>");
      markersRef.current.push(userMarker);
    }

    // Draw route if showing directions
    if (showDirections && userLocation && selectedLocation) {
      // Draw a simple straight line route (for better routing, you'd use a routing service)
      const route = L.polyline(
        [
          [userLocation.lat, userLocation.lng],
          [selectedLocation.lat, selectedLocation.lng],
          [shopLocation.lat, shopLocation.lng],
        ],
        {
          color: "#9333ea",
          weight: 4,
          opacity: 0.7,
          dashArray: "10, 10",
        }
      ).addTo(map);

      routeRef.current = route;

      // Fit map to show all markers
      const group = new L.FeatureGroup([
        shopMarker,
        ...markersRef.current.filter((m) => m !== shopMarker),
        route,
      ]);
      map.fitBounds(group.getBounds().pad(0.1));
    } else if (selectedLocation) {
      // Fit map to show shop and selected location
      const otherMarkers = markersRef.current.filter((m) => m !== shopMarker);
      if (otherMarkers.length > 0) {
        const group = new L.FeatureGroup([shopMarker, ...otherMarkers]);
        map.fitBounds(group.getBounds().pad(0.1));
      }
    } else {
      // Fit map to show all locations
      const allMarkers = markersRef.current;
      if (allMarkers.length > 1) {
        try {
          const group = new L.FeatureGroup(allMarkers);
          map.fitBounds(group.getBounds().pad(0.1));
        } catch (e) {
          // If bounds calculation fails, center on shop
          map.setView([shopLocation.lat, shopLocation.lng], 11);
        }
      } else {
        // Center on shop
        map.setView([shopLocation.lat, shopLocation.lng], 11);
      }
    }
  }, [shopLocation, selectedLocation, userLocation, showDirections, allLocations, locationCoordinates]);

  useEffect(() => {
    if (!mapContainerRef.current || isInitializedRef.current) return;

    // Initialize map
    const map = L.map(mapContainerRef.current).setView([shopLocation.lat, shopLocation.lng], 11);

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;
    isInitializedRef.current = true;

    // Wait for map to be ready before adding markers
    map.whenReady(() => {
      updateMarkers();
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        isInitializedRef.current = false;
      }
    };
  }, [shopLocation, updateMarkers]);

  // Update markers when props change (but only if map is initialized)
  useEffect(() => {
    if (isInitializedRef.current && mapRef.current) {
      updateMarkers();
    }
  }, [selectedLocation, userLocation, showDirections, allLocations, updateMarkers]);

  return <div ref={mapContainerRef} className="w-full h-full" />;
}
