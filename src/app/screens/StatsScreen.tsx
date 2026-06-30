import { useMemo } from "react";
import { motion } from "motion/react";
import { BarChart2, TrendingUp, ChevronRight } from "lucide-react";
import { getYear, parseISO, format } from "date-fns";
import { useApp } from "../App";
import { C, CAT, MOOD } from "../theme";

export function StatsScreen() {
  const { moments, navigate } = useApp();

  const catCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    moments.forEach(m => { counts[m.category] = (counts[m.category] ?? 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [moments]);

  const moodCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    moments.forEach(m => { counts[m.mood] = (counts[m.mood] ?? 0) + 1; });
    return counts;
  }, [moments]);

  const byYear = useMemo(() => {
    const counts: Record<number, number> = {};
    moments.forEach(m => { const y = getYear(parseISO(m.date)); counts[y] = (counts[y] ?? 0) + 1; });
    return Object.entries(counts).sort(([a], [b]) => Number(a) - Number(b));
  }, [moments]);

  const maxYear = Math.max(...byYear.map(([, n]) => n), 1);
  const maxCat = Math.max(...catCounts.map(([, n]) => n), 1);

  const streak = 7; // mock streak

  return (
    <div style={{ background: C.bg, minHeight: '100%' }}>
      {/* Header */}
      <div style={{ background: C.card, borderBottom: `1px solid ${C.border}`, padding: '52px 20px 16px' }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: C.text, margin: '0 0 2px' }}>Your stats</h1>
        <p style={{ fontSize: 13, color: C.textSoft, margin: 0 }}>A reflection of what you've captured</p>
      </div>

      <div style={{ padding: '16px 16px 40px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Hero stats */}
        <div style={{ display: 'flex', gap: 10 }}>
          <StatCard n={moments.length} label="Moments logged" color={C.primary} emoji="📝" />
          <StatCard n={streak} label="Day streak" color={C.green} emoji="🔥" />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <StatCard n={moments.filter(m => m.hasVoiceNote).length} label="Voice notes" color={C.purple} emoji="🎙️" />
          <StatCard n={moments.filter(m => m.hasPhoto).length} label="Photos" color={C.blue} emoji="📸" />
        </div>

        {/* Yearly activity */}
        <SectionCard title="Moments per year" action={{ label: 'See mood chart →', onPress: () => navigate('stats-mood') }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 80, padding: '4px 0' }}>
            {byYear.map(([year, count]) => (
              <motion.div
                key={year}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: `${(count / maxYear) * 76}px`, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                style={{ flex: 1, minWidth: 0 }}
              >
                <div style={{
                  flex: 1, background: C.primary + 'CC', borderRadius: '4px 4px 0 0',
                  width: '100%', height: '100%',
                }} />
                <p style={{ fontSize: 10, color: C.textSoft, textAlign: 'center', marginTop: 4 }}>
                  {String(year).slice(2)}
                </p>
              </motion.div>
            ))}
          </div>
        </SectionCard>

        {/* Categories breakdown */}
        <SectionCard title="By category">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {catCounts.map(([key, count]) => {
              const cat = CAT[key as keyof typeof CAT];
              return (
                <div key={key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.textMid }}>
                      {cat.emoji} {cat.label}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: cat.color }}>{count}</span>
                  </div>
                  <div style={{ background: C.border, borderRadius: 4, overflow: 'hidden', height: 6 }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / maxCat) * 100}%` }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      style={{ background: cat.color, height: '100%', borderRadius: 4 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* Mood breakdown */}
        <SectionCard title="Mood breakdown" action={{ label: 'Full mood chart →', onPress: () => navigate('stats-mood') }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {(Object.entries(MOOD) as [string, typeof MOOD[keyof typeof MOOD]][]).map(([key, m]) => {
              const count = moodCounts[key] ?? 0;
              return (
                <div key={key} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: m.bg, borderRadius: 20, padding: '6px 12px',
                }}>
                  <span style={{ fontSize: 14 }}>{m.emoji}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: m.color }}>{count}</span>
                  <span style={{ fontSize: 12, color: m.color + 'AA' }}>{m.label}</span>
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* Insight */}
        <div style={{
          background: 'linear-gradient(135deg, #1A0A00, #6B2500)',
          borderRadius: 16, padding: '18px 18px',
        }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            ✨ Insight
          </p>
          <p style={{ fontSize: 15, color: 'white', margin: '0 0 6px', fontWeight: 700, lineHeight: 1.4 }}>
            You log most in "{catCounts[0] ? CAT[catCounts[0][0] as keyof typeof CAT]?.label : 'Family'}"
          </p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.5 }}>
            The things we record most are often the things we care about deepest.
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ n, label, color, emoji }: { n: number; label: string; color: string; emoji: string }) {
  return (
    <div style={{
      flex: 1, background: C.card, borderRadius: 14, padding: '14px 14px',
      border: `1px solid ${C.border}`, boxShadow: C.shadow,
    }}>
      <p style={{ fontSize: 28, margin: '0 0 4px' }}>{emoji}</p>
      <p style={{ fontSize: 26, fontWeight: 800, color, margin: '0 0 2px' }}>{n}</p>
      <p style={{ fontSize: 12, color: C.textSoft, margin: 0 }}>{label}</p>
    </div>
  );
}

function SectionCard({ title, children, action }: { title: string; children: React.ReactNode; action?: { label: string; onPress: () => void } }) {
  return (
    <div style={{
      background: C.card, borderRadius: 16, padding: '16px 16px',
      border: `1px solid ${C.border}`, boxShadow: C.shadow,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: 0 }}>{title}</p>
        {action && (
          <button onClick={action.onPress} style={{ background: 'none', border: 'none', color: C.primary, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            {action.label}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
