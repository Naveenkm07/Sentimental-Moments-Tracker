import { useMemo } from "react";
import { motion } from "motion/react";
import { format, parseISO, getMonth, getDate, getYear } from "date-fns";
import { useApp } from "../App";
import { C, CAT, MOOD } from "../theme";
import { ScreenHeader } from "../components/ScreenHeader";
import { EntryCard } from "../components/EntryCard";

// ── This Day Last Year ────────────────────────────────────────────────────────

export function MemoryResurfaceScreen() {
  const { moments, navigate } = useApp();

  const today = new Date();
  const todayMonth = getMonth(today);
  const todayDay = getDate(today);

  const sameDay = useMemo(() =>
    moments.filter(m => {
      const d = parseISO(m.date);
      return getMonth(d) === todayMonth && getDate(d) === todayDay && getYear(d) < getYear(today);
    }),
    [moments, todayMonth, todayDay]
  );

  const randomPrompt = moments[Math.floor(Date.now() / 86400000) % Math.max(moments.length, 1)];

  return (
    <div style={{ background: C.bg, minHeight: '100%' }}>
      <ScreenHeader title="This day in history" />

      {/* Hero date card */}
      <div style={{
        background: 'linear-gradient(160deg, #4C79FF 0%, #9B5EDB 100%)',
        padding: '24px 20px 28px', margin: '16px 16px 0',
        borderRadius: 20, textAlign: 'center',
      }}>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: '0 0 4px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Today
        </p>
        <p style={{ color: 'white', fontSize: 28, fontWeight: 800, margin: '0 0 4px' }}>
          {format(today, 'MMMM d')}
        </p>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, margin: 0 }}>
          {sameDay.length > 0 ? `${sameDay.length} memory${sameDay.length > 1 ? 'ies' : ''} from this day in other years` : 'No memories captured on this date yet'}
        </p>
      </div>

      <div style={{ padding: '16px 16px 40px' }}>
        {sameDay.length > 0 ? (
          <>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.textSoft, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 12px' }}>
              From your past
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sameDay.map(m => (
                <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <EntryCard moment={m} onClick={() => navigate('moment-detail', { id: m.id })} />
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <div>
            <div style={{ textAlign: 'center', padding: '28px 20px' }}>
              <p style={{ fontSize: 36, margin: '0 0 12px' }}>📅</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: '0 0 8px' }}>
                Nothing captured on this date — yet
              </p>
              <p style={{ fontSize: 14, color: C.textSoft, lineHeight: 1.6, margin: 0 }}>
                As you log more moments, this page will become a window into your past.
              </p>
            </div>
          </div>
        )}

        {/* Random resurface */}
        {randomPrompt && (
          <>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.textSoft, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '24px 0 12px' }}>
              A memory to revisit
            </p>
            <div style={{
              background: C.amberLight, border: `1px solid #FDEABB`,
              borderRadius: 16, padding: '16px 16px',
            }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#B8810A', margin: '0 0 8px', textTransform: 'uppercase' }}>
                💛 Resurface
              </p>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#5C3D00', margin: '0 0 4px', lineHeight: 1.4 }}>
                {randomPrompt.title}
              </p>
              <p style={{ fontSize: 13, color: '#9A6800', margin: '0 0 12px' }}>
                {format(parseISO(randomPrompt.date), 'MMMM d, yyyy')}
              </p>
              <button onClick={() => navigate('moment-detail', { id: randomPrompt.id })} style={{
                background: '#F5A623', color: 'white', border: 'none',
                borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
              }}>
                Read this memory →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Annual Summary ────────────────────────────────────────────────────────────

export function AnnualSummaryScreen() {
  const { moments, navigate } = useApp();
  const year = getYear(new Date());

  const thisYear = useMemo(() =>
    moments.filter(m => getYear(parseISO(m.date)) === year),
    [moments, year]
  );

  const catCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    thisYear.forEach(m => { counts[m.category] = (counts[m.category] ?? 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [thisYear]);

  const moodCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    thisYear.forEach(m => { counts[m.mood] = (counts[m.mood] ?? 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [thisYear]);

  const topMood = moodCounts[0] ? MOOD[moodCounts[0][0] as keyof typeof MOOD] : null;

  return (
    <div style={{ background: C.bg, minHeight: '100%' }}>
      <ScreenHeader title={`${year} in memories`} />

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(160deg, #1A0A00 0%, #6B2500 60%, #D84E3B 100%)',
        padding: '24px 20px 32px', margin: '16px 16px 0',
        borderRadius: 20, textAlign: 'center',
      }}>
        <p style={{ fontSize: 48, margin: '0 0 8px' }}>📅</p>
        <h2 style={{ color: 'white', fontSize: 28, fontWeight: 800, margin: '0 0 6px' }}>
          {year}
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, margin: 0 }}>
          {thisYear.length} memories captured
        </p>
      </div>

      <div style={{ padding: '16px 16px 40px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {thisYear.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 20px' }}>
            <p style={{ fontSize: 36, margin: '0 0 12px' }}>📝</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: '0 0 8px' }}>
              No memories logged in {year} yet
            </p>
            <button onClick={() => navigate('log')} style={{
              background: C.primary, color: 'white', border: 'none',
              borderRadius: 12, padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
              boxShadow: `0 4px 16px rgba(216,78,59,0.35)`, marginTop: 8,
            }}>
              Log your first moment of {year}
            </button>
          </div>
        ) : (
          <>
            {/* Top categories */}
            <div style={{ background: C.card, borderRadius: 16, padding: '16px', border: `1px solid ${C.border}` }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: '0 0 14px' }}>Top categories this year</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {catCounts.slice(0, 5).map(([key, n]) => {
                  const cat = CAT[key as keyof typeof CAT];
                  return (
                    <div key={key} style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      background: cat.bg, borderRadius: 20, padding: '8px 14px',
                    }}>
                      <span style={{ fontSize: 16 }}>{cat.emoji}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: cat.color }}>{n}</span>
                      <span style={{ fontSize: 12, color: cat.color + 'AA' }}>{cat.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dominant mood */}
            {topMood && (
              <div style={{
                background: topMood.bg, borderRadius: 16, padding: '20px',
                border: `1px solid ${topMood.color}30`, textAlign: 'center',
              }}>
                <p style={{ fontSize: 40, margin: '0 0 8px' }}>{topMood.emoji}</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: topMood.color, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Defining feeling of {year}
                </p>
                <p style={{ fontSize: 22, fontWeight: 800, color: C.text, margin: 0 }}>{topMood.label}</p>
              </div>
            )}

            {/* Recent moments this year */}
            <div style={{ background: C.card, borderRadius: 16, padding: '16px', border: `1px solid ${C.border}` }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: '0 0 14px' }}>Moments from {year}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {thisYear.slice(0, 4).map(m => (
                  <button key={m.id} onClick={() => navigate('moment-detail', { id: m.id })} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px',
                    background: '#F7F5F2', borderRadius: 10, border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%',
                  }}>
                    <span style={{ fontSize: 18 }}>{CAT[m.category].emoji}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 600, color: C.text, fontSize: 13, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {m.title}
                      </p>
                      <p style={{ color: C.textSoft, fontSize: 11, margin: 0 }}>
                        {format(parseISO(m.date), 'MMM d')}
                      </p>
                    </div>
                  </button>
                ))}
                {thisYear.length > 4 && (
                  <button onClick={() => navigate('timeline')} style={{
                    background: 'none', border: 'none', color: C.primary, fontSize: 13, fontWeight: 700, cursor: 'pointer', padding: '6px',
                  }}>
                    View all {thisYear.length} moments →
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
