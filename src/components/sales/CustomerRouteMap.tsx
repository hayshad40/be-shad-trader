import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Customer } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Navigation,
  Phone,
  MessageSquare,
  CheckCircle2,
  Store,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Compass,
} from 'lucide-react';

interface CustomerRouteMapProps {
  customers: Customer[];
  selectedCustomer: Customer | null;
  onSelectCustomer: (customer: Customer) => void;
  currentRoute?: string;
  onRouteChange?: (route: string) => void;
}

export const CustomerRouteMap: React.FC<CustomerRouteMapProps> = ({
  customers,
  selectedCustomer,
  onSelectCustomer,
  currentRoute,
  onRouteChange,
}) => {
  const { formatMoney } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLineLayerRef = useRef<L.Polyline | null>(null);
  const repLocationMarkerRef = useRef<L.Marker | null>(null);

  const [activeRouteFilter, setActiveRouteFilter] = useState<string>(
    currentRoute || (customers[0]?.route || 'All')
  );
  const [showRepLocation, setShowRepLocation] = useState<boolean>(true);

  // Available unique routes
  const availableRoutes = [
    'All',
    ...Array.from(new Set(customers.map((c) => c.route).filter(Boolean))) as string[],
  ];

  // Customers filtered by route and having valid coordinates
  const routeCustomers = customers.filter((c) => {
    const matchesRoute = activeRouteFilter === 'All' || c.route === activeRouteFilter;
    const hasCoords = c.latitude !== undefined && c.longitude !== undefined;
    return matchesRoute && hasCoords;
  });

  // Calculate route statistics
  const totalOutlets = routeCustomers.length;
  const totalReceivables = routeCustomers.reduce((acc, c) => acc + c.currentBalance, 0);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default center around Lahore or first customer
      const defaultCenter: [number, number] = [
        selectedCustomer?.latitude || routeCustomers[0]?.latitude || 31.5204,
        selectedCustomer?.longitude || routeCustomers[0]?.longitude || 74.3168,
      ];

      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 13,
        zoomControl: false,
      });

      // OpenStreetMap Tile Layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Layer groups for markers and polyline
      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers and Polyline when routeCustomers or selectedCustomer changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    if (markersLayerRef.current) {
      markersLayerRef.current.clearLayers();
    }
    if (routeLineLayerRef.current) {
      map.removeLayer(routeLineLayerRef.current);
      routeLineLayerRef.current = null;
    }
    if (repLocationMarkerRef.current) {
      map.removeLayer(repLocationMarkerRef.current);
      repLocationMarkerRef.current = null;
    }

    if (routeCustomers.length === 0) return;

    const latLngs: [number, number][] = [];

    routeCustomers.forEach((cust, index) => {
      if (cust.latitude === undefined || cust.longitude === undefined) return;

      const isSelected = selectedCustomer?.id === cust.id;
      const stopNumber = index + 1;
      const isHighBalance = cust.currentBalance > cust.creditLimit * 0.7;

      latLngs.push([cust.latitude, cust.longitude]);

      // Custom HTML Marker Icon
      const pinColor = isSelected
        ? '#d97706' // amber-600
        : isHighBalance
        ? '#e11d48' // rose-600
        : '#059669'; // emerald-600

      const markerHtml = `
        <div style="
          position: relative;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        ">
          <div style="
            width: 32px;
            height: 32px;
            background: ${pinColor};
            color: #ffffff;
            font-weight: 800;
            font-size: 11px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            border: 2px solid #ffffff;
            ${isSelected ? 'outline: 3px solid #fbbf24; outline-offset: 2px;' : ''}
          ">
            <span style="transform: rotate(45deg); font-family: sans-serif;">${stopNumber}</span>
          </div>
          ${
            isSelected
              ? `<div style="
                  position: absolute;
                  bottom: -6px;
                  width: 10px;
                  height: 10px;
                  border-radius: 50%;
                  background: #d97706;
                  box-shadow: 0 0 10px #d97706;
                  animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
                "></div>`
              : ''
          }
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-route-marker',
        html: markerHtml,
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38],
      });

      const marker = L.marker([cust.latitude, cust.longitude], { icon: customIcon });

      // Build rich popup content
      const popupHtml = `
        <div style="min-width: 220px; font-family: system-ui, sans-serif; padding: 2px;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
            <span style="background: #fef3c7; color: #92400e; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px;">
              Stop #${stopNumber}
            </span>
            <span style="font-size: 11px; color: #64748b; font-weight: 500;">${cust.area}</span>
          </div>
          <div style="font-weight: 800; font-size: 13px; color: #0f172a; line-height: 1.2;">
            ${cust.name}
          </div>
          <div style="font-size: 11px; color: #475569; margin-top: 2px; font-weight: 500;">
            ${cust.company}
          </div>
          <div style="font-size: 10px; color: #64748b; margin-top: 4px;">
            📍 ${cust.address}
          </div>
          <div style="font-size: 9px; font-family: monospace; color: #94a3b8; margin-top: 2px;">
            GPS: ${cust.latitude.toFixed(4)}, ${cust.longitude.toFixed(4)}
          </div>
          <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-size: 11px;">
            <span style="color: #64748b;">Balance:</span>
            <span style="font-weight: 700; color: ${isHighBalance ? '#e11d48' : '#059669'};">
              ${formatMoney(cust.currentBalance)}
            </span>
          </div>
          <div style="margin-top: 8px;">
            <button id="select-cust-btn-${cust.id}" style="
              width: 100%;
              padding: 6px 10px;
              background: #d97706;
              color: #ffffff;
              border: none;
              border-radius: 8px;
              font-size: 11px;
              font-weight: 700;
              cursor: pointer;
              box-shadow: 0 2px 4px rgba(217, 119, 6, 0.3);
            ">
              Select Outlet for Order
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        onSelectCustomer(cust);
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`select-cust-btn-${cust.id}`);
        if (btn) {
          btn.onclick = () => {
            onSelectCustomer(cust);
            map.closePopup();
          };
        }
      });

      if (markersLayerRef.current) {
        markersLayerRef.current.addLayer(marker);
      }
    });

    // Draw route connecting line (Path of travel)
    if (latLngs.length > 1) {
      const routePolyline = L.polyline(latLngs, {
        color: '#4f46e5', // indigo-600
        weight: 3.5,
        opacity: 0.75,
        dashArray: '8, 8',
      }).addTo(map);
      routeLineLayerRef.current = routePolyline;
    }

    // Add field representative simulated live GPS marker
    if (showRepLocation && latLngs.length > 0) {
      const repLat = latLngs[0][0] - 0.003;
      const repLng = latLngs[0][1] - 0.002;
      const repIcon = L.divIcon({
        className: 'rep-location-marker',
        html: `
          <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
            <div style="width: 20px; height: 20px; background: #3b82f6; border: 3px solid #ffffff; border-radius: 50%; box-shadow: 0 0 12px #3b82f6;"></div>
            <div style="position: absolute; width: 28px; height: 28px; border-radius: 50%; border: 2px solid #3b82f6; opacity: 0.7; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const repMarker = L.marker([repLat, repLng], { icon: repIcon })
        .bindPopup('<b style="font-size: 11px;">Your Current GPS Location</b><br><span style="font-size: 10px; color: #64748b;">Field Rep Van-08 On-Route</span>')
        .addTo(map);

      repLocationMarkerRef.current = repMarker;
    }

    // Fit map bounds to encompass all outlets on route
    if (latLngs.length > 0) {
      if (selectedCustomer?.latitude && selectedCustomer?.longitude) {
        map.setView([selectedCustomer.latitude, selectedCustomer.longitude], 14, { animate: true });
      } else {
        const bounds = L.latLngBounds(latLngs);
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
      }
    }
  }, [routeCustomers, selectedCustomer, showRepLocation]);

  // Center on selected customer or fit bounds
  const handleFitRouteBounds = () => {
    const map = mapInstanceRef.current;
    if (!map || routeCustomers.length === 0) return;

    const latLngs = routeCustomers
      .filter((c) => c.latitude !== undefined && c.longitude !== undefined)
      .map((c) => [c.latitude!, c.longitude!] as [number, number]);

    if (latLngs.length > 0) {
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  };

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
      {/* Route Control & Statistics Header */}
      <div className="p-3.5 bg-slate-50/90 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 text-xs sm:text-sm">Route Outlets Map</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[10px]">
                {totalOutlets} Stops
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Visiting sequence & GPS coordinates for order taking
            </p>
          </div>
        </div>

        {/* Route Filter Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">
            Route:
          </label>
          <select
            value={activeRouteFilter}
            onChange={(e) => {
              const val = e.target.value;
              setActiveRouteFilter(val);
              if (onRouteChange) onRouteChange(val);
            }}
            className="p-1.5 px-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 shadow-2xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
          >
            {availableRoutes.map((r) => (
              <option key={r} value={r}>
                {r === 'All' ? 'All Territory Routes' : r}
              </option>
            ))}
          </select>

          <button
            onClick={handleFitRouteBounds}
            className="p-1.5 px-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl transition flex items-center gap-1 shadow-2xs"
            title="Fit all route stops to map screen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline font-medium">Fit Route</span>
          </button>

          <button
            onClick={() => setShowRepLocation(!showRepLocation)}
            className={`p-1.5 px-2 rounded-xl transition flex items-center gap-1 text-[11px] font-semibold border ${
              showRepLocation
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
            title="Toggle Live Salesman GPS Location"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">My GPS</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Map Canvas */}
      <div className="relative w-full h-[360px] sm:h-[420px] bg-slate-100">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Floating Map Zoom Controls */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5 bg-white/95 backdrop-blur-xs p-1 rounded-xl shadow-lg border border-slate-200">
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center justify-center transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center justify-center transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Legend Overlay at bottom left */}
        <div className="absolute bottom-3 left-3 z-20 bg-white/95 backdrop-blur-xs p-2.5 rounded-xl shadow-lg border border-slate-200 text-[10px] space-y-1 text-slate-600 hidden sm:block">
          <div className="font-bold text-slate-800 text-[11px] mb-1">Route Pins Legend</div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span>Normal Credit Outlet</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
            <span>High Balance Outlet (&gt;70%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Selected Active Outlet</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span>Your Live GPS Position</span>
          </div>
        </div>

        {/* Selected Customer Floating Info Card */}
        {selectedCustomer && (
          <div className="absolute bottom-3 right-3 left-3 sm:left-auto sm:w-80 z-20 bg-white/98 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-amber-300 ring-2 ring-amber-500/10">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold uppercase tracking-wider">
                  Selected Destination
                </span>
                <h4 className="font-bold text-xs text-slate-900 mt-1">{selectedCustomer.name}</h4>
                <p className="text-[11px] text-slate-600 font-medium">{selectedCustomer.company}</p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />
            </div>

            <div className="mt-2 text-[11px] text-slate-500 space-y-0.5">
              <p className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">{selectedCustomer.address}</span>
              </p>
              {selectedCustomer.latitude && selectedCustomer.longitude && (
                <p className="text-[10px] font-mono text-slate-400 pl-4">
                  GPS: {selectedCustomer.latitude.toFixed(4)}, {selectedCustomer.longitude.toFixed(4)}
                </p>
              )}
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">Ledger Khata:</span>
              <span className="font-bold text-slate-800">{formatMoney(selectedCustomer.currentBalance)}</span>
            </div>

            <div className="mt-2 pt-2 flex gap-2">
              {selectedCustomer.phone && (
                <a
                  href={`tel:${selectedCustomer.phone}`}
                  className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition"
                >
                  <Phone className="w-3 h-3 text-emerald-600" />
                  <span>Call</span>
                </a>
              )}
              {selectedCustomer.whatsapp && (
                <a
                  href={`https://wa.me/${selectedCustomer.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition"
                >
                  <MessageSquare className="w-3 h-3 text-emerald-600" />
                  <span>WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Outlets Horizontal Mini-Carousel */}
      <div className="p-3 bg-slate-50 border-t border-slate-200">
        <div className="flex items-center justify-between mb-2 text-xs">
          <span className="font-bold text-slate-700">Quick Sequence on Route:</span>
          <span className="text-[11px] text-slate-500 font-medium">Click any stop to select</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {routeCustomers.map((cust, i) => {
            const isSelected = selectedCustomer?.id === cust.id;
            return (
              <button
                key={cust.id}
                onClick={() => onSelectCustomer(cust)}
                className={`flex-shrink-0 p-2.5 rounded-xl border text-left transition w-48 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 shadow-xs'
                    : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                      Stop #{i + 1}
                    </span>
                    <span className="font-semibold text-slate-500">{cust.area}</span>
                  </div>
                  <p className="font-bold text-xs text-slate-900 truncate">{cust.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{cust.company}</p>
                </div>
                <div className="mt-2 pt-1 border-t border-slate-100 flex justify-between items-center text-[10px]">
                  <span className="text-slate-400">Balance:</span>
                  <span className="font-bold text-slate-800">{formatMoney(cust.currentBalance)}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
