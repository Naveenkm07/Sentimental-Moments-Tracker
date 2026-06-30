import { useMemo } from "react";
import { motion } from "motion/react";
import { format, parseISO } from "date-fns";
import { useApp } from "../App";
import { C, MOOD } from "../theme";
import { ScreenHeader } from "../components/ScreenHeader";

export function StatsMoodScreen() {
  const { moments } = useApp();

  const moodCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    moments.forEach(m => { counts[m.mood] = (counts[m.mood] ?? 0) + 1; });
    return counts;
  }, [moments]);

  const total = moments.length;
  const maxCount = Math.max(...Object.values(moodCounts), 1);

  // Monthly mood trend (last 6 months mock data)
  const monthlyMoods = [
    { month: 'Jan', dominant: 'grateful', count: 4 },
    { month: 'Feb', dominant: 'nostalgic', count: 2 },
    { month: 'Mar', dominant: 'peaceful', count: 5 },
    { month: 'Apr', dominant: 'bittersweet', count: 3 },
    { month: 'May', dominant: 'grateful', count: 6 },
    { month: 'Jun', dominant: 'joyful', count: 4 },
  ];

  return (
    <div style={{ background: C.bg, minHeight: '100%' }}>
      <ScreenHeader title="Mood over time" />

      <div style={{ padding: '16px 16px 40px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Donut / radial visual mock */}
        <div style={{
          background: C.card, borderRadius: 16, padding: '20px',
          border: `1px solid ${C.border}`, textAlign: 'center',
        }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: '0 0 16px' }}>Overall mood palette</p>
          <div style={{ display: 'flex', gap: 0, height: 18, borderRadius: 9, overflow: 'hidden', marginBottom: 16 }}>
            {(Object.entries(MOOD) as [string, typeof MOOD[keyof typeof MOOD]][]).map(([key, m]) => {
              const count = moodCounts[key] ?? 0;
              const pct = total > 0 ? (count / total) * 100 : 0;
              return pct > 0 ? (
                <motion.div
                  key={key}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.7 }}
                  style={{ background: m.color, height: '100%' }}
                  title={`${m.label}: ${count}`}
                />
              ) : null;
            })}
          </div>
          {/* Legend */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {(Object.entries(MOOD) as [string, typeof MOOD[keyof typeof MOOD]][]).map(([key, m]) => {
              const count = moodCounts[key] ?? 0;
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return count > 0 ? (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: m.color }} />
                  <span style={{ fontSize: 12, color: C.textSoft }}>{m.emoji} {pct}%</span>
                </div>
              ) : null;
            })}
          </div>
        </div>

        {/* Mood bars */}
        <div style={{
          background: C.card, borderRadius: 16, padding: '16px',
          border: `1px solid ${C.border}`,
        }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: '0 0 16px' }}>Count by mood</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(Object.entries(MOOD) as [string, typeof MOOD[keyof typeof MOOD]][]).map(([key, m]) => {
              const count = moodCounts[key] ?? 0;
              return (
                <div key={key}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: C.textMid }}>
                      {m.emoji} {m.label}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: m.color }}>{count}</span>
                  </div>
                  <div style={{ background: C.border, borderRadius: 6, overflow: 'hidden', height: 8 }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${maxCount > 0 ? (count / maxCount) * 100 : 0}%` }}
                      transition={{ duration: 0.6 }}
                      style={{ background: m.color, height: '100%', borderRadius: 6 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly trend */}
        <div style={{
          background: C.card, borderRadius: 16, padding: '16px',
          border: `1px solid ${C.border}`,
        }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: '0 0 4px' }}>Monthly activity</p>
          <p style={{ fontSize: 12, color: C.textSoft, margin: '0 0 16px' }}>Dominant mood each month</p>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            {monthlyMoods.map(({ month, dominant, count }) => {
              const m = MOOD[dominant as keyof typeof MOOD];
              return (
                <div key={month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(count / 6) * 60}px` }}
                    transition={{ duration: 0.5 }}
                    style={{ width: '100%', background: m.color, borderRadius: '4px 4px 0 0', minHeight: 8 }}
                  />
                  <span style={{ fontSize: 13 }}>{m.emoji}</span>
                  <span style={{ fontSize: 10, color: C.textSoft }}>{month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Insight */}
        <div style={{
          background: C.amberLight, border: `1px solid #FDEABB`,
          borderRadius: 14, padding: '14px 16px',
        }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#B8810A', margin: '0 0 6px', textTransform: 'uppercase' }}>
            💛 Pattern
          </p>
          <p style={{ fontSize: 14, color: '#7A5600', margin: 0, lineHeight: 1.6 }}>
            Your most common mood when logging is <strong>Bittersweet</strong> — which means you're capturing moments
            right at the edge of change. That's exactly what this app is for.
          </p>
        </div>
      </div>
    </div>
  );
}
