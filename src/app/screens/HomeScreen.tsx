import { Bell, Search, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { motion } from "motion/react";
import { useApp } from "../App";
import { C } from "../theme";
import { EntryCard } from "../components/EntryCard";

const DAILY_PROMPTS = [
  "When did you last watch the sunset together?",
  "When did you last call your dad just to talk?",
  "When did you last hold your child while they slept?",
  "When did you last tell someone you loved them without a reason?",
  "When did you last visit somewhere that feels like home?",
  "When did you last laugh until it hurt?",
  "When did you last see a friend who knew you before life got complicated?",
  "When did you last do something just for yourself?",
  "When did you last sit in silence and feel okay?",
  "When did you last write something just for you?",
  "When did you last cook something from your childhood?",
  "When did you last say goodbye properly?",
];

function getDailyPrompt() {
  const day = Math.floor(Date.now() / 86400000);
  return DAILY_PROMPTS[day % DAILY_PROMPTS.length];
}

export function HomeScreen() {
  const { moments, navigate } = useApp();
  const recent = moments.slice(0, 6);
  const today = format(new Date(), 'EEEE, MMMM d');
  const prompt = getDailyPrompt();

  return (
    <div style={{ background: C.bg, minHeight: '100%' }}>
      {/* Header */}
      <div style={{ padding: '52px 20px 16px', background: C.card, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 12, color: C.textSoft, letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 2px' }}>
              {today}
            </p>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, margin: '0 0 2px', letterSpacing: '-0.3px' }}>
              Last Time
            </h1>
            <p style={{ fontSize: 13, color: C.textSoft, margin: 0 }}>cherish what's still here</p>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button onClick={() => navigate('search')} style={iconBtn}>
              <Search size={18} color={C.textMid} />
            </button>
            <button onClick={() => navigate('settings-notifications')} style={iconBtn}>
              <Bell size={18} color={C.textMid} />
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 16px 100px' }}>
        {/* Daily Nudge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: C.amberLight, border: `1px solid #FDEABB`,
            borderRadius: 16, padding: '16px 18px', marginBottom: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <span style={{ fontSize: 14 }}>🌅</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#B8810A', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Today's Nudge
            </span>
          </div>
          <p style={{ fontSize: 16, fontWeight: 600, color: '#5C3D00', margin: '0 0 12px', lineHeight: 1.45 }}>
            "{prompt}"
          </p>
          <button
            onClick={() => navigate('log')}
            style={{
              background: '#F5A623', color: 'white', border: 'none',
              borderRadius: 20, padding: '8px 16px', fontSize: 13,
              fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <Sparkles size={13} />
            Log this moment
          </button>
        </motion.div>

        {/* Recently Logged */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.textSoft, letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
            Recently Logged
          </p>
          <button onClick={() => navigate('timeline')} style={{ background: 'none', border: 'none', color: C.primary, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            See all
          </button>
        </div>

        {recent.length === 0 ? (
          <EmptyState />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recent.map(m => (
              <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <EntryCard moment={m} onClick={() => navigate('moment-detail', { id: m.id })} />
              </motion.div>
            ))}
          </div>
        )}

        {/* FAB */}
        <div style={{ position: 'fixed', bottom: 88, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, padding: '0 16px', boxSizing: 'border-box', pointerEvents: 'none' }}>
          <button
            onClick={() => navigate('log')}
            style={{
              width: '100%', padding: '15px', pointerEvents: 'all',
              background: C.primary, color: 'white', border: 'none',
              borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 6px 24px rgba(216,78,59,0.40)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            + Log a last time
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  const { navigate } = useApp();
  return (
    <div style={{ textAlign: 'center', padding: '48px 24px' }}>
      <div style={{ fontSize: 52, marginBottom: 16 }}>📖</div>
      <h3 style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: '0 0 8px' }}>
        Your story starts here
      </h3>
      <p style={{ fontSize: 14, color: C.textSoft, lineHeight: 1.6, margin: '0 0 24px' }}>
        Record your first "last time" — a moment you want to hold onto before it passes.
      </p>
      <button
        onClick={() => navigate('log')}
        style={{
          background: C.primary, color: 'white', border: 'none',
          borderRadius: 12, padding: '13px 28px', fontSize: 15,
          fontWeight: 700, cursor: 'pointer',
          boxShadow: `0 4px 16px rgba(216,78,59,0.35)`,
        }}
      >
        Add your first moment
      </button>
    </div>
  );
}

const iconBtn: React.CSSProperties = {
  background: '#F2EFEB', border: 'none', borderRadius: 10,
  width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer',
};
