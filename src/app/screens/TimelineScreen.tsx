import { useState, useMemo } from "react";
import { getYear, parseISO } from "date-fns";
import { motion } from "motion/react";
import { Mic, Image, ChevronDown } from "lucide-react";
import { useApp } from "../App";
import { C, CAT } from "../theme";
import type { CategoryType } from "../theme";
import { TimelineRow } from "../components/EntryCard";

const FILTERS: { label: string; value: CategoryType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Parenthood', value: 'parenthood' },
  { label: 'Family', value: 'family' },
  { label: 'Friends', value: 'friendships' },
  { label: 'Travel', value: 'travel' },
  { label: 'Self', value: 'self' },
  { label: 'Milestones', value: 'milestones' },
  { label: 'Other', value: 'other' },
];

export function TimelineScreen() {
  const { moments, navigate } = useApp();
  const [filter, setFilter] = useState<CategoryType | 'all'>('all');

  const filtered = useMemo(() =>
    filter === 'all' ? moments : moments.filter(m => m.category === filter),
    [moments, filter]
  );

  const byYear = useMemo(() => {
    const map: Record<number, typeof filtered> = {};
    filtered.forEach(m => {
      const y = getYear(parseISO(m.date));
      if (!map[y]) map[y] = [];
      map[y].push(m);
    });
    return Object.entries(map).sort(([a], [b]) => Number(b) - Number(a));
  }, [filtered]);

  const totalVoice = moments.filter(m => m.hasVoiceNote).length;
  const totalPhoto = moments.filter(m => m.hasPhoto).length;
  const totalTags = [...new Set(moments.map(m => m.category))].length;

  return (
    <div style={{ background: C.bg, minHeight: '100%' }}>
      {/* Header */}
      <div style={{ background: C.card, borderBottom: `1px solid ${C.border}`, padding: '52px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: C.text, margin: '0 0 2px' }}>Your lasts</h1>
            <p style={{ fontSize: 13, color: C.textSoft, margin: 0 }}>{moments.length} moments logged</p>
          </div>
          <button onClick={() => navigate('stats')} style={{
            background: C.primary + '15', color: C.primary,
            border: 'none', borderRadius: 10, padding: '8px 14px',
            fontSize: 13, fontWeight: 700, cursor: 'pointer', marginTop: 4,
          }}>
            View stats
          </button>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'flex', gap: 1, marginBottom: 16, background: C.border, borderRadius: 12, overflow: 'hidden' }}>
          {[
            { n: moments.length, label: 'moments\nlogged' },
            { n: totalTags, label: 'tags\ncreated' },
            { n: totalVoice, label: 'voice\nnotes' },
          ].map(({ n, label }) => (
            <div key={label} style={{
              flex: 1, background: C.card, padding: '12px 8px', textAlign: 'center',
            }}>
              <p style={{ fontSize: 22, fontWeight: 800, color: C.primary, margin: '0 0 2px' }}>{n}</p>
              <p style={{ fontSize: 11, color: C.textSoft, margin: 0, whiteSpace: 'pre-line', lineHeight: 1.3 }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Category Filter */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, scrollbarWidth: 'none' }}>
          {FILTERS.map(f => {
            const active = filter === f.value;
            const cat = f.value !== 'all' ? CAT[f.value] : null;
            return (
              <button key={f.value} onClick={() => setFilter(f.value)} style={{
                flexShrink: 0, padding: '6px 14px', borderRadius: 20,
                background: active ? (cat ? cat.bg : C.primary) : C.card,
                color: active ? (cat ? cat.color : 'white') : C.textMid,
                border: `1.5px solid ${active ? (cat ? cat.color : C.primary) : C.border}`,
                fontSize: 13, fontWeight: active ? 700 : 500, cursor: 'pointer',
                transition: 'all 0.15s',
              }}>
                {cat && <span style={{ marginRight: 4 }}>{cat.emoji}</span>}
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Timeline */}
      <div style={{ padding: '16px 16px 32px' }}>
        {byYear.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📂</div>
            <p style={{ fontSize: 16, fontWeight: 600, color: C.text, margin: '0 0 6px' }}>Nothing here yet</p>
            <p style={{ fontSize: 14, color: C.textSoft, margin: 0 }}>Log a moment in this category to see it here.</p>
          </div>
        ) : (
          byYear.map(([year, moms]) => (
            <motion.div key={year} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 20, fontWeight: 800, color: C.text }}>{year}</span>
                <div style={{ flex: 1, height: 1, background: C.border }} />
                <span style={{
                  background: '#F2EFEB', color: C.textSoft, fontSize: 12, fontWeight: 600,
                  padding: '2px 8px', borderRadius: 10,
                }}>
                  {moms.length}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {moms.map(m => (
                  <TimelineRow key={m.id} moment={m} onClick={() => navigate('moment-detail', { id: m.id })} />
                ))}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
