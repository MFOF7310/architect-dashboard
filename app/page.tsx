'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [servers, setServers] = useState<any[]>([]);
  const [commands, setCommands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function fetchData(endpoint: string) {
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        headers: { 'x-api-key': API_KEY }
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  }

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [s, sv, c] = await Promise.all([
        fetchData('/api/stats'),
        fetchData('/api/servers'),
        fetchData('/api/commands'),
      ]);
      if (!s && !sv && !c) setError('Cannot connect to BAMAKO_223 API');
      setStats(s);
      setServers(sv || []);
      setCommands(c || []);
      setLoading(false);
    }
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0a0a0a' }}>
        <div>
          <h1 style={{ color: '#ffd700', fontSize: '2rem', textAlign: 'center' }}>🦅 ARCHITECT CG-223</h1>
          <p style={{ color: '#2ecc71', textAlign: 'center' }}>Connecting to BAMAKO_223 node...</p>
          <div style={{ width: 200, height: 4, background: '#333', margin: '20px auto', borderRadius: 2 }}>
            <div style={{ width: '60%', height: '100%', background: '#ffd700', borderRadius: 2, animation: 'pulse 1.5s infinite' }} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0a0a0a' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ color: '#e74c3c' }}>⚠️ CONNECTION LOST</h1>
          <p style={{ color: '#999' }}>{error}</p>
          <button onClick={() => window.location.reload()} style={{ marginTop: 20, padding: '10px 30px', background: '#ffd700', color: '#000', border: 'none', borderRadius: 5, cursor: 'pointer', fontWeight: 'bold' }}>
            RETRY
          </button>
        </div>
      </div>
    );
  }

  const categoryCount: Record<string, number> = {};
  commands.forEach((c: any) => {
    const cat = c.category || 'OTHER';
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: 20 }}>
      {/* HEADER */}
      <div style={{ textAlign: 'center', padding: '30px 0', borderBottom: '2px solid #ffd700', marginBottom: 30 }}>
        <h1 style={{ color: '#ffd700', fontSize: '2rem', margin: 0 }}>🦅 ARCHITECT CG-223</h1>
        <p style={{ color: '#2ecc71', margin: '5px 0' }}>📍 NODE: BAMAKO_223 🇲🇱</p>
        <p style={{ color: '#888', fontSize: '0.8rem' }}>NEURAL GRID CONTROL PANEL • v{stats?.version || '1.8.0'}</p>
      </div>

      {/* STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 15, marginBottom: 30 }}>
        <StatCard emoji="🌍" label="SERVERS" value={stats?.guilds || 0} color="#3498db" />
        <StatCard emoji="👥" label="USERS" value={stats?.users?.toLocaleString() || 0} color="#2ecc71" />
        <StatCard emoji="⚡" label="COMMANDS" value={stats?.commands || 0} color="#9b59b6" />
        <StatCard emoji="📡" label="WS PING" value={`${stats?.wsPing || 0}ms`} color="#f39c12" />
        <StatCard emoji="💾" label="HEAP" value={`${stats?.memory?.heapUsed || 0} MB`} color="#e74c3c" />
        <StatCard emoji="📊" label="DB SIZE" value={stats?.database?.size || 'N/A'} color="#1abc9c" />
      </div>

      {/* TWO COLUMN LAYOUT */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 30 }}>
        {/* SERVERS */}
        <div style={{ background: '#111', borderRadius: 10, padding: 20, border: '1px solid #333' }}>
          <h3 style={{ color: '#ffd700', margin: '0 0 15px' }}>🌍 CONNECTED SERVERS</h3>
          {servers.slice(0, 10).map((s: any, i: number) => (
            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #222', color: '#ccc', fontSize: '0.85rem' }}>
              <span>#{i + 1} {s.name.substring(0, 25)}</span>
              <span style={{ color: '#2ecc71' }}>{s.members.toLocaleString()} 👥</span>
            </div>
          ))}
          {servers.length === 0 && <p style={{ color: '#666' }}>No servers connected</p>}
        </div>

        {/* COMMANDS */}
        <div style={{ background: '#111', borderRadius: 10, padding: 20, border: '1px solid #333' }}>
          <h3 style={{ color: '#ffd700', margin: '0 0 15px' }}>⚡ COMMAND CATEGORIES</h3>
          {Object.entries(categoryCount).map(([cat, count]) => (
            <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #222', color: '#ccc', fontSize: '0.85rem' }}>
              <span>📂 {cat}</span>
              <span style={{ color: '#9b59b6' }}>{count} commands</span>
            </div>
          ))}
        </div>
      </div>

      {/* UPTIME */}
      <div style={{ background: '#111', borderRadius: 10, padding: 20, border: '1px solid #333', textAlign: 'center', marginBottom: 30 }}>
        <h3 style={{ color: '#ffd700', margin: '0 0 10px' }}>⏱️ SYSTEM UPTIME</h3>
        <p style={{ color: '#2ecc71', fontSize: '2rem', margin: 0 }}>
          {stats ? `${Math.floor(stats.uptime / 86400)}d ${Math.floor((stats.uptime % 86400) / 3600)}h ${Math.floor((stats.uptime % 3600) / 60)}m` : 'N/A'}
        </p>
        <p style={{ color: '#666', fontSize: '0.8rem', margin: '5px 0' }}>BAMAKO_223 • Real-time monitoring</p>
      </div>

      {/* FOOTER */}
      <div style={{ textAlign: 'center', padding: 20, borderTop: '1px solid #333', color: '#666', fontSize: '0.75rem' }}>
        🏗️ ARCHITECT CG-223 • Built by Moussa Fofana • 🇲🇱 Bamako, Mali
        <br />
        <span style={{ color: '#ffd700' }}>"The grid adapts. The grid survives. The grid prevails."</span>
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}

function StatCard({ emoji, label, value, color }: { emoji: string; label: string; value: string | number; color: string }) {
  return (
    <div style={{ background: '#111', borderRadius: 10, padding: 20, textAlign: 'center', border: `1px solid ${color}33` }}>
      <div style={{ fontSize: '2rem', marginBottom: 5 }}>{emoji}</div>
      <div style={{ color, fontSize: '1.5rem', fontWeight: 'bold' }}>{value}</div>
      <div style={{ color: '#888', fontSize: '0.75rem', marginTop: 5 }}>{label}</div>
    </div>
  );
}
