'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface CityNode {
  id: string;
  name: string;
  country: string;
  flag: string;
  lat: number;
  lon: number;
  connections: string[]; // Connected city ids
  isCenter?: boolean;
}

const GLOBAL_CITIES: CityNode[] = [
  // THE HEART / CENTERPIECE
  {
    id: 'frankfurt',
    name: 'Frankfurt am Main',
    country: 'Deutschland',
    flag: '🇩🇪',
    lat: 50.1109,
    lon: 8.6821,
    isCenter: true,
    connections: [
      'london', 'paris', 'zurich', 'amsterdam', 'berlin', 'milan', 'madrid', 'stockholm',
      'newyork', 'sanfrancisco', 'chicago', 'toronto',
      'saopaulo', 'buenosaires',
      'dubai', 'riyadh', 'telaviv',
      'tokyo', 'singapore', 'hongkong', 'shanghai', 'seoul', 'mumbai',
      'sydney', 'nairobi', 'johannesburg'
    ],
  },
  // EUROPEAN COMMERCIAL HUBS
  {
    id: 'zurich',
    name: 'Zürich',
    country: 'Schweiz',
    flag: '🇨🇭',
    lat: 47.3769,
    lon: 8.5417,
    connections: ['frankfurt', 'milan', 'london'],
  },
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    flag: '🇬🇧',
    lat: 51.5074,
    lon: -0.1278,
    connections: ['frankfurt', 'newyork', 'paris', 'singapore'],
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    flag: '🇫🇷',
    lat: 48.8566,
    lon: 2.3522,
    connections: ['frankfurt', 'london', 'milan'],
  },
  {
    id: 'amsterdam',
    name: 'Amsterdam',
    country: 'Netherlands',
    flag: '🇳🇱',
    lat: 52.3676,
    lon: 4.9041,
    connections: ['frankfurt', 'london', 'berlin'],
  },
  {
    id: 'berlin',
    name: 'Berlin',
    country: 'Deutschland',
    flag: '🇩🇪',
    lat: 52.52,
    lon: 13.405,
    connections: ['frankfurt', 'amsterdam', 'stockholm'],
  },
  {
    id: 'milan',
    name: 'Milano',
    country: 'Italia',
    flag: '🇮🇹',
    lat: 45.4642,
    lon: 9.19,
    connections: ['frankfurt', 'zurich', 'madrid'],
  },
  {
    id: 'madrid',
    name: 'Madrid',
    country: 'España',
    flag: '🇪🇸',
    lat: 40.4168,
    lon: -3.7038,
    connections: ['frankfurt', 'milan', 'saopaulo'],
  },
  {
    id: 'stockholm',
    name: 'Stockholm',
    country: 'Sverige',
    flag: '🇸🇪',
    lat: 59.3293,
    lon: 18.0686,
    connections: ['frankfurt', 'berlin'],
  },
  // NORTH AMERICA
  {
    id: 'newyork',
    name: 'New York',
    country: 'United States',
    flag: '🇺🇸',
    lat: 40.7128,
    lon: -74.006,
    connections: ['frankfurt', 'london', 'sanfrancisco', 'toronto'],
  },
  {
    id: 'sanfrancisco',
    name: 'Silicon Valley',
    country: 'United States',
    flag: '🇺🇸',
    lat: 37.7749,
    lon: -122.4194,
    connections: ['frankfurt', 'newyork', 'tokyo'],
  },
  {
    id: 'chicago',
    name: 'Chicago',
    country: 'United States',
    flag: '🇺🇸',
    lat: 41.8781,
    lon: -87.6298,
    connections: ['frankfurt', 'newyork'],
  },
  {
    id: 'toronto',
    name: 'Toronto',
    country: 'Canada',
    flag: '🇨🇦',
    lat: 43.6532,
    lon: -79.3832,
    connections: ['frankfurt', 'newyork'],
  },
  // SOUTH AMERICA
  {
    id: 'saopaulo',
    name: 'São Paulo',
    country: 'Brasil',
    flag: '🇧🇷',
    lat: -23.5505,
    lon: -46.6333,
    connections: ['frankfurt', 'buenosaires', 'newyork'],
  },
  {
    id: 'buenosaires',
    name: 'Buenos Aires',
    country: 'Argentina',
    flag: '🇦🇷',
    lat: -34.6037,
    lon: -58.3816,
    connections: ['frankfurt', 'saopaulo'],
  },
  // MIDDLE EAST
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    flag: '🇦🇪',
    lat: 25.2048,
    lon: 55.2708,
    connections: ['frankfurt', 'riyadh', 'mumbai', 'singapore'],
  },
  {
    id: 'riyadh',
    name: 'Riyadh',
    country: 'Saudi Arabia',
    flag: '🇸🇦',
    lat: 24.7136,
    lon: 46.6753,
    connections: ['frankfurt', 'dubai'],
  },
  {
    id: 'telaviv',
    name: 'Tel Aviv',
    country: 'Israel',
    flag: '🇮🇱',
    lat: 32.0853,
    lon: 34.7818,
    connections: ['frankfurt', 'london'],
  },
  // ASIA & PACIFIC
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    flag: '🇯🇵',
    lat: 35.6762,
    lon: 139.6503,
    connections: ['frankfurt', 'sanfrancisco', 'seoul', 'singapore'],
  },
  {
    id: 'seoul',
    name: 'Seoul',
    country: 'South Korea',
    flag: '🇰🇷',
    lat: 37.5665,
    lon: 126.978,
    connections: ['frankfurt', 'tokyo', 'shanghai'],
  },
  {
    id: 'shanghai',
    name: 'Shanghai',
    country: 'China',
    flag: '🇨🇳',
    lat: 31.2304,
    lon: 121.4737,
    connections: ['frankfurt', 'hongkong', 'tokyo'],
  },
  {
    id: 'hongkong',
    name: 'Hong Kong',
    country: 'Hong Kong',
    flag: '🇭🇰',
    lat: 22.3193,
    lon: 114.1694,
    connections: ['frankfurt', 'singapore', 'shanghai'],
  },
  {
    id: 'singapore',
    name: 'Singapore',
    country: 'Singapore',
    flag: '🇸🇬',
    lat: 1.3521,
    lon: 103.8198,
    connections: ['frankfurt', 'sydney', 'mumbai', 'tokyo'],
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    country: 'India',
    flag: '🇮🇳',
    lat: 19.076,
    lon: 72.8777,
    connections: ['frankfurt', 'dubai', 'singapore'],
  },
  {
    id: 'sydney',
    name: 'Sydney',
    country: 'Australia',
    flag: '🇦🇺',
    lat: -33.8688,
    lon: 151.2093,
    connections: ['frankfurt', 'singapore'],
  },
  // AFRICA
  {
    id: 'nairobi',
    name: 'Nairobi',
    country: 'Kenya',
    flag: '🇰🇪',
    lat: -1.2921,
    lon: 36.8219,
    connections: ['frankfurt', 'dubai'],
  },
  {
    id: 'johannesburg',
    name: 'Johannesburg',
    country: 'South Africa',
    flag: '🇿🇦',
    lat: -26.2041,
    lon: 28.0473,
    connections: ['frankfurt', 'nairobi', 'london'],
  },
];

export function InteractiveGlobe() {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Rotation angles (radians) — initialized to highlight Frankfurt facing forward
  const rotRef = useRef({ x: 0.42, y: -0.15 });
  const dragStartRef = useRef({ x: 0, y: 0, rotX: 0.42, rotY: -0.15 });
  const pulsePhaseRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      pulsePhaseRef.current += 0.035;

      // Auto-rotation when not manually dragging
      if (!isDragging) {
        rotRef.current.y += 0.0028;
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
      ctx.shadowColor = 'rgba(20, 91, 255, 0.45)';
      ctx.shadowBlur = 40;
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
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
        ctx.stroke();
      });

      // 3. Longitude meridians
      const lonSteps = [-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150, 180];
      lonSteps.forEach((lon) => {
        ctx.beginPath();
        let first = true;
        for (let lat = -80; lat <= 80; lat += 5) {
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
      });

      // 4. Draw Interconnecting 3D Arcs
      const drawnConnections = new Set<string>();

      GLOBAL_CITIES.forEach((cityA) => {
        cityA.connections.forEach((targetId) => {
          const cityB = GLOBAL_CITIES.find((c) => c.id === targetId);
          if (!cityB) return;

          const pairKey = [cityA.id, cityB.id].sort().join('--');
          if (drawnConnections.has(pairKey)) return;
          drawnConnections.add(pairKey);

          const isConnectedToFrankfurt = cityA.id === 'frankfurt' || cityB.id === 'frankfurt';

          // Sample points along great circle arc
          const segments = 32;
          const arcPoints: { sx: number; sy: number; sz: number; visible: boolean }[] = [];

          for (let s = 0; s <= segments; s++) {
            const t = s / segments;
            const lat = cityA.lat + (cityB.lat - cityA.lat) * t;

            // Handle shortest longitude interpolation across dateline
            let diffLon = cityB.lon - cityA.lon;
            if (diffLon > 180) diffLon -= 360;
            if (diffLon < -180) diffLon += 360;
            const lon = cityA.lon + diffLon * t;

            // Elevation arch above sphere: highest at midpoint
            const elevation = 1 + (isConnectedToFrankfurt ? 0.14 : 0.08) * Math.sin(t * Math.PI);
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

          ctx.lineWidth = isConnectedToFrankfurt ? 2.2 : 1.1;
          ctx.strokeStyle = isConnectedToFrankfurt
            ? 'rgba(255, 159, 26, 0.75)'
            : 'rgba(56, 189, 248, 0.3)';
          ctx.stroke();

          // Animated traveling pulse photon along the arc
          const pulseSpeed = isConnectedToFrankfurt ? 0.35 : 0.25;
          const pulseT = ((pulsePhaseRef.current * pulseSpeed + (cityA.lat * 0.04)) % 1 + 1) % 1;
          const photonIndex = Math.min(segments, Math.floor(pulseT * segments));
          const photonPoint = arcPoints[photonIndex];
          if (photonPoint && photonPoint.visible) {
            ctx.beginPath();
            ctx.arc(
              photonPoint.sx,
              photonPoint.sy,
              isConnectedToFrankfurt ? 3.5 : 2.2,
              0,
              Math.PI * 2
            );
            ctx.fillStyle = isConnectedToFrankfurt ? '#FFD166' : '#60A5FA';
            ctx.shadowColor = isConnectedToFrankfurt ? '#FF9F1A' : '#3B82F6';
            ctx.shadowBlur = isConnectedToFrankfurt ? 10 : 5;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        });
      });

      // 5. Draw City Nodes & Frankfurt Pulsing Beacons
      GLOBAL_CITIES.forEach((city) => {
        const pt = project(city.lat, city.lon, 1);
        if (!pt.visible) return;

        const isFrankfurt = city.id === 'frankfurt';
        const baseRadius = isFrankfurt ? 6.5 : 3.2;

        // Multi-tier Concentric radar ripples for Frankfurt (the heart of the network)
        if (isFrankfurt) {
          const ripple1 = baseRadius + ((pulsePhaseRef.current * 1.8) % 1) * 16;
          const ripple2 = baseRadius + (((pulsePhaseRef.current * 1.8) + 0.5) % 1) * 16;

          ctx.beginPath();
          ctx.arc(pt.sx, pt.sy, ripple1, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 159, 26, ${Math.max(0, 0.6 - (ripple1 / 22))})`;
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(pt.sx, pt.sy, ripple2, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 159, 26, ${Math.max(0, 0.6 - (ripple2 / 22))})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Inner glowing core dot
        ctx.beginPath();
        ctx.arc(pt.sx, pt.sy, baseRadius, 0, Math.PI * 2);
        ctx.fillStyle = isFrankfurt ? '#FF9F1A' : '#38BDF8';
        ctx.shadowColor = isFrankfurt ? '#FF9F1A' : '#38BDF8';
        ctx.shadowBlur = isFrankfurt ? 16 : 6;
        ctx.fill();
        ctx.shadowBlur = 0;

        // City Name Tag if clearly facing front
        if (pt.sz > (isFrankfurt ? 0.05 : 0.22)) {
          ctx.font = isFrankfurt
            ? 'bold 12px system-ui, -apple-system, sans-serif'
            : '10px system-ui, -apple-system, sans-serif';
          ctx.fillStyle = isFrankfurt ? '#FFD166' : 'rgba(226, 232, 240, 0.85)';
          const label = isFrankfurt ? `★ ${city.name} (Hub)` : city.name;
          ctx.fillText(label, pt.sx + (isFrankfurt ? 10 : 7), pt.sy + 3.5);
        }
      });

      ctx.restore(); // Restore globe clip

      // Globe Outer Atmosphere Glow Ring
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
  }, [isDragging]);

  // Touch and Mouse Drag handlers for 3D rotation
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
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
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
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

        {/* 3D Global Nexus Canvas (Centered, continuous, distraction-free) */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[520px] aspect-square flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={600}
              height={600}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="w-full h-full cursor-grab active:cursor-grabbing touch-none select-none drop-shadow-[0_20px_50px_rgba(20,91,255,0.35)]"
              aria-label="Interactive 3D Globe showing Frankfurt connected across the world"
            />
          </div>

          {/* Key Metric / Status Strip under Globe */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#FF9F1A] animate-ping" />
              <span className="text-white font-bold">Made in Frankfurt am Main</span>
              <span className="text-slate-400">• Digital- & Finanzzentrum</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>25+ Global Hubs vernetzt</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span>100% Inhaber-Verifiziert</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
