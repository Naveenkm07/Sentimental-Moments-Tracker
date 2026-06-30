import { useState } from "react";
import { format, parseISO } from "date-fns";
import { motion } from "motion/react";
import { Edit3, Trash2, Mic, Image, Share2, ChevronDown } from "lucide-react";
import { useApp } from "../App";
import { C, CAT, MOOD } from "../theme";
import type { CategoryType, MoodType } from "../theme";
import { ScreenHeader } from "../components/ScreenHeader";

// ── Moment Detail ─────────────────────────────────────────────────────────────

export function MomentDetailScreen() {
  const { moments, navigate, navState } = useApp();
  const id = navState.params?.id as string;
  const m = moments.find(x => x.id === id);

  if (!m) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100%' }}>
      <p style={{ color: C.textSoft }}>Moment not found.</p>
    </div>
  );

  const cat = CAT[m.category];
  const mood = MOOD[m.mood];

  return (
    <div style={{ background: C.bg, minHeight: '100%' }}>
      <ScreenHeader title="Memory" right={
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => navigate('moment-edit', { id })} style={actionBtn}>
            <Edit3 size={16} color={C.textMid} />
          </button>
          <button onClick={() => navigate('moment-delete', { id })} style={{ ...actionBtn, background: '#FFF0EE' }}>
            <Trash2 size={16} color={C.primary} />
          </button>
        </div>
      } />

      <div style={{ padding: '20px 20px 60px' }}>
        {/* Category + Date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: cat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
          }}>
            {cat.emoji}
          </div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: cat.color, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 2px' }}>
              {cat.label}
            </p>
            <p style={{ fontSize: 13, color: C.textSoft, margin: 0 }}>
              {format(parseISO(m.date), 'MMMM d, yyyy')}
            </p>
          </div>
        </div>

        {/* Title */}
        <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, margin: '0 0 12px', lineHeight: 1.3 }}>
          {m.title}
        </h2>

        {/* Mood */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: mood.bg, color: mood.color,
          padding: '6px 14px', borderRadius: 20,
          fontSize: 13, fontWeight: 700, marginBottom: 20,
        }}>
          {mood.emoji} {mood.label}
        </div>

        {/* Detail */}
        {m.detail && (
          <div style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 14, padding: '16px 18px', marginBottom: 16,
            borderLeft: `4px solid ${cat.color}`,
          }}>
            <p style={{ fontSize: 15, color: C.textMid, lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>
              "{m.detail}"
            </p>
          </div>
        )}

        {/* Media badges */}
        {(m.hasVoiceNote || m.hasPhoto) && (
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            {m.hasVoiceNote && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: C.card, border: `1px solid ${C.border}`,
                borderRadius: 10, padding: '8px 14px',
              }}>
                <Mic size={15} color={C.primary} />
                <span style={{ fontSize: 13, fontWeight: 600, color: C.textMid }}>Voice note attached</span>
              </div>
            )}
            {m.hasPhoto && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: C.card, border: `1px solid ${C.border}`,
                borderRadius: 10, padding: '8px 14px',
              }}>
                <Image size={15} color={C.blue} />
                <span style={{ fontSize: 13, fontWeight: 600, color: C.textMid }}>Photo attached</span>
              </div>
            )}
          </div>
        )}

        {/* Reflection prompt */}
        <div style={{
          background: C.amberLight, border: `1px solid #FDEABB`,
          borderRadius: 14, padding: '14px 16px',
        }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#B8810A', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            💛 Reflection
          </p>
          <p style={{ fontSize: 14, color: '#7A5600', margin: 0, lineHeight: 1.6 }}>
            You captured this moment. One day, this record will be something you're deeply grateful for.
          </p>
        </div>

        {/* Share */}
        <button style={{
          width: '100%', marginTop: 20, padding: '14px',
          background: C.card, border: `1px solid ${C.border}`,
          borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          fontSize: 14, fontWeight: 600, color: C.textMid, cursor: 'pointer',
        }}>
          <Share2 size={16} />
          Share this memory
        </button>
      </div>
    </div>
  );
}

// ── Edit Moment ───────────────────────────────────────────────────────────────

export function EditMomentScreen() {
  const { moments, updateMoment, navigate, navState, goBack } = useApp();
  const id = navState.params?.id as string;
  const m = moments.find(x => x.id === id);

  const [title, setTitle] = useState(m?.title ?? '');
  const [detail, setDetail] = useState(m?.detail ?? '');
  const [date, setDate] = useState(m?.date ?? new Date().toISOString().split('T')[0]);
  const [mood, setMood] = useState<MoodType>(m?.mood ?? 'nostalgic');
  const [category, setCategory] = useState<CategoryType>(m?.category ?? 'family');

  if (!m) return null;

  const handleSave = () => {
    updateMoment(id, { title, detail: detail || undefined, date, mood, category });
    navigate('moment-detail', { id });
  };

  return (
    <div style={{ background: C.bg, minHeight: '100%' }}>
      <ScreenHeader title="Edit memory" right={
        <button onClick={handleSave} style={{
          background: C.primary, color: 'white', border: 'none',
          borderRadius: 10, padding: '8px 16px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
        }}>
          Save
        </button>
      } />

      <div style={{ padding: '16px 16px 80px' }}>
        <Label>The last time I...</Label>
        <input value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} />

        <Label>A little more...</Label>
        <textarea value={detail} onChange={e => setDetail(e.target.value)} rows={4} style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }} />

        <Label>When?</Label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />

        <Label>How did it feel?</Label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {(Object.entries(MOOD) as [MoodType, typeof MOOD[MoodType]][]).map(([key, mv]) => (
            <button key={key} onClick={() => setMood(key)} style={{
              padding: '8px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600,
              background: mood === key ? mv.bg : C.card,
              color: mood === key ? mv.color : C.textSoft,
              border: `1.5px solid ${mood === key ? mv.color : C.border}`,
              cursor: 'pointer',
            }}>
              {mv.emoji} {mv.label}
            </button>
          ))}
        </div>

        <Label>Category</Label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {(Object.entries(CAT) as [CategoryType, typeof CAT[CategoryType]][]).map(([key, cv]) => (
            <button key={key} onClick={() => setCategory(key)} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600,
              background: category === key ? cv.bg : C.card,
              color: category === key ? cv.color : C.textMid,
              border: `1.5px solid ${category === key ? cv.color : C.border}`,
              cursor: 'pointer',
            }}>
              <span>{cv.emoji}</span> {cv.label}
            </button>
          ))}
        </div>

        <button onClick={handleSave} style={{
          width: '100%', padding: 16, background: C.primary, color: 'white',
          border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: 'pointer',
          boxShadow: `0 4px 16px rgba(216,78,59,0.35)`,
        }}>
          Save changes
        </button>
      </div>
    </div>
  );
}

// ── Delete Confirm ────────────────────────────────────────────────────────────

export function DeleteConfirmScreen() {
  const { moments, deleteMoment, navigate, navState } = useApp();
  const id = navState.params?.id as string;
  const m = moments.find(x => x.id === id);

  const handleDelete = () => {
    deleteMoment(id);
    navigate('timeline');
  };

  return (
    <div style={{ background: C.bg, minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title="Delete memory" />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
        <motion.div
          initial={{ scale: 0.7 }}
          animate={{ scale: 1 }}
          style={{
            width: 80, height: 80, borderRadius: 24,
            background: '#FFF0EE', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, marginBottom: 20,
          }}
        >
          🗑️
        </motion.div>

        <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, margin: '0 0 10px', textAlign: 'center' }}>
          Delete this memory?
        </h2>
        <p style={{ fontSize: 15, color: C.textSoft, textAlign: 'center', lineHeight: 1.6, margin: '0 0 8px' }}>
          This action cannot be undone.
        </p>

        {m && (
          <div style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 14, padding: '14px 18px', width: '100%',
            marginBottom: 28, boxSizing: 'border-box',
          }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: '0 0 4px' }}>{m.title}</p>
            <p style={{ fontSize: 13, color: C.textSoft, margin: 0 }}>{format(parseISO(m.date), 'MMMM d, yyyy')}</p>
          </div>
        )}

        <button onClick={handleDelete} style={{
          width: '100%', padding: 15, background: '#D84E3B',
          color: 'white', border: 'none', borderRadius: 14,
          fontSize: 16, fontWeight: 700, cursor: 'pointer', marginBottom: 12,
        }}>
          Yes, delete it
        </button>
        <button onClick={() => navigate('moment-detail', { id })} style={{
          width: '100%', padding: 15, background: C.card,
          color: C.textMid, border: `1px solid ${C.border}`, borderRadius: 14,
          fontSize: 16, fontWeight: 600, cursor: 'pointer',
        }}>
          Keep this memory
        </button>
      </div>
    </div>
  );
}

const actionBtn: React.CSSProperties = {
  background: '#F2EFEB', border: 'none', borderRadius: 10,
  width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer',
};

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 700, color: C.textSoft, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 8px' }}>
      {children}
    </p>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  background: C.card, border: `1.5px solid ${C.border}`,
  borderRadius: 12, padding: '12px 14px',
  fontSize: 15, color: C.text, outline: 'none', marginBottom: 14,
  fontFamily: 'inherit',
};
