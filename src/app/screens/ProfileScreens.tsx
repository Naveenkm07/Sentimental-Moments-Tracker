import { useMemo } from "react";
import { getYear, parseISO, format } from "date-fns";
import { motion } from "motion/react";
import { Edit3, ChevronRight } from "lucide-react";
import { useApp } from "../App";
import { C, CAT, MOOD } from "../theme";

export function ProfileScreen() {
  const { moments, navigate } = useApp();

  const years = useMemo(() => {
    const s = new Set(moments.map(m => getYear(parseISO(m.date))));
    return [...s].sort((a, b) => b - a);
  }, [moments]);

  const favCat = useMemo(() => {
    const counts: Record<string, number> = {};
    moments.forEach(m => { counts[m.category] = (counts[m.category] ?? 0) + 1; });
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return top ? CAT[top[0] as keyof typeof CAT] : null;
  }, [moments]);

  const favMood = useMemo(() => {
    const counts: Record<string, number> = {};
    moments.forEach(m => { counts[m.mood] = (counts[m.mood] ?? 0) + 1; });
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return top ? MOOD[top[0] as keyof typeof MOOD] : null;
  }, [moments]);

  return (
    <div style={{ background: C.bg, minHeight: '100%' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(160deg, #1A0A00 0%, #6B2500 50%, #D84E3B 100%)',
        padding: '52px 20px 24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
            border: '2px solid rgba(255,255,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
          }}>
            🕰️
          </div>
          <div>
            <h2 style={{ color: 'white', fontSize: 22, fontWeight: 800, margin: '0 0 2px' }}>My Memories</h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, margin: 0 }}>
              {moments.length} moments across {years.length} {years.length === 1 ? 'year' : 'years'}
            </p>
          </div>
        </div>

        {/* Quick stats row */}
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { n: moments.length, label: 'Moments' },
            { n: moments.filter(m => m.hasVoiceNote).length, label: 'Voice notes' },
            { n: moments.filter(m => m.hasPhoto).length, label: 'Photos' },
          ].map(s => (
            <div key={s.label} style={{
              flex: 1, background: 'rgba(255,255,255,0.12)', borderRadius: 12,
              padding: '10px 8px', textAlign: 'center',
              backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)',
            }}>
              <p style={{ color: 'white', fontSize: 20, fontWeight: 800, margin: '0 0 2px' }}>{s.n}</p>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px 16px 40px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Identity cards */}
        {(favCat || favMood) && (
          <div style={{ display: 'flex', gap: 10 }}>
            {favCat && (
              <div style={{
                flex: 1, background: favCat.bg, borderRadius: 14, padding: '14px',
                border: `1px solid ${favCat.color}30`,
              }}>
                <p style={{ fontSize: 26, margin: '0 0 6px' }}>{favCat.emoji}</p>
                <p style={{ fontSize: 12, fontWeight: 700, color: favCat.color, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Most logged
                </p>
                <p style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: 0 }}>{favCat.label}</p>
              </div>
            )}
            {favMood && (
              <div style={{
                flex: 1, background: favMood.bg, borderRadius: 14, padding: '14px',
                border: `1px solid ${favMood.color}30`,
              }}>
                <p style={{ fontSize: 26, margin: '0 0 6px' }}>{favMood.emoji}</p>
                <p style={{ fontSize: 12, fontWeight: 700, color: favMood.color, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Common feeling
                </p>
                <p style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: 0 }}>{favMood.label}</p>
              </div>
            )}
          </div>
        )}

        {/* Quick access */}
        <div style={{ background: C.card, borderRadius: 16, overflow: 'hidden', border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
          {[
            { label: '🌅 This day last year', desc: 'See what you captured on this date', screen: 'memory-resurface' as const },
            { label: '📅 Annual summary', desc: 'Your year in memories', screen: 'annual-summary' as const },
            { label: '👨‍👩‍👧 Family timeline', desc: 'Shared moments with loved ones', screen: 'family-timeline' as const },
          ].map((row, i, arr) => (
            <button key={row.screen} onClick={() => navigate(row.screen)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer',
              borderBottom: i < arr.length - 1 ? `1px solid ${C.divider}` : 'none',
              textAlign: 'left',
            }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, color: C.text, fontSize: 14, margin: '0 0 2px' }}>{row.label}</p>
                <p style={{ color: C.textSoft, fontSize: 12, margin: 0 }}>{row.desc}</p>
              </div>
              <ChevronRight size={16} color={C.textSoft} />
            </button>
          ))}
        </div>

        {/* Years summary */}
        {years.length > 0 && (
          <div style={{ background: C.card, borderRadius: 16, padding: '16px', border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: '0 0 14px' }}>By year</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {years.map(year => {
                const count = moments.filter(m => getYear(parseISO(m.date)) === year).length;
                return (
                  <button key={year} onClick={() => navigate('timeline')} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: '#F7F5F2', borderRadius: 10, padding: '10px 14px',
                    border: 'none', cursor: 'pointer', width: '100%',
                  }}>
                    <span style={{ fontWeight: 700, color: C.text, fontSize: 15 }}>{year}</span>
                    <span style={{ color: C.primary, fontWeight: 700, fontSize: 14 }}>
                      {count} {count === 1 ? 'memory' : 'memories'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
