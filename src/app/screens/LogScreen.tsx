import { useState } from "react";
import { Camera, Mic, X, ChevronDown } from "lucide-react";
import { useApp } from "../App";
import { C, CAT, MOOD } from "../theme";
import type { CategoryType, MoodType } from "../theme";
import { ScreenHeader } from "../components/ScreenHeader";

export function LogScreen() {
  const { addMoment, navigate } = useApp();
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<CategoryType>('family');
  const [mood, setMood] = useState<MoodType>('nostalgic');
  const [showCats, setShowCats] = useState(false);

  const canSave = title.trim().length >= 3;

  const handleSave = () => {
    if (!canSave) return;
    addMoment({ title: title.trim(), detail: detail.trim() || undefined, date, category, mood });
    navigate('log-success');
  };

  return (
    <div style={{ background: C.bg, minHeight: '100%' }}>
      <ScreenHeader title="New memory" right={
        <button onClick={handleSave} disabled={!canSave} style={{
          background: canSave ? C.primary : C.border, color: canSave ? 'white' : C.textSoft,
          border: 'none', borderRadius: 10, padding: '8px 16px',
          fontSize: 14, fontWeight: 700, cursor: canSave ? 'pointer' : 'not-allowed',
        }}>
          Save
        </button>
      } />

      <div style={{ padding: '16px 16px 120px' }}>
        {/* Photo/Voice Area */}
        <div style={{
          background: C.card, border: `2px dashed ${C.border}`,
          borderRadius: 16, padding: '24px', marginBottom: 16,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        }}>
          <div style={{ display: 'flex', gap: 20 }}>
            <button style={mediaBtn} onClick={() => navigate('log-voice')}>
              <div style={{ ...mediaBtnIcon, background: '#FFF0EE' }}><Camera size={22} color={C.primary} /></div>
              <span style={{ fontSize: 12, color: C.textSoft, fontWeight: 500 }}>Add photo</span>
            </button>
            <button style={mediaBtn} onClick={() => navigate('log-voice')}>
              <div style={{ ...mediaBtnIcon, background: '#FFF0EE' }}><Mic size={22} color={C.primary} /></div>
              <span style={{ fontSize: 12, color: C.textSoft, fontWeight: 500 }}>Add voice note</span>
            </button>
          </div>
        </div>

        {/* Title */}
        <FormLabel>The last time I...</FormLabel>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="carried Mia to bed without her asking"
          style={{
            width: '100%', boxSizing: 'border-box',
            background: C.card, border: `1.5px solid ${title ? C.primary : C.border}`,
            borderRadius: 12, padding: '13px 14px',
            fontSize: 15, fontWeight: 600, color: C.text, outline: 'none',
            marginBottom: 14, transition: 'border 0.15s',
          }}
        />

        {/* Detail */}
        <FormLabel>A little more... <span style={{ fontWeight: 400, color: C.textSoft }}>(optional)</span></FormLabel>
        <textarea
          value={detail}
          onChange={e => setDetail(e.target.value)}
          placeholder="She fell asleep mid-sentence asking for water. I just stood there for a minute."
          rows={4}
          style={{
            width: '100%', boxSizing: 'border-box',
            background: C.card, border: `1.5px solid ${C.border}`,
            borderRadius: 12, padding: '13px 14px',
            fontSize: 14, color: C.text, outline: 'none', resize: 'none',
            marginBottom: 14, lineHeight: 1.6, fontFamily: 'inherit',
          }}
        />

        {/* Date */}
        <FormLabel>When did it happen?</FormLabel>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          style={{
            width: '100%', boxSizing: 'border-box',
            background: C.card, border: `1.5px solid ${C.border}`,
            borderRadius: 12, padding: '12px 14px',
            fontSize: 15, color: C.text, outline: 'none',
            marginBottom: 14, fontFamily: 'inherit',
          }}
        />

        {/* How did it feel */}
        <FormLabel>How did it feel?</FormLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {(Object.entries(MOOD) as [MoodType, typeof MOOD[MoodType]][]).map(([key, m]) => (
            <button key={key} onClick={() => setMood(key)} style={{
              padding: '8px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600,
              background: mood === key ? m.bg : C.card,
              color: mood === key ? m.color : C.textSoft,
              border: `1.5px solid ${mood === key ? m.color : C.border}`,
              cursor: 'pointer', transition: 'all 0.15s',
            }}>
              {m.emoji} {m.label}
            </button>
          ))}
        </div>

        {/* Category */}
        <FormLabel>Tag this moment</FormLabel>
        <button onClick={() => setShowCats(!showCats)} style={{
          width: '100%', background: C.card, border: `1.5px solid ${C.border}`,
          borderRadius: 12, padding: '13px 14px',
          display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
          marginBottom: 8,
        }}>
          <span style={{ fontSize: 20 }}>{CAT[category].emoji}</span>
          <span style={{ flex: 1, textAlign: 'left', fontSize: 15, fontWeight: 600, color: CAT[category].color }}>
            {CAT[category].label}
          </span>
          <ChevronDown size={16} color={C.textSoft} style={{ transform: showCats ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>

        {showCats && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
            {(Object.entries(CAT) as [CategoryType, typeof CAT[CategoryType]][]).map(([key, cat]) => (
              <button key={key} onClick={() => { setCategory(key); setShowCats(false); }} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                background: category === key ? cat.bg : C.card,
                color: category === key ? cat.color : C.textMid,
                border: `1.5px solid ${category === key ? cat.color : C.border}`,
                cursor: 'pointer',
              }}>
                <span>{cat.emoji}</span> {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Save CTA */}
        <button
          onClick={handleSave}
          disabled={!canSave}
          style={{
            width: '100%', padding: '16px',
            background: canSave ? C.primary : C.border,
            color: canSave ? 'white' : C.textSoft,
            border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 700,
            cursor: canSave ? 'pointer' : 'not-allowed',
            boxShadow: canSave ? `0 6px 20px rgba(216,78,59,0.35)` : 'none',
            marginTop: 8,
          }}
        >
          Save this memory
        </button>
      </div>
    </div>
  );
}

function FormLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 700, color: C.textSoft, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 8px' }}>
      {children}
    </p>
  );
}

const mediaBtn: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
  background: 'none', border: 'none', cursor: 'pointer',
};

const mediaBtnIcon: React.CSSProperties = {
  width: 52, height: 52, borderRadius: 14,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};
