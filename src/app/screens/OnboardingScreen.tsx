import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, Check } from "lucide-react";
import { useApp } from "../App";
import { C, CAT } from "../theme";
import type { CategoryType } from "../theme";

const steps = [
  {
    id: 'welcome',
    emoji: '🕰️',
    title: 'Welcome to Last Time',
    subtitle: 'The app that helps you notice the moments you never want to forget.',
    body: 'We never realize when something is the last time it happens — the last time you carry your kid to bed, the last time you visit a city, the last time a friend is healthy.\n\nBy then, it\'s already gone.',
  },
  {
    id: 'how',
    emoji: '✍️',
    title: 'How it works',
    subtitle: 'Simple, beautiful, and entirely yours.',
    body: null,
    features: [
      { icon: '📝', title: 'Log a last time', desc: 'Record the moment before it passes with a note, photo, or voice memo.' },
      { icon: '📋', title: 'Browse your timeline', desc: 'A reverse scrapbook of your life, sorted by year and category.' },
      { icon: '💫', title: 'Daily gentle nudges', desc: 'Soft prompts — never spam — to help you notice what matters.' },
    ],
  },
  {
    id: 'categories',
    emoji: '🗂️',
    title: 'What matters most to you?',
    subtitle: 'Choose the life areas you want to track. You can always change this later.',
    body: null,
  },
  {
    id: 'reminders',
    emoji: '🔔',
    title: 'Stay present',
    subtitle: 'A gentle nudge, once a day. That\'s all.',
    body: 'Last Time will send you one quiet reminder each evening — a question to help you reflect. No spam, no streaks, no pressure.',
  },
];

const ALL_CATS = Object.entries(CAT) as [CategoryType, typeof CAT[CategoryType]][];

export function OnboardingScreen() {
  const { navigate, setHasOnboarded, selectedCategories, setSelectedCategories, setNotificationsEnabled } = useApp();
  const [step, setStep] = useState(0);
  const [notifChoice, setNotifChoice] = useState<'yes' | 'no' | null>(null);
  const cur = steps[step];
  const isLast = step === steps.length - 1;

  const toggleCat = (c: CategoryType) => {
    setSelectedCategories(
      selectedCategories.includes(c)
        ? selectedCategories.filter(x => x !== c)
        : [...selectedCategories, c]
    );
  };

  const handleNext = () => {
    if (isLast) {
      if (notifChoice) setNotificationsEnabled(notifChoice === 'yes');
      setHasOnboarded(true);
      navigate('home');
    } else {
      setStep(s => s + 1);
    }
  };

  const canNext = cur.id === 'categories' ? selectedCategories.length > 0 :
                  cur.id === 'reminders' ? notifChoice !== null : true;

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column' }}>
      {/* Progress */}
      <div style={{ display: 'flex', gap: 6, padding: '52px 24px 0' }}>
        {steps.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 3,
            background: i <= step ? C.primary : C.border,
            transition: 'background 0.3s',
          }} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '32px 24px 40px' }}
        >
          {/* Emoji */}
          <div style={{ fontSize: 56, marginBottom: 20 }}>{cur.emoji}</div>

          <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, margin: '0 0 8px', lineHeight: 1.2 }}>
            {cur.title}
          </h1>
          <p style={{ fontSize: 15, color: C.textMid, margin: '0 0 28px', lineHeight: 1.55 }}>
            {cur.subtitle}
          </p>

          {/* Content by step */}
          {cur.body && (
            <p style={{ fontSize: 15, color: C.textSoft, lineHeight: 1.65, whiteSpace: 'pre-line' }}>
              {cur.body}
            </p>
          )}

          {cur.features && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {cur.features.map(f => (
                <div key={f.title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: C.primaryLight, fontSize: 22,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {f.icon}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, color: C.text, fontSize: 15, margin: '0 0 3px' }}>{f.title}</p>
                    <p style={{ color: C.textSoft, fontSize: 13, margin: 0, lineHeight: 1.5 }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Categories */}
          {cur.id === 'categories' && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {ALL_CATS.map(([key, cat]) => {
                const sel = selectedCategories.includes(key);
                return (
                  <button key={key} onClick={() => toggleCat(key)} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '10px 16px', borderRadius: 20,
                    background: sel ? cat.bg : C.card,
                    border: `2px solid ${sel ? cat.color : C.border}`,
                    cursor: 'pointer', fontSize: 14, fontWeight: sel ? 700 : 500,
                    color: sel ? cat.color : C.textMid,
                    transition: 'all 0.15s',
                  }}>
                    <span style={{ fontSize: 18 }}>{cat.emoji}</span>
                    {cat.label}
                    {sel && <Check size={14} />}
                  </button>
                );
              })}
            </div>
          )}

          {/* Notifications */}
          {cur.id === 'reminders' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
              {[
                { val: 'yes' as const, emoji: '🔔', label: 'Yes, send me a daily nudge', desc: 'One gentle question each evening' },
                { val: 'no' as const, emoji: '🔕', label: 'No thanks, I\'ll open the app myself', desc: 'No reminders' },
              ].map(opt => (
                <button key={opt.val} onClick={() => setNotifChoice(opt.val)} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '16px', borderRadius: 14,
                  background: notifChoice === opt.val ? C.primaryLight : C.card,
                  border: `2px solid ${notifChoice === opt.val ? C.primary : C.border}`,
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.15s',
                }}>
                  <span style={{ fontSize: 24 }}>{opt.emoji}</span>
                  <div>
                    <p style={{ fontWeight: 700, color: C.text, fontSize: 14, margin: 0 }}>{opt.label}</p>
                    <p style={{ color: C.textSoft, fontSize: 12, margin: 0 }}>{opt.desc}</p>
                  </div>
                  {notifChoice === opt.val && (
                    <div style={{ marginLeft: 'auto', width: 20, height: 20, borderRadius: '50%', background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={12} color="white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* CTA */}
          <button
            onClick={handleNext}
            disabled={!canNext}
            style={{
              width: '100%', padding: '16px',
              background: canNext ? C.primary : C.border,
              color: canNext ? 'white' : C.textSoft,
              border: 'none', borderRadius: 14,
              fontSize: 16, fontWeight: 700, cursor: canNext ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: canNext ? `0 6px 20px rgba(216,78,59,0.35)` : 'none',
              transition: 'all 0.2s',
              marginTop: 24,
            }}
          >
            {isLast ? 'Get Started' : 'Continue'}
            <ChevronRight size={18} />
          </button>

          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} style={{
              background: 'none', border: 'none', color: C.textSoft,
              fontSize: 14, cursor: 'pointer', marginTop: 12, textAlign: 'center',
            }}>
              ← Back
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
