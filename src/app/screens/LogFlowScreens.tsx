import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Mic, Square, Play, Pause, Check, Sparkles } from "lucide-react";
import { useApp } from "../App";
import { C } from "../theme";

// ── Voice Recording Screen ────────────────────────────────────────────────────

export function LogVoiceScreen() {
  const { goBack, navigate } = useApp();
  const [state, setState] = useState<'idle' | 'recording' | 'done'>('idle');
  const [seconds, setSeconds] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRec = () => {
    setState('recording');
    setSeconds(0);
    timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
  };

  const stopRec = () => {
    setState('done');
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div style={{ background: C.bg, minHeight: '100%' }}>
      <div style={{
        background: C.card, borderBottom: `1px solid ${C.border}`,
        padding: '52px 16px 14px', display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button onClick={goBack} style={backBtn}><ArrowLeft size={18} color={C.text} /></button>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: C.text, margin: 0 }}>Voice Note</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 32px', gap: 32 }}>
        {/* Waveform visualization */}
        <div style={{
          width: '100%', height: 80, display: 'flex', alignItems: 'center',
          gap: 3, justifyContent: 'center',
        }}>
          {Array.from({ length: 30 }, (_, i) => (
            <motion.div
              key={i}
              animate={state === 'recording' ? {
                height: [8, Math.random() * 50 + 10, 8],
              } : { height: 8 }}
              transition={{ duration: 0.4 + Math.random() * 0.4, repeat: Infinity, repeatType: 'mirror' }}
              style={{
                width: 4, borderRadius: 2,
                background: state === 'recording' ? C.primary : C.border,
              }}
            />
          ))}
        </div>

        <p style={{ fontSize: 48, fontWeight: 800, color: C.text, margin: 0, letterSpacing: '-1px' }}>
          {fmt(seconds)}
        </p>

        <p style={{ fontSize: 15, color: C.textSoft, textAlign: 'center', margin: 0, maxWidth: 260, lineHeight: 1.5 }}>
          {state === 'idle' && 'Press the button to start recording your voice note.'}
          {state === 'recording' && 'Recording... speak your memory aloud.'}
          {state === 'done' && 'Your voice note has been captured. Listen back or save it.'}
        </p>

        {/* Controls */}
        {state !== 'done' ? (
          <button
            onClick={state === 'idle' ? startRec : stopRec}
            style={{
              width: 80, height: 80, borderRadius: '50%',
              background: state === 'recording' ? '#FF4444' : C.primary,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', cursor: 'pointer',
              boxShadow: `0 8px 24px ${state === 'recording' ? 'rgba(255,68,68,0.4)' : 'rgba(216,78,59,0.4)'}`,
            }}
          >
            {state === 'idle' ? <Mic size={32} color="white" /> : <Square size={28} color="white" fill="white" />}
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
            <button
              onClick={() => setPlaying(!playing)}
              style={{
                width: '100%', padding: 14,
                background: C.card, border: `1.5px solid ${C.border}`,
                borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                fontSize: 15, fontWeight: 600, color: C.text, cursor: 'pointer',
              }}
            >
              {playing ? <Pause size={18} /> : <Play size={18} />}
              {playing ? 'Pause' : 'Play back'} ({fmt(seconds)})
            </button>
            <button
              onClick={() => navigate('log')}
              style={{
                width: '100%', padding: 14,
                background: C.primary, border: 'none',
                borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                fontSize: 15, fontWeight: 700, color: 'white', cursor: 'pointer',
                boxShadow: `0 4px 16px rgba(216,78,59,0.35)`,
              }}
            >
              <Check size={18} />
              Attach to memory
            </button>
            <button onClick={() => { setState('idle'); setSeconds(0); }} style={{
              background: 'none', border: 'none', color: C.textSoft, fontSize: 14, cursor: 'pointer',
            }}>
              Re-record
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Log Success Screen ────────────────────────────────────────────────────────

export function LogSuccessScreen() {
  const { navigate, moments } = useApp();
  const latest = moments[0];

  return (
    <div style={{
      background: 'linear-gradient(160deg, #1A0A00 0%, #6B2500 50%, #D84E3B 100%)',
      minHeight: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '40px 24px',
    }}>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        style={{
          width: 90, height: 90, borderRadius: 26,
          background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 44, marginBottom: 28,
          border: '1px solid rgba(255,255,255,0.2)',
        }}
      >
        ✨
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ textAlign: 'center', marginBottom: 32 }}
      >
        <h1 style={{ color: 'white', fontSize: 28, fontWeight: 800, margin: '0 0 8px' }}>
          Memory saved
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, margin: '0 0 20px', lineHeight: 1.5 }}>
          You've captured a moment that will matter.
        </p>
        {latest && (
          <div style={{
            background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)',
            borderRadius: 14, padding: '14px 18px', textAlign: 'left',
            border: '1px solid rgba(255,255,255,0.15)',
          }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, margin: '0 0 6px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Just logged
            </p>
            <p style={{ color: 'white', fontSize: 16, fontWeight: 700, margin: 0, lineHeight: 1.3 }}>
              {latest.title}
            </p>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}
      >
        <button onClick={() => navigate('log')} style={{
          width: '100%', padding: 15,
          background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.3)',
          borderRadius: 14, color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          backdropFilter: 'blur(8px)',
        }}>
          <Sparkles size={16} />
          Log another moment
        </button>
        <button onClick={() => navigate('home')} style={{
          width: '100%', padding: 15,
          background: 'white', border: 'none',
          borderRadius: 14, color: '#111827', fontSize: 15, fontWeight: 700, cursor: 'pointer',
        }}>
          Back to home
        </button>
        <button onClick={() => navigate('timeline')} style={{
          background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)',
          fontSize: 14, cursor: 'pointer', padding: 8,
        }}>
          View in timeline →
        </button>
      </motion.div>
    </div>
  );
}

const backBtn: React.CSSProperties = {
  background: 'transparent', border: 'none', borderRadius: '50%',
  width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', flexShrink: 0,
};
