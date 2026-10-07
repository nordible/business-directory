'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Globe, RotateCcw, Play, Pause } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface CityNode {
  id: string;
  name: string;
  country: string;
  flag: string;
  continent: string;
  lat: number;
  lon: number;
  connections: string[]; // Connected city ids
  sectors: string[];
}

const GLOBAL_CITIES: CityNode[] = [
  {
    id: 'frankfurt',
    name: 'Frankfurt am Main',
    country: 'Germany',
    flag: '🇩🇪',
    continent: 'Europe',
    lat: 50.1109,
    lon: 8.6821,
    connections: ['london', 'newyork', 'dubai'],
    sectors: ['Software & AI', 'Finance', 'Architecture', 'Logistics'],
  },
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    flag: '🇬🇧',
    continent: 'Europe',
    lat: 51.5074,
    lon: -0.1278,
    connections: ['frankfurt', 'newyork', 'singapore'],
    sectors: ['Fintech', 'Creative Design', 'Legal & Advisory'],
  },
  {
    id: 'newyork',
    name: 'New York',
    country: 'United States',
    flag: '🇺🇸',
    continent: 'North America',
    lat: 40.7128,
    lon: -74.006,
    connections: ['london', 'frankfurt', 'saopaulo'],
    sectors: ['Enterprise Tech', 'Media', 'Global Trade'],
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    flag: '🇯🇵',
    continent: 'East Asia',
    lat: 35.6762,
    lon: 139.6503,
    connections: ['singapore', 'sydney'],
    sectors: ['Robotics', 'High-Tech', 'Gastronomy & Retail'],
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    flag: '🇦🇪',
    continent: 'Middle East',
    lat: 25.2048,
    lon: 55.2708,
    connections: ['frankfurt', 'mumbai', 'nairobi'],
    sectors: ['Commerce', 'Real Estate', 'Logistics & Tech'],
  },
  {
    id: 'singapore',
    name: 'Singapore',
    country: 'Singapore',
    flag: '🇸🇬',
    continent: 'Southeast Asia',
    lat: 1.3521,
    lon: 103.8198,
    connections: ['london', 'tokyo', 'mumbai', 'sydney'],
    sectors: ['Deep Tech', 'Global Supply Chain', 'Cross-Border Finance'],
  },
  {
    id: 'nairobi',
    name: 'Nairobi',
    country: 'Kenya',
    flag: '🇰🇪',
    continent: 'Africa',
    lat: -1.2921,
    lon: 36.8219,
    connections: ['dubai', 'frankfurt'],
    sectors: ['Agri-Tech', 'Fintech', 'Renewable Energy', 'Trade'],
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    country: 'India',
    flag: '🇮🇳',
    continent: 'South Asia',
    lat: 19.076,
    lon: 72.8777,
    connections: ['dubai', 'singapore'],
    sectors: ['Architecture & Turnkey Design', 'Software', 'Manufacturing'],
  },
  {
    id: 'saopaulo',
    name: 'São Paulo',
    country: 'Brazil',
    flag: '🇧🇷',
    continent: 'South America',
    lat: -23.5505,
    lon: -46.6333,
    connections: ['newyork', 'london'],
    sectors: ['Fintech', 'Agribusiness', 'Industry & Retail'],
  },
  {
    id: 'sydney',
    name: 'Sydney',
    country: 'Australia',
    flag: '🇦🇺',
    continent: 'Oceania',
    lat: -33.8688,
    lon: 151.2093,
    connections: ['singapore', 'tokyo'],
    sectors: ['SaaS', 'Clean Energy', 'Healthcare & Biotech'],
  },
];

export function InteractiveGlobe() {
  const { t } = useTranslation();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<string>('frankfurt');
  const [isAutoSpinning, setIsAutoSpinning] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Rotation angles (radians)
  const rotRef = useRef({ x: 0.35, y: -0.2 });
  const targetRotRef = useRef({ x: 0.35, y: -0.2 });
  const dragStartRef = useRef({ x: 0, y: 0, rotX: 0.35, rotY: -0.2 });
  const pulsePhaseRef = useRef(0);

  const selectedCity = GLOBAL_CITIES.find((c) => c.id === selectedCityId) || GLOBAL_CITIES[0];

  // Rotate to focus on a city smoothly
  const focusCity = useCallback((city: CityNode) => {
    setSelectedCityId(city.id);
    const targetY = -((city.lon * Math.PI) / 180);
    const targetX = Math.max(-0.6, Math.min(0.6, (city.lat * Math.PI) / 180));
    targetRotRef.current = { x: targetX, y: targetY };
    setIsAutoSpinning(false);
  }, []);

  const resetView = () => {
    targetRotRef.current = { x: 0.35, y: -0.2 };
    setSelectedCityId('frankfurt');
    setIsAutoSpinning(true);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      pulsePhaseRef.current += 0.035;

      // Smooth interpolation toward target rotation when programmatic
      if (!isDragging) {
        if (isAutoSpinning) {
          rotRef.current.y += 0.0035;
          targetRotRef.current.y = rotRef.current.y;
        } else {
          rotRef.current.x += (targetRotRef.current.x - rotRef.current.x) * 0.08;
          rotRef.current.y += (targetRotRef.current.y - rotRef.current.y) * 0.08;
        }
      }

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const R = Math.min(width, height) * 0.42;

      const rotX = rotRef.current.x;
      const rotY = rotRef.current.y;

      // Project spherical 3D point (lat, lon in degrees) to screen (x, y, z)
      const project = (latDeg: number, lonDeg: number, altitude = 1) => {
        const phi = (latDeg * Math.PI) / 180;
        const theta = (lonDeg * Math.PI) / 180;

        const x = Math.cos(phi) * Math.sin(theta + rotY);
        const y = Math.sin(phi);
        const z = Math.cos(phi) * Math.cos(theta + rotY);

        const y2 = y * Math.cos(rotX) - z * Math.sin(rotX);
        const z2 = y * Math.sin(rotX) + z * Math.cos(rotX);

        return {
          sx: cx + x * R * altitude,
          sy: cy - y2 * R * altitude,
          sz: z2,
          visible: z2 > -0.05,
        };
      };

      // 1. Globe Ambient Shadow & Background Circle
      const bgGrad = ctx.createRadialGradient(cx - R * 0.25, cy - R * 0.25, R * 0.1, cx, cy, R);
      bgGrad.addColorStop(0, '#102A6B');
      bgGrad.addColorStop(0.7, '#08173E');
      bgGrad.addColorStop(1, '#040B1E');

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = bgGrad;
      ctx.shadowColor = 'rgba(20, 91, 255, 0.35)';
      ctx.shadowBlur = 35;
      ctx.fill();
      ctx.restore();

      // Clip subsequent globe features inside the sphere
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.clip();

      // 2. Latitude parallels (Grid lines)
      ctx.lineWidth = 1;
      const latSteps = [-60, -40, -20, 0, 20, 40, 60];
      latSteps.forEach((lat) => {
        ctx.beginPath();
        let first = true;
        for (let lon = -180; lon <= 180; lon += 5) {
          const pt = project(lat, lon);
          if (pt.visible) {
            if (first) {
              ctx.moveTo(pt.sx, pt.sy);
              first = false;
            } else {
              ctx.lineTo(pt.sx, pt.sy);
            }
          } else {
            first = true;
          }
        }
        ctx.strokeStyle = lat === 0 ? 'rgba(56, 189, 248, 0.35)' : 'rgba(56, 189, 248, 0.12)';
        ctx.stroke();
      });

      // 3. Longitude meridians
      for (let lon = -180; lon < 180; lon += 30) {
        ctx.beginPath();
        let first = true;
        for (let lat = -80; lat <= 80; lat += 4) {
          const pt = project(lat, lon);
          if (pt.visible) {
            if (first) {
              ctx.moveTo(pt.sx, pt.sy);
              first = false;
            } else {
              ctx.lineTo(pt.sx, pt.sy);
            }
          } else {
            first = true;
          }
        }
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
        ctx.stroke();
      }

      // 4. Draw Intercontinental Connection Arcs
      const drawnPairs = new Set<string>();
      GLOBAL_CITIES.forEach((cityA) => {
        cityA.connections.forEach((connId) => {
          const cityB = GLOBAL_CITIES.find((c) => c.id === connId);
          if (!cityB) return;

          const pairKey = [cityA.id, cityB.id].sort().join('--');
          if (drawnPairs.has(pairKey)) return;
          drawnPairs.add(pairKey);

          const isConnectedToSelected = cityA.id === selectedCityId || cityB.id === selectedCityId;
          const arcPoints: { sx: number; sy: number; sz: number; visible: boolean }[] = [];
          const segments = 28;

          for (let step = 0; step <= segments; step++) {
            const t = step / segments;
            const lat = cityA.lat + (cityB.lat - cityA.lat) * t;
            const lon = cityA.lon + (cityB.lon - cityA.lon) * t;
            // Elevation arch above sphere: highest at midpoint
            const elevation = 1 + 0.12 * Math.sin(t * Math.PI);
            arcPoints.push(project(lat, lon, elevation));
          }

          // Draw the arc
          ctx.beginPath();
          let started = false;
          arcPoints.forEach((p) => {
            if (p.visible) {
              if (!started) {
                ctx.moveTo(p.sx, p.sy);
                started = true;
              } else {
                ctx.lineTo(p.sx, p.sy);
              }
            } else {
              started = false;
            }
          });

          ctx.lineWidth = isConnectedToSelected ? 2.4 : 1.2;
          ctx.strokeStyle = isConnectedToSelected
            ? 'rgba(255, 159, 26, 0.85)'
            : 'rgba(56, 189, 248, 0.45)';
          ctx.stroke();

          // Animated traveling pulse photon along the arc
          const pulseT = ((pulsePhaseRef.current * 0.4 + (cityA.lat * 0.05)) % 1 + 1) % 1;
          const photonIndex = Math.min(segments, Math.floor(pulseT * segments));
          const photonPoint = arcPoints[photonIndex];
          if (photonPoint && photonPoint.visible) {
            ctx.beginPath();
            ctx.arc(photonPoint.sx, photonPoint.sy, isConnectedToSelected ? 3.5 : 2.5, 0, Math.PI * 2);
            ctx.fillStyle = isConnectedToSelected ? '#FFD166' : '#60A5FA';
            ctx.shadowColor = isConnectedToSelected ? '#FF9F1A' : '#3B82F6';
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        });
      });

      // 5. Draw City Nodes & Concentric Radar Rings
      GLOBAL_CITIES.forEach((city) => {
        const pt = project(city.lat, city.lon, 1);
        if (!pt.visible) return;

        const isSelected = city.id === selectedCityId;
        const baseRadius = isSelected ? 5.5 : 3.5;

        // Concentric radar ripple for selected city
        if (isSelected) {
          const rippleRadius = baseRadius + (Math.sin(pulsePhaseRef.current * 3) + 1) * 6;
          ctx.beginPath();
          ctx.arc(pt.sx, pt.sy, rippleRadius, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 159, 26, 0.55)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Inner glowing core dot
        ctx.beginPath();
        ctx.arc(pt.sx, pt.sy, baseRadius, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? '#FF9F1A' : '#38BDF8';
        ctx.shadowColor = isSelected ? '#FF9F1A' : '#38BDF8';
        ctx.shadowBlur = isSelected ? 14 : 7;
        ctx.fill();
        ctx.shadowBlur = 0;

        // City Name Tag if clearly facing front
        if (pt.sz > 0.18) {
          ctx.font = isSelected ? 'bold 11px system-ui, sans-serif' : '9px system-ui, sans-serif';
          ctx.fillStyle = isSelected ? '#FFFFFF' : 'rgba(226, 232, 240, 0.85)';
          ctx.fillText(city.name, pt.sx + 8, pt.sy + 3);
        }
      });

      ctx.restore(); // Restore globe clip

      // Globe Outer Glow Ring
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isAutoSpinning, isDragging, selectedCityId]);

  // Touch and Mouse Drag handlers for high-ergonomics 3D rotation
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setIsAutoSpinning(false);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      rotX: rotRef.current.x,
      rotY: rotRef.current.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    rotRef.current.y = dragStartRef.current.rotY + deltaX * 0.007;
    rotRef.current.x = Math.max(
      -0.85,
      Math.min(0.85, dragStartRef.current.rotX - deltaY * 0.007)
    );
    targetRotRef.current = { ...rotRef.current };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-[#0A183D] text-white relative overflow-hidden border-b border-[#1E3A8A]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-400/30 px-3.5 py-1 text-xs font-bold text-sky-300 mb-3 shadow-xs">
            <Globe className="w-3.5 h-3.5 text-sky-400 animate-spin-slow" />
            <span>{t('globe.badge')}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white font-heading tracking-tight leading-tight">
            {t('globe.title')}
          </h2>

          <p className="text-xs sm:text-base text-slate-300 mt-3 font-medium leading-relaxed max-w-2xl mx-auto">
            {t('globe.subtitle')}
          </p>
        </div>

        {/* 3D Globe & Interactive City Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Canvas Interactive Globe Container */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={500}
                height={500}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className="w-full h-full cursor-grab active:cursor-grabbing touch-none select-none drop-shadow-2xl"
                aria-label="Interactive 3D Globe showing global business connections"
              />

              {/* Interactive Help Hint */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[11px] text-sky-200 pointer-events-none whitespace-nowrap">
                {t('globe.dragHint')}
              </div>
            </div>

            {/* Quick Controls Bar */}
            <div className="flex items-center gap-2 mt-4">
              <button
                type="button"
                onClick={() => setIsAutoSpinning(!isAutoSpinning)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white transition-all cursor-pointer"
                title={isAutoSpinning ? t('globe.pause') : t('globe.rotate')}
              >
                {isAutoSpinning ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-sky-400" />
                    <span>{t('globe.pause')}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t('globe.rotate')}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={resetView}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white transition-all cursor-pointer"
                title={t('globe.reset')}
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('globe.reset')}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Selected City Hub Card & Global City Quick-Pills */}
          <div className="lg:col-span-5 space-y-5">
            {/* Active Hub Card */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{selectedCity.flag}</span>
                  <div>
                    <h3 className="font-heading font-black text-xl text-white">
                      {selectedCity.name}
                    </h3>
                    <span className="text-xs text-sky-300 font-semibold">
                      {selectedCity.country} • {selectedCity.continent}
                    </span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[11px] font-extrabold text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{t('globe.liveHub')}</span>
                </div>
              </div>

              {/* Verified Sectors */}
              <div className="space-y-2 mt-4">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  {t('globe.sectorsTitle')}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCity.sectors.map((sec, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 text-xs font-semibold text-slate-200"
                    >
                      {sec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Connected Intercontinental Hubs */}
              <div className="space-y-2 mt-5 pt-4 border-t border-white/10">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  {t('globe.linksTitle')}
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedCity.connections.map((connId) => {
                    const c = GLOBAL_CITIES.find((item) => item.id === connId);
                    if (!c) return null;
                    return (
                      <button
                        key={connId}
                        type="button"
                        onClick={() => focusCity(c)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/30 text-xs font-bold text-sky-200 transition-colors cursor-pointer"
                      >
                        <span>{c.flag}</span>
                        <span>{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Hub Navigation Pills */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                {t('globe.exploreHubs')}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {GLOBAL_CITIES.map((city) => {
                  const isActive = city.id === selectedCityId;
                  return (
                    <button
                      key={city.id}
                      type="button"
                      onClick={() => focusCity(city)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-[#FF9F1A] text-slate-950 shadow-md font-extrabold scale-105'
                          : 'bg-white/10 hover:bg-white/20 text-slate-300 border border-white/10'
                      }`}
                    >
                      <span>{city.flag}</span>
                      <span>{city.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
