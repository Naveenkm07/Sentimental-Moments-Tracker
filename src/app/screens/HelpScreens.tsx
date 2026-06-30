import { useState } from "react";
import { ChevronDown, ChevronRight, Mail, Star, Heart } from "lucide-react";
import { useApp } from "../App";
import { C } from "../theme";
import { ScreenHeader } from "../components/ScreenHeader";

// ── Help & FAQ ────────────────────────────────────────────────────────────────

const FAQS = [
  { q: 'What is a "last time"?', a: 'A "last time" is a moment you want to remember — often one that marks the end of a chapter. The last time your child asked to be carried. The last trip before a move. Things we only recognize as significant in hindsight.' },
  { q: 'Is my data private?', a: 'Yes. All your data is stored locally on your device. It never leaves your phone unless you explicitly choose to back it up or share it. Last Time has no account system and no server storage.' },
  { q: 'Can I add photos and voice notes?', a: 'Yes! When logging a moment, tap the photo or voice note area at the top of the log screen. Photos and voice notes are stored locally alongside your moment.' },
  { q: 'How do I back up my memories?', a: 'Go to Settings → Backup & Sync. You can back up to iCloud or Google Drive. You can also export your memories as a JSON file or — with Keepsake Premium — as a beautiful PDF memory book.' },
  { q: 'What is Keepsake Premium?', a: 'Keepsake is a one-time purchase ($4.99) that unlocks PDF export, family timelines, passcode lock, and unlimited moments. No subscription — you pay once and it\'s yours forever.' },
  { q: 'How does the Family Timeline work?', a: 'With Keepsake Premium, you can create a shared family timeline. Invite family members with an invite code. Each person keeps their private timeline, and moments can be optionally shared to the family view.' },
  { q: 'Can I delete a memory?', a: 'Yes. Open any moment and tap the trash icon in the top right corner. You\'ll be asked to confirm. Deleted memories cannot be recovered.' },
  { q: 'Will there be push notification spam?', a: 'Never. Last Time sends only one gentle daily nudge — a single quiet reminder in the evening. No streaks, no achievement notifications, no pressure.' },
];

export function HelpScreen() {
  const [open, setOpen] = useState<number | null>(null);
  const { navigate } = useApp();

  return (
    <div style={{ background: C.bg, minHeight: '100%' }}>
      <ScreenHeader title="Help & FAQ" />

      <div style={{ padding: '16px 16px 40px' }}>
        {/* Search hint */}
        <div style={{
          background: C.card, borderRadius: 12, padding: '12px 14px',
          border: `1px solid ${C.border}`, marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 10, color: C.textSoft, fontSize: 14,
        }}>
          🔍 Have a question? Browse below or contact us.
        </div>

        {/* FAQs */}
        <div style={{ background: C.card, borderRadius: 16, overflow: 'hidden', border: `1px solid ${C.border}`, marginBottom: 16 }}>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ borderBottom: i < FAQS.length - 1 ? `1px solid ${C.divider}` : 'none' }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                }}
              >
                <p style={{ flex: 1, fontWeight: 600, color: C.text, fontSize: 14, margin: 0, lineHeight: 1.4 }}>
                  {faq.q}
                </p>
                <ChevronDown
                  size={16} color={C.textSoft}
                  style={{ flexShrink: 0, transform: open === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                />
              </button>
              {open === i && (
                <div style={{ padding: '0 16px 14px' }}>
                  <p style={{ fontSize: 14, color: C.textMid, lineHeight: 1.65, margin: 0 }}>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact */}
        <div style={{ background: C.card, borderRadius: 16, overflow: 'hidden', border: `1px solid ${C.border}` }}>
          {[
            { icon: Mail, label: 'Contact support', desc: 'hello@lasttime.app', color: C.blue },
            { icon: Star, label: 'Rate the app', desc: 'Your reviews help more people find us', color: C.amber },
            { icon: Heart, label: 'Share Last Time', desc: 'Tell someone who would love it', color: C.primary },
          ].map((row, i, arr) => {
            const Icon = row.icon;
            return (
              <button key={row.label} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer',
                borderBottom: i < arr.length - 1 ? `1px solid ${C.divider}` : 'none', textAlign: 'left',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: row.color + '18',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={18} color={row.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, color: C.text, fontSize: 14, margin: 0 }}>{row.label}</p>
                  <p style={{ color: C.textSoft, fontSize: 12, margin: 0 }}>{row.desc}</p>
                </div>
                <ChevronRight size={16} color={C.textSoft} />
              </button>
            );
          })}
        </div>

        <button onClick={() => navigate('about')} style={{
          background: 'none', border: 'none', color: C.textSoft, fontSize: 13, cursor: 'pointer',
          width: '100%', marginTop: 16, textAlign: 'center',
        }}>
          About Last Time →
        </button>
      </div>
    </div>
  );
}

// ── About ─────────────────────────────────────────────────────────────────────

export function AboutScreen() {
  return (
    <div style={{ background: C.bg, minHeight: '100%' }}>
      <ScreenHeader title="About Last Time" />

      <div style={{ padding: '20px 16px 40px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Logo + tagline */}
        <div style={{
          background: 'linear-gradient(160deg, #1A0A00 0%, #6B2500 50%, #D84E3B 100%)',
          borderRadius: 20, padding: '32px 20px', textAlign: 'center',
        }}>
          <p style={{ fontSize: 52, margin: '0 0 12px' }}>🕰️</p>
          <h2 style={{ color: 'white', fontSize: 24, fontWeight: 800, margin: '0 0 6px' }}>Last Time</h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, margin: '0 0 12px' }}>cherish what's still here</p>
          <div style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.12)', borderRadius: 10,
            padding: '4px 14px', color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600,
          }}>
            Version 1.0.0
          </div>
        </div>

        {/* Philosophy */}
        <div style={{ background: C.card, borderRadius: 16, padding: '18px', border: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: '0 0 10px' }}>Our philosophy</p>
          <p style={{ fontSize: 14, color: C.textMid, lineHeight: 1.7, margin: 0 }}>
            We never realize when something is the last time it happens — the last time you carry your kid to bed, the last time you visit a city, the last time a friend is healthy.
            <br /><br />
            Last Time exists to help you notice these moments before they pass. Not to create anxiety, but to cultivate presence.
          </p>
        </div>

        {/* Tech stack */}
        <div style={{ background: C.card, borderRadius: 16, padding: '16px', border: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: '0 0 12px' }}>App info</p>
          {[
            { label: 'Version', value: '1.0.0' },
            { label: 'Build', value: '2026.06.29' },
            { label: 'Platform', value: 'Android / iOS' },
            { label: 'Data storage', value: 'On-device (private)' },
            { label: 'Network access', value: 'Backup only (optional)' },
          ].map((row, i, arr) => (
            <div key={row.label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '8px 0', borderBottom: i < arr.length - 1 ? `1px solid ${C.divider}` : 'none',
            }}>
              <span style={{ fontSize: 13, color: C.textSoft }}>{row.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* Credits */}
        <div style={{ background: C.amberLight, border: `1px solid #FDEABB`, borderRadius: 14, padding: '14px 16px' }}>
          <p style={{ fontSize: 14, color: '#7A5600', margin: 0, lineHeight: 1.6, textAlign: 'center' }}>
            Made with ❤️ for everyone who wants to hold onto the moments that matter most.
          </p>
        </div>

        <p style={{ fontSize: 12, color: C.textSoft, textAlign: 'center', lineHeight: 1.5 }}>
          © 2026 Last Time · Privacy Policy · Terms of Service
        </p>
      </div>
    </div>
  );
}
