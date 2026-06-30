import { motion } from "motion/react";
import { Check, Star, FileText, Users, Download } from "lucide-react";
import { useApp } from "../App";
import { C } from "../theme";
import { ScreenHeader } from "../components/ScreenHeader";

// ── Keepsake Premium Upsell ───────────────────────────────────────────────────

export function KeepsakeScreen() {
  const { navigate, isPremium, setPremium } = useApp();

  const features = [
    { icon: '📖', title: 'PDF memory book', desc: 'Export a beautiful printed keepsake of your moments' },
    { icon: '👨‍👩‍👧', title: 'Family timeline', desc: 'Invite loved ones to a shared private timeline' },
    { icon: '🔒', title: 'Passcode & Face ID', desc: 'Keep your memories private and secure' },
    { icon: '🎨', title: 'Custom covers', desc: 'Personalize your memory book with photos and themes' },
    { icon: '☁️', title: 'Cloud backup', desc: 'Never lose your memories — synced automatically' },
    { icon: '✨', title: 'Unlimited moments', desc: 'No cap on how many moments you can log' },
  ];

  if (isPremium) {
    return (
      <div style={{ background: C.bg, minHeight: '100%' }}>
        <ScreenHeader title="Keepsake Premium" />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 24px', textAlign: 'center' }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            style={{
              width: 80, height: 80, borderRadius: 24,
              background: 'linear-gradient(135deg, #F5A623, #D84E3B)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 36, marginBottom: 20,
            }}
          >
            ⭐
          </motion.div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: '0 0 10px' }}>You're a Keepsake member</h2>
          <p style={{ fontSize: 15, color: C.textSoft, margin: '0 0 28px', lineHeight: 1.6 }}>
            All premium features are unlocked. Thank you for supporting Last Time.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
            <button onClick={() => navigate('keepsake-export')} style={primaryBtn}>Export memory book</button>
            <button onClick={() => navigate('family-timeline')} style={secondaryBtn}>Family timeline</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: C.bg, minHeight: '100%' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(160deg, #4A1A00 0%, #8B3A00 40%, #F5A623 100%)',
        padding: '52px 20px 28px',
      }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            ⭐ Keepsake
          </p>
          <h1 style={{ color: 'white', fontSize: 30, fontWeight: 800, margin: '0 0 8px', lineHeight: 1.2 }}>
            Your memories,<br />beautifully preserved
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15, margin: 0, lineHeight: 1.55 }}>
            One-time purchase. No subscription. Everything yours, forever.
          </p>
        </motion.div>
      </div>

      <div style={{ padding: '20px 16px 40px' }}>
        {/* Price card */}
        <div style={{
          background: C.card, borderRadius: 18, padding: '20px',
          border: `2px solid ${C.amber}40`, boxShadow: C.shadowMd,
          textAlign: 'center', marginBottom: 16,
        }}>
          <p style={{ fontSize: 13, color: C.textSoft, margin: '0 0 4px' }}>One-time purchase</p>
          <p style={{ fontSize: 42, fontWeight: 900, color: C.text, margin: '0 0 4px', letterSpacing: '-1px' }}>$4.99</p>
          <p style={{ fontSize: 13, color: C.textSoft, margin: '0 0 16px' }}>Unlock everything. Keep it forever.</p>
          <button onClick={() => { setPremium(true); navigate('log-success'); }} style={{
            ...primaryBtn, width: '100%',
            background: 'linear-gradient(135deg, #F5A623, #D84E3B)',
          }}>
            Unlock Keepsake — $4.99
          </button>
          <p style={{ fontSize: 12, color: C.textSoft, margin: '10px 0 0' }}>No subscription · No ads · Yours forever</p>
        </div>

        {/* Features */}
        <div style={{ background: C.card, borderRadius: 16, overflow: 'hidden', border: `1px solid ${C.border}` }}>
          {features.map((f, i) => (
            <div key={f.title} style={{
              display: 'flex', alignItems: 'flex-start', gap: 14,
              padding: '14px 16px',
              borderBottom: i < features.length - 1 ? `1px solid ${C.divider}` : 'none',
            }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>{f.icon}</span>
              <div>
                <p style={{ fontWeight: 700, color: C.text, fontSize: 14, margin: '0 0 2px' }}>{f.title}</p>
                <p style={{ color: C.textSoft, fontSize: 13, margin: 0, lineHeight: 1.45 }}>{f.desc}</p>
              </div>
              <Check size={15} color={C.green} style={{ marginTop: 2, flexShrink: 0 }} />
            </div>
          ))}
        </div>

        <p style={{ fontSize: 12, color: C.textSoft, textAlign: 'center', marginTop: 16, lineHeight: 1.5 }}>
          Payment processed securely through the App Store. One-time purchase, no recurring charges.
        </p>
      </div>
    </div>
  );
}

// ── PDF Export Preview ────────────────────────────────────────────────────────

export function KeepsakeExportScreen() {
  const { moments, navigate } = useApp();

  const pages = [
    { title: 'Cover', preview: '📖', desc: 'Your personalized cover with name and year' },
    { title: 'Introduction', preview: '✍️', desc: 'A personal note you write for the reader' },
    ...moments.slice(0, 3).map(m => ({ title: m.title.slice(0, 30), preview: '📝', desc: m.detail?.slice(0, 60) ?? '' })),
    { title: 'Timeline', preview: '📅', desc: 'Full chronological timeline of all moments' },
  ];

  return (
    <div style={{ background: C.bg, minHeight: '100%' }}>
      <ScreenHeader title="Export memory book" />

      <div style={{ padding: '16px 16px 40px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Preview */}
        <div style={{
          background: 'linear-gradient(135deg, #1A0A00, #D84E3B)',
          borderRadius: 18, padding: '24px', textAlign: 'center',
        }}>
          <p style={{ fontSize: 52, margin: '0 0 12px' }}>📖</p>
          <p style={{ color: 'white', fontSize: 20, fontWeight: 800, margin: '0 0 6px' }}>Your Memory Book</p>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, margin: 0 }}>
            {moments.length} moments · {pages.length} pages
          </p>
        </div>

        {/* Format selector */}
        <div style={{ background: C.card, borderRadius: 16, padding: '16px', border: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: '0 0 12px' }}>Export format</p>
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { icon: '📄', label: 'PDF', desc: 'Digital & print-ready' },
              { icon: '📱', label: 'Share', desc: 'Social stories & images' },
            ].map((f, i) => (
              <div key={f.label} style={{
                flex: 1, padding: '14px', borderRadius: 12, textAlign: 'center',
                background: i === 0 ? C.primaryLight : C.bg,
                border: `2px solid ${i === 0 ? C.primary : C.border}`,
              }}>
                <p style={{ fontSize: 24, margin: '0 0 4px' }}>{f.icon}</p>
                <p style={{ fontWeight: 700, color: C.text, fontSize: 14, margin: '0 0 2px' }}>{f.label}</p>
                <p style={{ color: C.textSoft, fontSize: 12, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pages preview */}
        <div style={{ background: C.card, borderRadius: 16, overflow: 'hidden', border: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: C.text, padding: '14px 16px 0', margin: 0 }}>Pages preview</p>
          {pages.map((p, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '12px 16px', borderTop: i > 0 ? `1px solid ${C.divider}` : 'none',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: '#F7F5F2', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, flexShrink: 0,
              }}>
                {p.preview}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, color: C.text, fontSize: 13, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {p.title}
                </p>
                {p.desc && <p style={{ color: C.textSoft, fontSize: 11, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.desc}</p>}
              </div>
              <span style={{ color: C.textSoft, fontSize: 12 }}>p.{i + 1}</span>
            </div>
          ))}
        </div>

        <button style={primaryBtn}>
          <Download size={16} style={{ marginRight: 8 }} />
          Generate PDF · {moments.length} moments
        </button>
      </div>
    </div>
  );
}

const primaryBtn: React.CSSProperties = {
  width: '100%', padding: '15px', background: C.primary, color: 'white',
  border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer',
  boxShadow: `0 4px 16px rgba(216,78,59,0.35)`,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};

const secondaryBtn: React.CSSProperties = {
  width: '100%', padding: '15px', background: C.card, color: C.textMid,
  border: `1px solid ${C.border}`, borderRadius: 14, fontSize: 15, fontWeight: 600, cursor: 'pointer',
};
