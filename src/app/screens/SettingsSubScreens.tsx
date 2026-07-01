import { useState } from "react";
import { Bell, BellOff, Sun, Moon, Smartphone, Check, Shield, Key, Tag, Plus, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useApp } from "../App";
import { C, CAT } from "../theme";
import type { CategoryType } from "../theme";
import { ScreenHeader } from "../components/ScreenHeader";

// ─── Toggle Switch ────────────────────────────────────────────────────────────

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} style={{
      width: 48, height: 28, borderRadius: 14,
      background: on ? C.primary : C.border,
      border: 'none', cursor: 'pointer', position: 'relative',
      transition: 'background 0.2s', flexShrink: 0,
    }}>
      <motion.div
        animate={{ x: on ? 22 : 2 }}
        style={{
          position: 'absolute', top: 2,
          width: 24, height: 24, borderRadius: '50%',
          background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
        }}
      />
    </button>
  );
}

function SettingRow({ icon: Icon, iconColor, label, desc, right }: {
  icon: typeof Bell; iconColor?: string; label: string; desc?: string; right: React.ReactNode;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
      borderBottom: `1px solid ${C.divider}`,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: (iconColor ?? C.textSoft) + '18',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={18} color={iconColor ?? C.textSoft} />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: 600, color: C.text, fontSize: 14, margin: 0 }}>{label}</p>
        {desc && <p style={{ color: C.textSoft, fontSize: 12, margin: 0 }}>{desc}</p>}
      </div>
      {right}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: C.card, borderRadius: 16, overflow: 'hidden',
      border: `1px solid ${C.border}`, boxShadow: C.shadow, marginBottom: 16,
    }}>
      {children}
    </div>
  );
}

// ─── Notifications ────────────────────────────────────────────────────────────

export function SettingsNotificationsScreen() {
  const { notificationsEnabled, setNotificationsEnabled } = useApp();
  const [time, setTime] = useState(() => localStorage.getItem('lt-time') || '20:00');
  const [tone, setTone] = useState(() => localStorage.getItem('lt-tone') || 'gentle');
  const [streakReminders, setStreakReminders] = useState(() => localStorage.getItem('lt-streak') === 'true');

  const updateTime = (t: string) => { setTime(t); localStorage.setItem('lt-time', t); };
  const updateTone = (t: string) => { setTone(t); localStorage.setItem('lt-tone', t); };
  const toggleStreak = () => { const next = !streakReminders; setStreakReminders(next); localStorage.setItem('lt-streak', String(next)); };

  return (
    <div style={{ background: C.bg, minHeight: '100%' }}>
      <ScreenHeader title="Notifications" />
      <div style={{ padding: '16px 16px 40px' }}>
        <Card>
          <SettingRow icon={Bell} iconColor="#FF9500" label="Daily nudge" desc="One soft reminder each evening" right={
            <Toggle on={notificationsEnabled} onToggle={() => setNotificationsEnabled(!notificationsEnabled)} />
          } />
          {notificationsEnabled && (
            <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.divider}` }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: C.textSoft, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Reminder time
              </p>
              <input type="time" value={time} onChange={e => updateTime(e.target.value)} style={{
                background: '#F2EFEB', border: 'none', borderRadius: 10,
                padding: '10px 14px', fontSize: 15, color: C.text, outline: 'none',
                fontFamily: 'inherit',
              }} />
            </div>
          )}
          <SettingRow icon={BellOff} label="Streak reminders" desc="Remind me if I haven't logged in 3 days" right={
            <Toggle on={streakReminders} onToggle={toggleStreak} />
          } />
        </Card>

        {notificationsEnabled && (
          <Card>
            <div style={{ padding: '12px 16px' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: C.text, margin: '0 0 12px' }}>Notification style</p>
              {[
                { val: 'gentle', label: 'Gentle', desc: 'A quiet nudge, no urgency' },
                { val: 'prompt', label: 'Prompt', desc: 'Includes today\'s nudge question' },
                { val: 'minimal', label: 'Minimal', desc: 'Just the app name' },
              ].map(opt => (
                <button key={opt.val} onClick={() => updateTone(opt.val)} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px',
                  background: tone === opt.val ? C.primaryLight : 'none',
                  border: `1.5px solid ${tone === opt.val ? C.primary : 'transparent'}`,
                  borderRadius: 10, cursor: 'pointer', textAlign: 'left', marginBottom: 6,
                }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${tone === opt.val ? C.primary : C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {tone === opt.val && <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.primary }} />}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, color: C.text, fontSize: 14, margin: 0 }}>{opt.label}</p>
                    <p style={{ color: C.textSoft, fontSize: 12, margin: 0 }}>{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        )}

        <div style={{ background: C.amberLight, border: `1px solid #FDEABB`, borderRadius: 14, padding: '14px 16px' }}>
          <p style={{ fontSize: 13, color: '#7A5600', margin: 0, lineHeight: 1.6 }}>
            💛 Last Time will never send push notifications for streaks, achievements, or social pressure. Just one gentle evening reminder.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Categories ───────────────────────────────────────────────────────────────

export function SettingsCategoriesScreen() {
  const { selectedCategories, setSelectedCategories } = useApp();

  const toggle = (c: CategoryType) => {
    setSelectedCategories(
      selectedCategories.includes(c)
        ? selectedCategories.filter(x => x !== c)
        : [...selectedCategories, c]
    );
  };

  return (
    <div style={{ background: C.bg, minHeight: '100%' }}>
      <ScreenHeader title="Life categories" />
      <div style={{ padding: '16px 16px 40px' }}>
        <p style={{ fontSize: 14, color: C.textSoft, margin: '0 0 16px', lineHeight: 1.5 }}>
          Choose the life areas that matter to you. Enabled categories will appear when logging moments.
        </p>
        <Card>
          {(Object.entries(CAT) as [CategoryType, typeof CAT[CategoryType]][]).map(([key, cat], i, arr) => {
            const on = selectedCategories.includes(key);
            return (
              <div key={key} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                borderBottom: i < arr.length - 1 ? `1px solid ${C.divider}` : 'none',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, background: cat.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                }}>
                  {cat.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, color: C.text, fontSize: 14, margin: 0 }}>{cat.label}</p>
                  <p style={{ color: C.textSoft, fontSize: 12, margin: 0 }}>
                    {on ? 'Enabled' : 'Hidden from log screen'}
                  </p>
                </div>
                <Toggle on={on} onToggle={() => toggle(key)} />
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
}

// ─── Backup ───────────────────────────────────────────────────────────────────

export function SettingsBackupScreen() {
  const { moments } = useApp();
  const [syncing, setSyncing] = useState(false);
  const [lastSync] = useState('Never');
  
  const [autoBackup, setAutoBackup] = useState(() => localStorage.getItem('lt-autobackup') === 'true');
  const toggleAutoBackup = () => {
    const next = !autoBackup;
    setAutoBackup(next);
    localStorage.setItem('lt-autobackup', String(next));
  };
  
  const [gdriveConnected, setGdriveConnected] = useState(() => localStorage.getItem('lt-gdrive') === 'true');
  const toggleGdrive = () => {
    if (gdriveConnected) {
      setGdriveConnected(false);
      localStorage.setItem('lt-gdrive', 'false');
    } else {
      setTimeout(() => {
        setGdriveConnected(true);
        localStorage.setItem('lt-gdrive', 'true');
      }, 600);
    }
  };

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(moments));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "last-time-backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const exportPDF = () => {
    alert("Export to PDF is a Keepsake Premium feature. Upgrade to unlock beautiful memory books!");
  };

  return (
    <div style={{ background: C.bg, minHeight: '100%' }}>
      <ScreenHeader title="Backup & Sync" />
      <div style={{ padding: '16px 16px 40px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #4C79FF, #0051D4)',
          borderRadius: 16, padding: '20px', marginBottom: 16, textAlign: 'center',
        }}>
          <p style={{ fontSize: 36, margin: '0 0 8px' }}>☁️</p>
          <p style={{ color: 'white', fontWeight: 700, fontSize: 16, margin: '0 0 4px' }}>iCloud Backup</p>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: '0 0 16px' }}>Last synced: {lastSync}</p>
          <button onClick={() => { setSyncing(true); setTimeout(() => setSyncing(false), 2000); }} style={{
            background: 'white', color: '#4C79FF', border: 'none',
            borderRadius: 10, padding: '10px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
          }}>
            {syncing ? 'Syncing...' : 'Sync now'}
          </button>
        </div>

        <Card>
          <SettingRow icon={Shield} iconColor={C.green} label="Auto-backup" desc="Back up daily when on Wi-Fi" right={
            <Toggle on={autoBackup} onToggle={toggleAutoBackup} />
          } />
          <SettingRow icon={Shield} iconColor={C.blue} label="Google Drive" desc="Connect your Google account" right={
            <button onClick={toggleGdrive} style={{ background: C.primary + '15', color: C.primary, border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              {gdriveConnected ? 'Disconnect' : 'Connect'}
            </button>
          } />
        </Card>

        <Card>
          <div style={{ padding: '14px 16px' }}>
            <p style={{ fontWeight: 700, color: C.text, fontSize: 14, margin: '0 0 12px' }}>Export your memories</p>
            {[
              { label: 'Export as JSON', desc: 'All data, machine-readable', emoji: '📄' },
              { label: 'Export as PDF', desc: 'Beautiful keepsake book', emoji: '📖', pro: true },
            ].map(opt => (
              <div key={opt.label} onClick={opt.label.includes('JSON') ? exportJSON : exportPDF} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px', borderRadius: 10, marginBottom: 6,
                background: '#F7F5F2', cursor: 'pointer'
              }}>
                <span style={{ fontSize: 20 }}>{opt.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <p style={{ fontWeight: 600, color: C.text, fontSize: 14, margin: 0 }}>{opt.label}</p>
                    {opt.pro && (
                      <span style={{ background: C.amber, color: 'white', fontSize: 10, fontWeight: 800, padding: '1px 6px', borderRadius: 8 }}>PRO</span>
                    )}
                  </div>
                  <p style={{ color: C.textSoft, fontSize: 12, margin: 0 }}>{opt.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Passcode ─────────────────────────────────────────────────────────────────

export function SettingsPasscodeScreen() {
  const { passcodeEnabled, setPasscodeEnabled } = useApp();
  const [entered, setEntered] = useState('');
  const [step, setStep] = useState<'toggle' | 'set' | 'confirm'>('toggle');
  
  const [biometrics, setBiometrics] = useState(() => localStorage.getItem('lt-biometrics') === 'true');
  const toggleBiometrics = () => {
    const next = !biometrics;
    setBiometrics(next);
    localStorage.setItem('lt-biometrics', String(next));
  };

  const handleDigit = (d: string) => {
    if (entered.length >= 4) return;
    const next = entered + d;
    setEntered(next);
    if (next.length === 4) {
      if (step === 'set') setStep('confirm');
      setEntered('');
    }
  };

  return (
    <div style={{ background: C.bg, minHeight: '100%' }}>
      <ScreenHeader title="Passcode Lock" />
      <div style={{ padding: '16px 16px 40px' }}>
        <Card>
          <SettingRow icon={Lock} iconColor={C.green} label="Passcode lock" desc="Require a 4-digit code to open the app" right={
            <Toggle on={passcodeEnabled} onToggle={() => {
              setPasscodeEnabled(!passcodeEnabled);
              if (!passcodeEnabled) setStep('set');
              else setStep('toggle');
            }} />
          } />
          <SettingRow icon={Key} iconColor={C.purple} label="Face ID / biometrics" desc="Use biometrics to unlock" right={
            <Toggle on={biometrics} onToggle={toggleBiometrics} />
          } />
        </Card>

        {(step === 'set' || step === 'confirm') && (
          <div style={{ background: C.card, borderRadius: 16, padding: '24px 20px', border: `1px solid ${C.border}`, textAlign: 'center' }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: '0 0 20px' }}>
              {step === 'set' ? 'Set a 4-digit passcode' : 'Confirm your passcode'}
            </p>
            {/* Dots */}
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginBottom: 28 }}>
              {[0, 1, 2, 3].map(i => (
                <div key={i} style={{
                  width: 14, height: 14, borderRadius: '50%',
                  background: i < entered.length ? C.primary : C.border,
                  transition: 'background 0.15s',
                }} />
              ))}
            </div>
            {/* Keypad */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, maxWidth: 240, margin: '0 auto' }}>
              {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((d, i) => (
                <button key={i} onClick={() => d === '⌫' ? setEntered(e => e.slice(0, -1)) : d && handleDigit(d)} style={{
                  height: 56, borderRadius: 14,
                  background: d ? '#F2EFEB' : 'transparent',
                  border: 'none', fontSize: 20, fontWeight: 700, color: C.text, cursor: d ? 'pointer' : 'default',
                }}>
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Theme ────────────────────────────────────────────────────────────────────

export function SettingsThemeScreen() {
  const { themeChoice, setThemeChoice } = useApp();
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('lt-fontsize') || 'Medium');
  const updateFontSize = (s: string) => {
    setFontSize(s);
    localStorage.setItem('lt-fontsize', s);
  };

  const themes = [
    { val: 'light' as const, icon: Sun, label: 'Light', desc: 'Clean cream background', color: '#F5A623' },
    { val: 'dark' as const,  icon: Moon, label: 'Dark', desc: 'Easy on the eyes at night', color: '#5856D6' },
    { val: 'system' as const, icon: Smartphone, label: 'System', desc: 'Follow device setting', color: C.textSoft },
  ];

  return (
    <div style={{ background: C.bg, minHeight: '100%' }}>
      <ScreenHeader title="Appearance" />
      <div style={{ padding: '16px 16px 40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {themes.map(t => {
            const Icon = t.icon;
            const sel = themeChoice === t.val;
            return (
              <button key={t.val} onClick={() => setThemeChoice(t.val)} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '16px',
                background: sel ? C.primaryLight : C.card,
                border: `2px solid ${sel ? C.primary : C.border}`,
                borderRadius: 14, cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.15s',
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: t.color + '20',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={22} color={t.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, color: C.text, fontSize: 15, margin: 0 }}>{t.label}</p>
                  <p style={{ color: C.textSoft, fontSize: 13, margin: 0 }}>{t.desc}</p>
                </div>
                {sel && (
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={13} color="white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: 20, background: C.card, borderRadius: 14, padding: '14px 16px', border: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: C.text, margin: '0 0 10px' }}>Font size</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Small', 'Medium', 'Large'].map((s) => (
              <button key={s} onClick={() => updateFontSize(s)} style={{
                flex: 1, padding: '10px',
                background: fontSize === s ? C.primary : C.bg,
                color: fontSize === s ? 'white' : C.textMid,
                border: `1px solid ${fontSize === s ? C.primary : C.border}`,
                borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}>{s}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
