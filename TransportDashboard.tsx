import React, { useState, useEffect, useMemo } from 'react';
import {
  Truck, CheckCircle, Navigation, Compass, ChevronDown, ChevronUp,
  MapPin, Package, Weight, Calendar, Phone, Route as RouteIcon, Clock
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { db } from '../../services/db';
import type { TransportBooking } from '../../types';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import transportBgImage from '../../assets/transport-dashboard-bg.png';

// Fix Leaflet's default marker icons, which otherwise 404 under Vite bundling.
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

// A distinct pin style for "destination" markers so pickup vs. drop-off
// remain visually distinguishable on the map.
const destinationIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'transport-destination-marker'
});

// Approximate coordinates for the towns/mandis referenced in delivery requests.
// Matched by keyword against the free-text pickup/destination strings so the
// map stays fully functional for mock data without needing a geocoding backend.
const LOCATION_COORDS: Array<[string, [number, number]]> = [
  ['rahim yar khan', [28.4202, 70.2952]],
  ['umerkot', [25.3616, 69.7362]],
  ['kunri', [25.2637, 69.7326]],
  ['karachi', [24.8607, 67.0011]],
  ['toba tek singh', [30.9709, 72.4839]],
  ['bahawalpur', [29.3956, 71.6836]],
  ['faisalabad', [31.4180, 73.0790]],
  ['sargodha', [32.0740, 72.6861]],
  ['chiniot', [31.7200, 72.9781]],
  ['multan', [30.1575, 71.5249]],
  ['vehari', [30.0333, 72.3500]],
  ['lahore', [31.5497, 74.3436]]
];

const DEFAULT_CENTER: [number, number] = [30.3753, 69.3451]; // Pakistan-wide fallback

function getCoords(location: string): [number, number] {
  const lower = location.toLowerCase();
  const match = LOCATION_COORDS.find(([keyword]) => lower.includes(keyword));
  if (match) return match[1];
  // Deterministic fallback so unmatched free-text locations still get a stable
  // (if approximate) pin instead of all collapsing onto one point.
  let hash = 0;
  for (let i = 0; i < location.length; i++) hash = (hash * 31 + location.charCodeAt(i)) % 1000;
  return [DEFAULT_CENTER[0] + ((hash % 100) - 50) / 100, DEFAULT_CENTER[1] + ((hash % 70) - 35) / 100];
}

function haversineKm(a: [number, number], b: [number, number]): number {
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLon = ((b[1] - a[1]) * Math.PI) / 180;
  const lat1 = (a[0] * Math.PI) / 180;
  const lat2 = (b[0] * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

// Keeps the map's viewport in sync with whichever request is selected.
const MapViewSync: React.FC<{ bounds: [[number, number], [number, number]] }> = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    map.flyToBounds(bounds, { padding: [40, 40], maxZoom: 10, duration: 0.6 });
  }, [bounds, map]);
  return null;
};

const STATUS_STYLES: Record<TransportBooking['status'], { label: string; className: string }> = {
  Pending: { label: 'Pending', className: 'bg-amber-100 text-amber-800' },
  Accepted: { label: 'Accepted', className: 'bg-[#E8F5E9] text-[#2E7D32]' },
  'In Transit': { label: 'In Transit', className: 'bg-[#8EC5E8]/30 text-[#1F6FA8]' },
  Delivered: { label: 'Delivered', className: 'bg-[#E8F5E9] text-[#2E7D32]' },
  Cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-700' }
};

export const TransportDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [requests, setRequests] = useState<TransportBooking[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadData = () => {
    const list = db.getAllTransportBookings();
    setRequests(list);
    setSelectedId((prev) => prev ?? (list[0]?.id ?? null));
  };

  useEffect(() => {
    loadData();
    const unsub = db.subscribe('agralyticx_transport_bookings', () => loadData());
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAcceptRequest = (reqId: string) => {
    db.updateTransportStatus(reqId, 'Accepted', user?.userId, user?.name);
    loadData();
  };

  const handleSelectRequest = (reqId: string) => {
    setSelectedId(reqId);
    setExpandedId((prev) => (prev === reqId ? prev : reqId));
  };

  const toggleExpanded = (reqId: string) => {
    setExpandedId((prev) => (prev === reqId ? null : reqId));
    setSelectedId(reqId);
  };

  const requestsWithGeo = useMemo(
    () =>
      requests.map((r) => {
        const from = getCoords(r.pickupLocation);
        const to = getCoords(r.destination);
        return { ...r, from, to, distanceKm: Math.round(haversineKm(from, to)) };
      }),
    [requests]
  );

  const selected = requestsWithGeo.find((r) => r.id === selectedId) || requestsWithGeo[0];

  const bounds: [[number, number], [number, number]] | null = selected
    ? [
        [
          Math.min(selected.from[0], selected.to[0]) - 0.15,
          Math.min(selected.from[1], selected.to[1]) - 0.15
        ],
        [
          Math.max(selected.from[0], selected.to[0]) + 0.15,
          Math.max(selected.from[1], selected.to[1]) + 0.15
        ]
      ]
    : null;

  return (
    <div className="transport-dashboard-bg max-w-6xl mx-auto px-4 py-8 space-y-8">

      {/* Full-screen background image with opacity control */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(${transportBgImage})`,
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.45,
          zIndex: -1,
        }}
      />

      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-[#DDE8DD] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32]">
            🚚 {t.roles.transport}
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1F2933]">
            {t.welcome}, <span className="text-[#2E7D32]">{user?.name}</span>
          </h1>
        </div>

        
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-3xl p-6 border border-[#DDE8DD] bg-white space-y-4">
          <h3 className="text-lg font-bold text-[#1F2933] flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#2E7D32]" />
            <span>Open Delivery Requests ({requestsWithGeo.length})</span>
          </h3>

          <div className="space-y-3 max-h-[34rem] overflow-y-auto pr-1">
            {requestsWithGeo.length === 0 && (
              <p className="text-sm text-[#5F6B63] py-6 text-center">No open delivery requests right now.</p>
            )}

            {requestsWithGeo.map((r) => {
              const isSelected = selected?.id === r.id;
              const isExpanded = expandedId === r.id;
              const statusStyle = STATUS_STYLES[r.status];

              return (
                <div
                  key={r.id}
                  className={`rounded-2xl border transition-all cursor-pointer ${
                    isSelected ? 'border-[#2E7D32] bg-[#E8F5E9]/40' : 'border-[#DDE8DD] bg-[#F8FAF7] hover:bg-[#F1F6F0]'
                  }`}
                  onClick={() => handleSelectRequest(r.id)}
                >
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32]">
                        🌾 {r.cropCargo} ({r.quantityTons} Tons)
                      </span>
                      <span className="text-sm font-extrabold text-[#2E7D32] whitespace-nowrap">
                        Rs. {(r.estimatedCostPkr || 9500).toLocaleString()}
                      </span>
                    </div>

                    <div className="text-xs space-y-1 text-[#5F6B63]">
                      <p>📍 From: <strong className="text-[#1F2933]">{r.pickupLocation}</strong></p>
                      <p>🏁 To: <strong className="text-[#1F2933]">{r.destination}</strong></p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusStyle.className}`}>
                        {statusStyle.label}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white border border-[#DDE8DD] text-[#5F6B63] flex items-center gap-1">
                        <RouteIcon className="w-3 h-3" /> {r.distanceKm} km
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white border border-[#DDE8DD] text-[#5F6B63] flex items-center gap-1">
                        <Truck className="w-3 h-3" /> {r.vehicleRequirement}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white border border-[#DDE8DD] text-[#5F6B63] flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {r.scheduledDate}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpanded(r.id);
                      }}
                      className="text-[11px] font-bold text-[#2E7D32] flex items-center gap-1 pt-1"
                    >
                      {isExpanded ? (
                        <>Hide details <ChevronUp className="w-3.5 h-3.5" /></>
                      ) : (
                        <>View details <ChevronDown className="w-3.5 h-3.5" /></>
                      )}
                    </button>

                    {isExpanded && (
                      <div className="pt-2 mt-1 border-t border-[#DDE8DD] text-xs text-[#5F6B63] space-y-1.5">
                        <p className="flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5 text-[#2E7D32]" />
                          Cargo: <span className="text-[#1F2933] font-semibold">{r.cropCargo}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Weight className="w-3.5 h-3.5 text-[#2E7D32]" />
                          Weight: <span className="text-[#1F2933] font-semibold">{r.quantityTons} Tons</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#2E7D32]" />
                          Est. Distance: <span className="text-[#1F2933] font-semibold">{r.distanceKm} km</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#2E7D32]" />
                          Scheduled: <span className="text-[#1F2933] font-semibold">{r.scheduledDate}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-[#2E7D32]" />
                          Contact: <span className="text-[#1F2933] font-semibold">{r.requesterName} • {r.phone}</span>
                        </p>
                        {r.assignedTransporterName && (
                          <p className="flex items-center gap-1.5">
                            <Truck className="w-3.5 h-3.5 text-[#2E7D32]" />
                            Transporter: <span className="text-[#1F2933] font-semibold">{r.assignedTransporterName}</span>
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-[#DDE8DD]">
                      <span className="text-[11px] text-[#5F6B63]">By {r.requesterName}</span>
                      {r.status === 'Pending' ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAcceptRequest(r.id);
                          }}
                          className="px-4 py-1.5 rounded-xl bg-[#2E7D32] hover:bg-[#1b4d1f] text-white font-bold text-xs shadow-xs"
                        >
                          Accept Trip
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-[#2E7D32] flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>{statusStyle.label}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-[#DDE8DD] bg-white space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-bold text-[#1F2933] flex items-center gap-2">
              <Navigation className="w-5 h-5 text-[#2E7D32]" />
              <span>Freight Route Navigator</span>
            </h3>
            {selected && (
              <span className="text-xs font-bold text-[#2E7D32] whitespace-nowrap">
                {selected.distanceKm} km • Rs. {(selected.estimatedCostPkr || 9500).toLocaleString()}
              </span>
            )}
          </div>

          <div className="h-72 rounded-2xl overflow-hidden border border-[#DDE8DD] relative z-0">
            <MapContainer
              center={selected ? selected.from : DEFAULT_CENTER}
              zoom={8}
              scrollWheelZoom
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {requestsWithGeo.map((r) => (
                <Marker
                  key={r.id}
                  position={r.from}
                  eventHandlers={{ click: () => handleSelectRequest(r.id) }}
                >
                  <Popup>
                    <div className="text-xs space-y-0.5">
                      <p className="font-bold">{r.cropCargo} ({r.quantityTons} Tons)</p>
                      <p>📍 Pickup: {r.pickupLocation}</p>
                      <p>🏁 To: {r.destination}</p>
                      <p>Rs. {(r.estimatedCostPkr || 9500).toLocaleString()} • {r.distanceKm} km</p>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {selected && (
                <>
                  <Marker position={selected.to} icon={destinationIcon}>
                    <Popup>Destination: {selected.destination}</Popup>
                  </Marker>
                  <Polyline positions={[selected.from, selected.to]} color="#2E7D32" weight={4} />
                </>
              )}

              {bounds && <MapViewSync bounds={bounds} />}
            </MapContainer>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#E8F5E9]/60 border border-[#DDE8DD] text-xs text-[#2E7D32] font-semibold">
            {selected
              ? `🚛 ${selected.pickupLocation} → ${selected.destination}. Avoiding narrow rural unpaved tracks where possible.`
              : '🚛 Select an open delivery request to preview its route.'}
          </div>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-8 border border-[#DDE8DD] bg-white space-y-4">
        <h3 className="text-lg font-extrabold text-[#1F2933] flex items-center gap-2">
          <Compass className="w-5 h-5 text-[#2E7D32]" />
          <span>Site Guide: How Agralyticx Connects the Agricultural Ecosystem</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2 text-center text-xs">
          <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#DDE8DD] space-y-1.5">
            <span className="text-xl">🌾</span>
            <h4 className="font-bold text-[#1F2933]">1. Farmer</h4>
            <p className="text-[#5F6B63] text-[11px]">Scans disease, checks live mandi prices & uses AI audio assistant</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#DDE8DD] space-y-1.5">
            <span className="text-xl">🌳</span>
            <h4 className="font-bold text-[#1F2933]">2. Landowner</h4>
            <p className="text-[#5F6B63] text-[11px]">Dispatches hourly work alerts & books freight to mandis</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#DDE8DD] space-y-1.5">
            <span className="text-xl">🚚</span>
            <h4 className="font-bold text-[#1F2933]">3. Transport</h4>
            <p className="text-[#5F6B63] text-[11px]">Accepts haulage trips with diesel calculator & route map</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#DDE8DD] space-y-1.5">
            <span className="text-xl">🎓</span>
            <h4 className="font-bold text-[#1F2933]">4. Researcher</h4>
            <p className="text-[#5F6B63] text-[11px]">Uploads trial projects & applies for agribusiness grants</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#DDE8DD] space-y-1.5">
            <span className="text-xl">🏢</span>
            <h4 className="font-bold text-[#1F2933]">5. Company</h4>
            <p className="text-[#5F6B63] text-[11px]">Discovers academic talent to solve agricultural R&D needs</p>
          </div>
        </div>
      </div>
    </div>
  );
};
