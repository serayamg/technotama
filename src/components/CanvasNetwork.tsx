'use client';

import React, { useRef, useEffect, useState } from 'react';
import { ShieldAlert, Cpu, Activity, Globe } from 'lucide-react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  glow: boolean;
}

export default function CanvasNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    threatsBlocked: 14280,
    scanningSpeed: '942.5 GB/s',
    nodesOnline: 65,
    integrity: '99.98%'
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Simulated live counters
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        threatsBlocked: prev.threatsBlocked + Math.floor(Math.random() * 3),
        integrity: (99.95 + Math.random() * 0.04).toFixed(2) + '%'
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    const nodes: Node[] = [];
    const maxNodes = 40;
    const connectionDist = 120;
    let mouse = { x: -1000, y: -1000 };

    // Initialize nodes
    for (let i = 0; i < maxNodes; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2 + 1.5,
        glow: Math.random() > 0.8
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    let sweepAngle = 0;

    // Animation Loop
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw radar sweep lines in background (clean cyber grid style)
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.beginPath();
      ctx.arc(0, 0, Math.min(width, height) * 0.45, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.05)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, Math.min(width, height) * 0.25, 0, Math.PI * 2);
      ctx.stroke();

      // Radar line
      ctx.rotate(sweepAngle);
      const gradient = ctx.createLinearGradient(0, 0, Math.min(width, height) * 0.45, 0);
      gradient.addColorStop(0, 'rgba(37, 99, 235, 0.08)');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, Math.min(width, height) * 0.45, 0, Math.PI / 4);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      sweepAngle += 0.005;

      // 2. Draw nodes and connections
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        // Move
        n.x += n.vx;
        n.y += n.vy;

        // Bounce
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        // Draw node
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = n.glow ? '#d97706' : '#2563eb'; // Gold vs Blue nodes
        ctx.fill();

        // Node Glow
        if (n.glow) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius * 3, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(217, 119, 6, 0.2)';
          ctx.fill();
        }

        // Connections to other nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n.x - n2.x;
          const dy = n.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            const alpha = (1 - dist / connectionDist) * 0.12;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = `rgba(37, 99, 235, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Animated secure packet travel along connections
            if (Math.random() > 0.996) {
              ctx.beginPath();
              ctx.arc(n.x - (n.x - n2.x) * 0.5, n.y - (n.y - n2.y) * 0.5, 2, 0, Math.PI * 2);
              ctx.fillStyle = '#06b6d4'; // Cyan packet
              ctx.fill();
            }
          }
        }

        // Connections to mouse
        const dxMouse = n.x - mouse.x;
        const dyMouse = n.y - mouse.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        if (distMouse < 150) {
          const alpha = (1 - distMouse / 150) * 0.25;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!mounted) {
    return (
      <div className="relative w-full h-[400px] lg:h-[500px] rounded-2xl border border-slate-200/80 bg-slate-50/50 shadow-xl overflow-hidden animate-pulse">
        <div className="absolute inset-0 cyber-grid opacity-30" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] lg:h-[500px] rounded-2xl border border-slate-200/80 bg-white/40 shadow-xl overflow-hidden backdrop-blur-sm">
      {/* Background patterns */}
      <div className="absolute inset-0 cyber-grid opacity-50" />
      <div className="absolute inset-0 cyber-hex" />

      {/* Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* SOC HUD overlay */}
      <div className="absolute bottom-4 left-4 right-4 grid grid-cols-2 sm:grid-cols-4 gap-3 z-10">
        <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 p-3 rounded-xl flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-red-50 text-red-500">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Serangan Dicegah</div>
            <div className="text-sm font-display font-extrabold text-slate-900">{stats.threatsBlocked.toLocaleString()}</div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 p-3 rounded-xl flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-500">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Bandwidth Analisis</div>
            <div className="text-sm font-display font-extrabold text-slate-900">{stats.scanningSpeed}</div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 p-3 rounded-xl flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-green-50 text-green-500">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Node Terkoneksi</div>
            <div className="text-sm font-display font-extrabold text-slate-900">{stats.nodesOnline} Node</div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 p-3 rounded-xl flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-500">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Integritas Jaringan</div>
            <div className="text-sm font-display font-extrabold text-slate-900">{stats.integrity}</div>
          </div>
        </div>
      </div>

      {/* Floating scanning beam overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent shadow-[0_0_10px_rgba(37,99,235,0.3)] animate-cyber-scan" />
      </div>

      {/* Map status watermark */}
      <div className="absolute top-4 left-4 pointer-events-none select-none">
        <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Live Threat Intelligence Map</div>
        <div className="flex items-center space-x-1.5 mt-0.5">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
          <div className="text-xs font-bold text-slate-600">RTI SECURE GATEWAY v3.1</div>
        </div>
      </div>
    </div>
  );
}
