import { useState } from "react";
import { motion } from "motion/react";
import { UserPlus, Copy, Check, Share2, ChevronRight } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useApp } from "../App";
import { C, CAT, MOOD } from "../theme";
import { ScreenHeader } from "../components/ScreenHeader";

const FAMILY_MEMBERS = [
  { name: 'Sarah M.', role: 'Partner', emoji: '👩', color: '#FF6B8A' },
  { name: 'James M.', role: 'Son · 8', emoji: '👦', color: '#4C79FF' },
  { name: 'Lily M.', role: 'Daughter · 5', emoji: '👧', color: '#9B5EDB' },
];

const SHARED_MOMENTS = [
  { id: 's1', title: "Lily's first day of school", date: '2025-09-01', category: 'parenthood' as const, mood: 'bittersweet' as const, author: 'Sarah M.', emoji: '👩' },
  { id: 's2', title: "Family trip to the mountains", date: '2025-07-14', category: 'travel' as const, mood: 'joyful' as const, author: 'Me', emoji: '🕰️' },
  { id: 's3', title: "Grandad's 80th birthday dinner", date: '2025-05-22', category: 'family' as const, mood: 'grateful' as const, author: 'James M.', emoji: '👦' },
];

// ── Family Timeline ───────────────────────────────────────────────────────────

export function FamilyTimelineScreen() {
  const { navigate } = useApp();

  return (
    <div style={{ background: C.bg, minHeight: '100%' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(160deg, #2B0A4A 0%, #6B35A8 50%, #9B5EDB 100%)',
        padding: '52px 20px 24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              👨‍👩‍👧 Shared
            </p>
            <h1 style={{ color: 'white', fontSize: 26, fontWeight: 800, margin: '0 0 6px' }}>Family Timeline</h1>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, margin: 0 }}>
              {FAMILY_MEMBERS.length + 1} members · {SHARED_MOMENTS.length} shared moments
            </p>
          </div>
          <button onClick={() => navigate('family-invite')} style={{
            background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
            backdropFilter: 'blur(8px)', borderRadius: 10, padding: '8px 14px',
            color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6, marginTop: 4,
          }}>
            <UserPlus size={14} />
            Invite
          </button>
        </div>

        {/* Members avatars */}
        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)', fontSize: 22,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid rgba(255,255,255,0.4)',
          }}>
            🕰️
          </div>
          {FAMILY_MEMBERS.map(m => (
            <div key={m.name} style={{
              width: 44, height: 44, borderRadius: '50%',
              background: m.color + '40', fontSize: 22,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `2px solid ${m.color}80`,
            }}>
              {m.emoji}
            </div>
          ))}
          <button onClick={() => navigate('family-invite')} style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)', border: '2px dashed rgba(255,255,255,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'white', fontSize: 20,
          }}>
            +
          </button>
        </div>
      </div>

      <div style={{ padding: '16px 16px 40px' }}>
        {/* Members list */}
        <p style={{ fontSize: 11, fontWeight: 700, color: C.textSoft, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 10px' }}>
          Members
        </p>
        <div style={{ background: C.card, borderRadius: 14, overflow: 'hidden', border: `1px solid ${C.border}`, marginBottom: 16 }}>
          {[{ name: 'You (me)', role: 'Admin', emoji: '🕰️', color: C.primary }, ...FAMILY_MEMBERS].map((m, i, arr) => (
            <div key={m.name} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
              borderBottom: i < arr.length - 1 ? `1px solid ${C.divider}` : 'none',
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: '50%',
                background: m.color + '20', fontSize: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {m.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, color: C.text, fontSize: 14, margin: 0 }}>{m.name}</p>
                <p style={{ color: C.textSoft, fontSize: 12, margin: 0 }}>{m.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Shared moments */}
        <p style={{ fontSize: 11, fontWeight: 700, color: C.textSoft, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 10px' }}>
          Shared moments
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SHARED_MOMENTS.map(m => {
            const cat = CAT[m.category];
            const mood = MOOD[m.mood];
            return (
              <div key={m.id} style={{
                background: C.card, borderRadius: 14, padding: '14px',
                border: `1px solid ${C.border}`, boxShadow: C.shadow,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: cat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                    {cat.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, color: C.text, fontSize: 14, margin: 0 }}>{m.title}</p>
                    <p style={{ color: C.textSoft, fontSize: 12, margin: 0 }}>
                      {format(parseISO(m.date), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14 }}>{m.emoji}</span>
                  <span style={{ fontSize: 12, color: C.textSoft, fontWeight: 500 }}>by {m.author}</span>
                  <span style={{ marginLeft: 'auto', background: mood.bg, color: mood.color, fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 12 }}>
                    {mood.emoji} {mood.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={() => navigate('log')} style={{
          width: '100%', marginTop: 16, padding: '14px',
          background: '#9B5EDB', color: 'white', border: 'none',
          borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(155,94,219,0.4)',
        }}>
          + Add a family moment
        </button>
      </div>
    </div>
  );
}

// ── Family Invite ─────────────────────────────────────────────────────────────

export function FamilyInviteScreen() {
  const [copied, setCopied] = useState(false);
  const code = 'LAST-FMY-7K2P';

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{ background: C.bg, minHeight: '100%' }}>
      <ScreenHeader title="Invite family" />

      <div style={{ padding: '20px 16px 40px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Hero */}
        <div style={{
          background: 'linear-gradient(135deg, #2B0A4A, #9B5EDB)',
          borderRadius: 18, padding: '28px 20px', textAlign: 'center',
        }}>
          <p style={{ fontSize: 48, margin: '0 0 12px' }}>👨‍👩‍👧</p>
          <h2 style={{ color: 'white', fontSize: 22, fontWeight: 800, margin: '0 0 8px' }}>
            Invite your family
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, margin: 0, lineHeight: 1.55 }}>
            Share moments together. Everyone keeps their own private timeline, and can contribute to a shared family one.
          </p>
        </div>

        {/* Invite code */}
        <div style={{
          background: C.card, borderRadius: 16, padding: '20px',
          border: `1px solid ${C.border}`, textAlign: 'center',
        }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: C.textSoft, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Your invite code
          </p>
          <p style={{ fontSize: 28, fontWeight: 900, color: C.text, letterSpacing: 4, margin: '0 0 16px', fontFamily: 'monospace' }}>
            {code}
          </p>
          <button onClick={handleCopy} style={{
            background: copied ? C.green + '20' : C.primaryLight,
            color: copied ? C.green : C.primary,
            border: `1.5px solid ${copied ? C.green : C.primary}`,
            borderRadius: 12, padding: '11px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8, margin: '0 auto',
            transition: 'all 0.2s',
          }}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy invite code'}
          </button>
        </div>

        {/* OR share link */}
        <button style={{
          width: '100%', padding: '14px', background: C.card,
          border: `1px solid ${C.border}`, borderRadius: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          fontSize: 15, fontWeight: 600, color: C.textMid, cursor: 'pointer',
        }}>
          <Share2 size={16} />
          Share invite link
        </button>

        {/* How it works */}
        <div style={{ background: C.card, borderRadius: 16, padding: '16px', border: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: '0 0 14px' }}>How it works</p>
          {[
            { n: '1', text: 'Share your invite code or link with a family member' },
            { n: '2', text: 'They download Last Time and enter the code' },
            { n: '3', text: 'You\'re connected on a shared family timeline' },
            { n: '4', text: 'Each person keeps their private timeline — shared moments are opt-in' },
          ].map(step => (
            <div key={step.n} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                background: C.primary + '15', color: C.primary,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 800, flexShrink: 0,
              }}>
                {step.n}
              </div>
              <p style={{ color: C.textMid, fontSize: 13, lineHeight: 1.5, margin: 0 }}>{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
