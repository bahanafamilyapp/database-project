import { useState, useEffect } from 'react';
import { MapPin, Users, Home, TrendingUp } from 'lucide-react';
import { households, people } from '../data/mockData';

export default function Peta() {
  const [selectedHousehold, setSelectedHousehold] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-6.2088, 106.8456]);
  const [mapZoom, setMapZoom] = useState(5);

  const totalLocations = households.length;
  const uniqueRegions = new Set(households.map(h => h.city)).size;
  const avgMembers = (households.reduce((sum, h) => sum + h.members.length, 0) / households.length).toFixed(1);

  const getPersonName = (personId: string) => {
    const person = people.find(p => p.id === personId);
    return person ? person.name : personId;
  };

  const getMarkerColor = (membersCount: number) => {
    if (membersCount >= 4) return '#10B981';
    if (membersCount >= 2) return '#3562A7';
    return '#F59E0B';
  };

  const focusOnHousehold = (household: typeof households[0]) => {
    setMapCenter(household.coords);
    setMapZoom(10);
    setSelectedHousehold(household.id);
  };

  const resetView = () => {
    setMapCenter([-6.2088, 106.8456]);
    setMapZoom(5);
    setSelectedHousehold(null);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 h-[calc(100vh-2rem)]">
      <div>
        <h1 className="text-3xl font-medium text-gray-900 mb-2">Peta Lokasi</h1>
        <p className="text-[#6B7280]">Visualisasi lokasi rumah tangga dalam database keluarga</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100%-120px)]">
        <div className="lg:col-span-3 bg-white rounded-[10px] border border-[#E5E9F0] shadow-[0_6px_18px_rgba(16,24,40,0.06)] overflow-hidden relative">
          <div className="absolute top-4 left-4 z-10 bg-white px-4 py-2 rounded-lg border border-[#E5E9F0] shadow-lg">
            <button
              onClick={resetView}
              className="text-sm font-medium text-[#3562A7] hover:text-[#2a4d85]"
            >
              Reset View
            </button>
          </div>

          <div className="w-full h-full bg-[#F5F7FB] relative flex items-center justify-center overflow-hidden">
            <svg
              viewBox="-180 -90 360 180"
              className="w-full h-full"
              style={{
                transform: `scale(${mapZoom / 5})`,
                transformOrigin: `${mapCenter[1]}% ${mapCenter[0]}%`,
                transition: 'transform 0.5s ease-in-out',
              }}
            >
              <rect x="-180" y="-90" width="360" height="180" fill="#E0E7FF" />

              <path
                d="M 95 -5 L 142 -6 L 141 8 L 95 8 Z"
                fill="#10B981"
                stroke="#065F46"
                strokeWidth="0.3"
              />

              {households.map((household) => {
                const [lat, lng] = household.coords;
                const isSelected = selectedHousehold === household.id;
                const color = getMarkerColor(household.members.length);

                return (
                  <g key={household.id}>
                    <circle
                      cx={lng}
                      cy={lat}
                      r={isSelected ? 2 : 1.5}
                      fill={color}
                      stroke="white"
                      strokeWidth="0.3"
                      className="cursor-pointer transition-all"
                      onClick={() => focusOnHousehold(household)}
                    />
                    {isSelected && (
                      <>
                        <circle
                          cx={lng}
                          cy={lat}
                          r={3}
                          fill="none"
                          stroke={color}
                          strokeWidth="0.2"
                          opacity="0.5"
                        >
                          <animate
                            attributeName="r"
                            from="3"
                            to="5"
                            dur="1.5s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            from="0.5"
                            to="0"
                            dur="1.5s"
                            repeatCount="indefinite"
                          />
                        </circle>
                        <rect
                          x={lng + 2}
                          y={lat - 1}
                          width="20"
                          height="4"
                          fill="white"
                          stroke={color}
                          strokeWidth="0.2"
                          rx="0.5"
                        />
                        <text
                          x={lng + 12}
                          y={lat + 1.2}
                          fontSize="1.5"
                          fill="#1F2937"
                          textAnchor="middle"
                          fontWeight="bold"
                        >
                          {household.title.split(' ')[1]}
                        </text>
                      </>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg border border-[#E5E9F0] shadow-lg">
            <p className="text-xs font-medium text-gray-900 mb-2">Legenda:</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10B981' }} />
                <span className="text-xs text-[#6B7280]">4+ anggota</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#3562A7' }} />
                <span className="text-xs text-[#6B7280]">2-3 anggota</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#F59E0B' }} />
                <span className="text-xs text-[#6B7280]">1 anggota</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 overflow-y-auto">
          <div className="bg-white rounded-[10px] p-6 border border-[#E5E9F0] shadow-[0_6px_18px_rgba(16,24,40,0.06)]">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Statistik</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-[#3562A7] p-2 rounded-lg">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-[#6B7280]">Total Lokasi</span>
                </div>
                <p className="text-2xl font-medium text-gray-900">{totalLocations}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-[#10B981] p-2 rounded-lg">
                    <Home className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-[#6B7280]">Wilayah Berbeda</span>
                </div>
                <p className="text-2xl font-medium text-gray-900">{uniqueRegions}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-[#F59E0B] p-2 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-[#6B7280]">Rata-rata Anggota</span>
                </div>
                <p className="text-2xl font-medium text-gray-900">{avgMembers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[10px] p-6 border border-[#E5E9F0] shadow-[0_6px_18px_rgba(16,24,40,0.06)]">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Daftar Lokasi</h2>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {households.map((household) => {
                const isSelected = selectedHousehold === household.id;
                const color = getMarkerColor(household.members.length);

                return (
                  <button
                    key={household.id}
                    onClick={() => focusOnHousehold(household)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-[#3562A7] bg-blue-50'
                        : 'border-[#E5E9F0] hover:border-[#3562A7] hover:bg-[#F5F7FB]'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div
                        className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {household.title}
                        </p>
                        <p className="text-xs text-[#6B7280] truncate">{household.city}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Users className="w-3 h-3 text-[#6B7280]" />
                          <span className="text-xs text-[#6B7280]">
                            {household.members.length} anggota
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedHousehold && (
            <div className="bg-white rounded-[10px] p-6 border border-[#E5E9F0] shadow-[0_6px_18px_rgba(16,24,40,0.06)]">
              {(() => {
                const household = households.find(h => h.id === selectedHousehold);
                if (!household) return null;

                return (
                  <>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Detail Lokasi</h2>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-[#6B7280] mb-1">Nama Keluarga</p>
                        <p className="font-medium text-gray-900">{household.title}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#6B7280] mb-1">Alamat</p>
                        <p className="font-medium text-gray-900">{household.address}</p>
                        <p className="text-sm text-gray-900">{household.city}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#6B7280] mb-1">Koordinat</p>
                        <p className="font-medium text-gray-900 text-xs font-mono">
                          {household.coords[0]}, {household.coords[1]}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-[#6B7280] mb-2">Anggota ({household.members.length})</p>
                        <div className="flex flex-wrap gap-2">
                          {household.members.map(memberId => (
                            <span
                              key={memberId}
                              className="px-2 py-1 bg-[#F5F7FB] text-[#3562A7] text-xs rounded-full border border-[#E5E9F0]"
                            >
                              {getPersonName(memberId)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
