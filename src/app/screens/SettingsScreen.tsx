import { Bell, Tag, CloudUpload, Lock, Moon, HelpCircle, Info, ChevronRight, Star, Users } from "lucide-react";
import { useApp } from "../App";
import { C } from "../theme";
import type { ScreenName } from "../theme";

interface SettingRow {
  icon: typeof Bell;
  label: string;
  desc: string;
  screen: ScreenName;
  color?: string;
  badge?: string;
}

const ROWS: SettingRow[] = [
  { icon: Bell,        label: 'Notifications',    desc: 'Daily nudge preferences',       screen: 'settings-notifications', color: '#FF9500' },
  { icon: Tag,         label: 'Categories',        desc: 'Manage your life categories',   screen: 'settings-categories',    color: C.purple },
  { icon: CloudUpload, label: 'Backup & Sync',     desc: 'iCloud / Google Drive backup',  screen: 'settings-backup',        color: C.blue },
  { icon: Lock,        label: 'Passcode Lock',     desc: 'Protect your memories',         screen: 'settings-passcode',      color: C.green },
  { icon: Moon,        label: 'Appearance',        desc: 'Light, dark, or system theme',  screen: 'settings-theme',         color: '#5856D6' },
  { icon: Star,        label: 'Keepsake Premium',  desc: 'Export, family timeline & more',screen: 'keepsake',               color: C.amber, badge: 'PRO' },
  { icon: Users,       label: 'Family Timeline',   desc: 'Share with loved ones',         screen: 'family-timeline',        color: C.primary },
  { icon: HelpCircle,  label: 'Help & FAQ',         desc: 'Get support',                   screen: 'help' },
  { icon: Info,        label: 'About Last Time',   desc: 'Version, licenses & credits',   screen: 'about' },
];

export function SettingsScreen() {
  const { navigate } = useApp();

  return (
    <div style={{ background: C.bg, minHeight: '100%' }}>
      <div style={{ background: C.card, borderBottom: `1px solid ${C.border}`, padding: '52px 20px 16px' }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: C.text, margin: '0 0 2px' }}>Settings</h1>
        <p style={{ fontSize: 13, color: C.textSoft, margin: 0 }}>Customize your Last Time experience</p>
      </div>

      <div style={{ padding: '16px 16px 40px' }}>
        {/* Profile card */}
        <div style={{
          background: C.card, borderRadius: 16, padding: '16px',
          border: `1px solid ${C.border}`, marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 14,
          boxShadow: C.shadow,
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: 'linear-gradient(135deg, #D84E3B, #F5A623)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, flexShrink: 0,
          }}>
            🕰️
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, color: C.text, fontSize: 16, margin: '0 0 2px' }}>Your account</p>
            <p style={{ color: C.textSoft, fontSize: 13, margin: 0 }}>Data stored on device · private & offline</p>
          </div>
        </div>

        {/* Settings rows */}
        <div style={{ background: C.card, borderRadius: 16, overflow: 'hidden', border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
          {ROWS.map((row, i) => {
            const Icon = row.icon;
            return (
              <button
                key={row.screen}
                onClick={() => navigate(row.screen)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer',
                  borderBottom: i < ROWS.length - 1 ? `1px solid ${C.divider}` : 'none',
                  textAlign: 'left',
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: (row.color ?? C.textSoft) + '18',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon size={18} color={row.color ?? C.textSoft} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <p style={{ fontWeight: 600, color: C.text, fontSize: 14, margin: 0 }}>{row.label}</p>
                    {row.badge && (
                      <span style={{
                        background: C.amber, color: 'white', fontSize: 10,
                        fontWeight: 800, padding: '2px 7px', borderRadius: 10,
                        letterSpacing: '0.04em',
                      }}>
                        {row.badge}
                      </span>
                    )}
                  </div>
                  <p style={{ color: C.textSoft, fontSize: 12, margin: 0 }}>{row.desc}</p>
                </div>
                <ChevronRight size={16} color={C.textSoft} />
              </button>
            );
          })}
        </div>

        {/* App info */}
        <p style={{ textAlign: 'center', color: C.textSoft, fontSize: 12, marginTop: 24 }}>
          Last Time · v1.0.0 · Made with ❤️
        </p>
      </div>
    </div>
  );
}
