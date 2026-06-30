import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Bell, Tag, CloudUpload, Lock, Moon, HelpCircle, Info, ChevronRight, Star, Users } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../theme';
import { ScreenName } from '../theme';

interface SettingRow {
  icon: any;
  label: string;
  desc: string;
  screen: ScreenName;
  color?: string;
  badge?: string;
}

const ROWS: SettingRow[] = [
  { icon: Bell,        label: 'Notifications',    desc: 'Daily nudge preferences',       screen: 'settings-notifications', color: '#FF9500' },
  { icon: Tag,         label: 'Categories',        desc: 'Manage your life categories',   screen: 'settings-categories',    color: '#9B5EDB' }, // C.purple
  { icon: CloudUpload, label: 'Backup & Sync',     desc: 'iCloud / Google Drive backup',  screen: 'settings-backup',        color: '#4C79FF' }, // C.blue
  { icon: Lock,        label: 'Passcode Lock',     desc: 'Protect your memories',         screen: 'settings-passcode',      color: '#2BB57A' }, // C.green
  { icon: Moon,        label: 'Appearance',        desc: 'Light, dark, or system theme',  screen: 'settings-theme',         color: '#5856D6' },
  { icon: Star,        label: 'Keepsake Premium',  desc: 'Export, family timeline & more',screen: 'keepsake',               color: '#F5A623', badge: 'PRO' }, // C.amber
  { icon: Users,       label: 'Family Timeline',   desc: 'Share with loved ones',         screen: 'family-timeline',        color: '#D84E3B' }, // C.primary
  { icon: HelpCircle,  label: 'Help & FAQ',         desc: 'Get support',                   screen: 'help' },
  { icon: Info,        label: 'About Last Time',   desc: 'Version, licenses & credits',   screen: 'about' },
];

export function SettingsScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { C } = useAppTheme();

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ backgroundColor: C.card, borderBottomWidth: 1, borderBottomColor: C.border, paddingTop: insets.top + 16, paddingHorizontal: 20, paddingBottom: 16 }}>
        <Text style={{ fontSize: 26, fontWeight: '800', color: C.text, marginBottom: 2 }}>Settings</Text>
        <Text style={{ fontSize: 13, color: C.textSoft }}>Customize your Last Time experience</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        {/* Profile card */}
        <View style={{
          backgroundColor: C.card, borderRadius: 16, padding: 16,
          borderWidth: 1, borderColor: C.border, marginBottom: 16,
          flexDirection: 'row', alignItems: 'center', gap: 14,
          shadowColor: C.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2
        }}>
          <View style={{
            width: 52, height: 52, borderRadius: 26,
            backgroundColor: C.primary, // Normally gradient
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ fontSize: 22 }}>🕰️</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: '700', color: C.text, fontSize: 16, marginBottom: 2 }}>Your account</Text>
            <Text style={{ color: C.textSoft, fontSize: 13 }}>Data stored on device · private & offline</Text>
          </View>
        </View>

        {/* Settings rows */}
        <View style={{ backgroundColor: C.card, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: C.border, shadowColor: C.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
          {ROWS.map((row, i) => {
            const Icon = row.icon;
            const iconColor = row.color ?? C.textSoft;
            // Fake rgba background via hex
            const bgHex = (iconColor + '18').substring(0, 9);
            return (
              <TouchableOpacity
                key={row.screen}
                onPress={() => navigation.navigate(row.screen.replace('settings-', '').replace(/-([a-z])/g, (g) => g[1].toUpperCase()).replace(/^[a-z]/, (g) => g.toUpperCase()))}
                style={{
                  flexDirection: 'row', alignItems: 'center', gap: 14,
                  paddingVertical: 14, paddingHorizontal: 16,
                  borderBottomWidth: i < ROWS.length - 1 ? 1 : 0,
                  borderBottomColor: C.divider,
                }}
              >
                <View style={{
                  width: 36, height: 36, borderRadius: 10,
                  backgroundColor: bgHex,
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={18} color={iconColor} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ fontWeight: '600', color: C.text, fontSize: 14 }}>{row.label}</Text>
                    {row.badge && (
                      <View style={{ backgroundColor: C.amber, paddingVertical: 2, paddingHorizontal: 7, borderRadius: 10 }}>
                        <Text style={{ color: 'white', fontSize: 10, fontWeight: '800', letterSpacing: 0.4 }}>{row.badge}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={{ color: C.textSoft, fontSize: 12, marginTop: 2 }}>{row.desc}</Text>
                </View>
                <ChevronRight size={16} color={C.textSoft} />
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={{ textAlign: 'center', color: C.textSoft, fontSize: 12, marginTop: 24 }}>
          Last Time · v1.0.0 · Made with ❤️
        </Text>
      </ScrollView>
    </View>
  );
}
