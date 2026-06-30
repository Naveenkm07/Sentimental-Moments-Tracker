import React, { useState } from 'react';
import { View, Text, ScrollView, Modal, TouchableOpacity, TextInput, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Moon, Bell, CloudUpload, Lock, HelpCircle, Star, Users, Info, Plus, ChevronDown, MessageCircle, FileText, Share2, Mail, ExternalLink, X } from 'lucide-react-native';
import { useAppTheme, CAT } from '../theme';
import { useApp } from '../AppContext';
import { ScreenHeader } from '../components/ScreenHeader';
import { SettingsGroup, SettingsRow } from '../components/SettingsList';
import { LiquidButton } from '../components/LiquidButton';
import { PasscodeScreen } from './PasscodeScreen';
import { Category } from '../theme';

export const SettingsAppearance = () => {
  const { C } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { themeChoice, setThemeChoice } = useApp();

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScreenHeader title="Appearance" />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: insets.top + 100, paddingHorizontal: 16, paddingBottom: 120 }}>
        <SettingsGroup footer="Last Time will automatically match your device's appearance.">
          <SettingsRow label="System" value={themeChoice === 'system' ? '✓' : ''} onPress={() => setThemeChoice('system')} />
          <SettingsRow label="Light" value={themeChoice === 'light' ? '✓' : ''} onPress={() => setThemeChoice('light')} />
          <SettingsRow label="Dark" value={themeChoice === 'dark' ? '✓' : ''} onPress={() => setThemeChoice('dark')} isLast />
        </SettingsGroup>

        <SettingsGroup title="App Icon">
          <SettingsRow label="Default Theme" type="link" isLast />
        </SettingsGroup>
      </ScrollView>
    </View>
  );
};

export const SettingsNotifications = () => {
  const { C } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { notificationsEnabled, setNotificationsEnabled } = useApp();
  const [resurface, setResurface] = useState(true);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScreenHeader title="Notifications" />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: insets.top + 100, paddingHorizontal: 16, paddingBottom: 120 }}>
        <SettingsGroup footer="Receive a gentle reminder to log a moment before your day ends.">
          <SettingsRow
            icon={<Bell size={16} color="white" />} iconBg="#FF9500"
            label="Daily Nudge" type="toggle" toggleValue={notificationsEnabled} onToggle={setNotificationsEnabled} isLast
          />
        </SettingsGroup>
        <SettingsGroup footer="Get notified when it's the anniversary of a special memory.">
          <SettingsRow
            icon={<Star size={16} color="white" />} iconBg="#F5A623"
            label="Memory Resurfacing" type="toggle" toggleValue={resurface} onToggle={setResurface} isLast
          />
        </SettingsGroup>
      </ScrollView>
    </View>
  );
};

export const SettingsBackup = () => {
  const { C, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [syncing, setSyncing] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScreenHeader title="Backup & Sync" />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: insets.top + 100, paddingHorizontal: 16, paddingBottom: 120 }}>
        <View style={{ alignItems: 'center', marginBottom: 24, marginTop: 12 }}>
          <View style={{ width: 80, height: 80, borderRadius: 24, backgroundColor: isDark ? '#222' : '#F5F5F5', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <CloudUpload size={40} color={C.blue} />
          </View>
          <Text style={{ fontSize: 20, fontWeight: '700', color: C.text, marginBottom: 8 }}>Google Drive Backup</Text>
          <Text style={{ color: C.textSoft, textAlign: 'center', marginHorizontal: 32, lineHeight: 20 }}>
            Your memories are encrypted and synced to your personal cloud storage.
          </Text>
        </View>
        <SettingsGroup>
          <SettingsRow label="Account" value="alex@example.com" type="link" />
          <SettingsRow label="Auto-Sync" type="toggle" toggleValue={true} onToggle={() => { }} />
          <SettingsRow label="Storage Used" value="12 MB" type="link" />
          <SettingsRow label="Last Backup" value="Today, 9:41 AM" type="link" isLast />
        </SettingsGroup>

        <SettingsGroup>
          <SettingsRow label={syncing ? "Syncing..." : "Sync Now"} type="button" onPress={() => { setSyncing(true); setTimeout(() => setSyncing(false), 2000); }} />
          <SettingsRow label="Restore from Backup" type="button" isLast />
        </SettingsGroup>
      </ScrollView>
    </View>
  );
};

export const SettingsPasscode = () => {
  const { C } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { passcodeEnabled } = useApp();
  const [biometrics, setBiometrics] = useState(true);
  const [modalMode, setModalMode] = useState<'set' | 'change' | 'remove' | null>(null);

  const handleToggle = () => {
    if (passcodeEnabled) setModalMode('remove');
    else setModalMode('set');
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScreenHeader title="Passcode Lock" />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: insets.top + 100, paddingHorizontal: 16, paddingBottom: 120 }}>
        <SettingsGroup footer="Require a PIN to open the app and view your memories.">
          <SettingsRow
            icon={<Lock size={16} color="white" />} iconBg="#2BB57A"
            label="Require Passcode" type="toggle" toggleValue={passcodeEnabled} onToggle={handleToggle} isLast={!passcodeEnabled}
          />
          {passcodeEnabled && <SettingsRow label="Unlock with Face ID" type="toggle" toggleValue={biometrics} onToggle={setBiometrics} />}
          {passcodeEnabled && <SettingsRow label="Change Passcode" type="link" onPress={() => setModalMode('change')} />}
          {passcodeEnabled && <SettingsRow label="Require Immediately" value="After 1 minute" type="link" isLast />}
        </SettingsGroup>
      </ScrollView>

      <Modal visible={modalMode !== null} animationType="slide" transparent>
        {modalMode && (
          <PasscodeScreen mode={modalMode} onSuccess={() => setModalMode(null)} onCancel={() => setModalMode(null)} />
        )}
      </Modal>
    </View>
  );
};

export const SettingsCategories = () => {
  const { C, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { categories, addCategory, removeCategory } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newEmoji, setNewEmoji] = useState('');

  const handleCreate = () => {
    if (!newLabel.trim() || !newEmoji.trim()) return;
    const id = newLabel.trim().toLowerCase().replace(/\s+/g, '-');
    const colorOpts = [
      { color: '#FF7040', lightBg: '#FFF2EC', darkBg: '#3D1C17' },
      { color: '#4C79FF', lightBg: '#EEF3FF', darkBg: '#1A243D' },
      { color: '#9B5EDB', lightBg: '#F5F0FF', darkBg: '#2C1A3D' },
      { color: '#2BB57A', lightBg: '#E8FFF4', darkBg: '#1A3D2C' },
    ];
    const picked = colorOpts[Math.floor(Math.random() * colorOpts.length)];
    
    addCategory(id, {
      emoji: newEmoji.trim(),
      label: newLabel.trim(),
      ...picked
    });
    setNewLabel('');
    setNewEmoji('');
    setShowModal(false);
  };

  const defaultKeys = ['parenthood', 'family', 'friendships', 'travel', 'self', 'milestones', 'other'];

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScreenHeader title="Categories" />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: insets.top + 100, paddingHorizontal: 16, paddingBottom: 120 }}>
        <SettingsGroup title="Active Categories" footer="You can drag to reorder categories. Tap a custom category to delete it.">
          {(Object.entries(categories) as [string, Category][]).map(([key, cat], i, arr) => {
            const isCustom = !defaultKeys.includes(key);
            return (
              <SettingsRow 
                key={key}
                icon={<Text style={{ fontSize: 16 }}>{cat.emoji}</Text>}
                iconBg={isDark ? cat.darkBg : cat.lightBg}
                label={cat.label}
                type="link"
                isLast={i === arr.length - 1}
                onPress={() => {
                  if (isCustom) {
                    removeCategory(key);
                  }
                }}
              />
            );
          })}
        </SettingsGroup>
        <LiquidButton onPress={() => setShowModal(true)} activeScale={0.97} style={{ backgroundColor: C.card, borderRadius: 12, padding: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: C.border }}>
          <Plus size={20} color={C.primary} />
          <Text style={{ fontSize: 16, fontWeight: '600', color: C.primary }}>Create New Category</Text>
        </LiquidButton>
      </ScrollView>

      <Modal visible={showModal} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: C.card, padding: 24, paddingBottom: insets.bottom + 24, borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: C.text }}>New Category</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}><X color={C.textSoft} /></TouchableOpacity>
            </View>
            <Text style={{ color: C.textSoft, marginBottom: 8, fontSize: 12, fontWeight: '600', textTransform: 'uppercase' }}>Emoji</Text>
            <TextInput value={newEmoji} onChangeText={setNewEmoji} placeholder="🎨" style={{ backgroundColor: C.bg, padding: 16, borderRadius: 12, fontSize: 16, marginBottom: 16, color: C.text }} />
            <Text style={{ color: C.textSoft, marginBottom: 8, fontSize: 12, fontWeight: '600', textTransform: 'uppercase' }}>Name</Text>
            <TextInput value={newLabel} onChangeText={setNewLabel} placeholder="Hobbies" style={{ backgroundColor: C.bg, padding: 16, borderRadius: 12, fontSize: 16, marginBottom: 24, color: C.text }} />
            <LiquidButton onPress={handleCreate} style={{ backgroundColor: C.primary, padding: 16, borderRadius: 12, alignItems: 'center' }}>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>Save Category</Text>
            </LiquidButton>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export const Keepsake = () => {
  const { C } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScreenHeader title="Premium" />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: insets.top + 100, paddingHorizontal: 16, paddingBottom: 120 }}>
        <View style={{ backgroundColor: '#F5A623', borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 24 }}>
          <Star size={48} color="white" fill="white" style={{ marginBottom: 16 }} />
          <Text style={{ fontSize: 28, fontWeight: '800', color: 'white', marginBottom: 8 }}>Keepsake PRO</Text>
          <Text style={{ color: 'rgba(255,255,255,0.9)', textAlign: 'center', fontSize: 15, lineHeight: 22, marginBottom: 24 }}>
            Unlock unlimited photos, long voice notes, and beautiful PDF exports of your family memories.
          </Text>
          <LiquidButton style={{ backgroundColor: 'white', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 20, width: '100%', alignItems: 'center' }}>
            <Text style={{ color: '#F5A623', fontSize: 16, fontWeight: '800' }}>Upgrade for $2.99/mo</Text>
          </LiquidButton>
        </View>
        <SettingsGroup>
          <SettingsRow label="Restore Purchases" type="button" isLast />
        </SettingsGroup>
      </ScrollView>
    </View>
  );
};

export const FamilyTimeline = () => {
  const { C } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScreenHeader title="Family Timeline" />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: insets.top + 100, paddingHorizontal: 16, paddingBottom: 120 }}>
        <View style={{ backgroundColor: C.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: C.border, marginBottom: 24, alignItems: 'center' }}>
          <Users size={32} color={C.primary} style={{ marginBottom: 12 }} />
          <Text style={{ fontSize: 18, fontWeight: '700', color: C.text, marginBottom: 6 }}>Invite Family</Text>
          <Text style={{ color: C.textSoft, textAlign: 'center', fontSize: 14, lineHeight: 20, marginBottom: 16 }}>
            Share a secure, private timeline with your partner or family members.
          </Text>
          <LiquidButton style={{ backgroundColor: C.primary, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 14 }}>
            <Text style={{ color: 'white', fontWeight: '700' }}>Generate Invite Link</Text>
          </LiquidButton>
        </View>

        <SettingsGroup title="Timeline Settings" footer="Only invited members can view and add to this timeline.">
          <SettingsRow label="Member Approvals" type="toggle" toggleValue={true} onToggle={() => { }} />
          <SettingsRow label="Notification Alerts" type="toggle" toggleValue={true} onToggle={() => { }} isLast />
        </SettingsGroup>

        <SettingsGroup title="Members">
          <SettingsRow label="You (Owner)" type="link" />
          <SettingsRow label="Sarah" value="Invited" type="link" isLast />
        </SettingsGroup>
      </ScrollView>
    </View>
  );
};

export const Help = () => {
  const { C, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const FAQS = [
    { q: "Where is my data stored?", a: "Your moments are stored locally on your device by default. This means they are completely private to you. If you enable Cloud Backup in Settings, they will be securely encrypted and synced to your personal cloud." },
    { q: "Can I export my memories?", a: "Yes! If you upgrade to Keepsake Premium, you can export all of your memories to a beautifully formatted PDF document or a CSV file." },
    { q: "How do I add a photo?", a: "When logging a new memory, click the 'Add photo URL' button at the top of the screen to attach a picture." },
    { q: "Is the app free?", a: "The core journaling features will always be free. We offer a Premium upgrade for advanced features like family timelines and exports." }
  ];

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScreenHeader title="Help & FAQ" />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: insets.top + 100, paddingHorizontal: 16, paddingBottom: 120 }}>

        <View style={{ alignItems: 'center', marginBottom: 24, marginTop: 12 }}>
          <View style={{ width: 80, height: 80, borderRadius: 24, backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <HelpCircle size={40} color={C.primary} />
          </View>
          <Text style={{ fontSize: 20, fontWeight: '700', color: C.text, marginBottom: 8 }}>How can we help?</Text>
        </View>

        <SettingsGroup title="Frequently Asked Questions">
          {FAQS.map((faq, i) => (
            <View key={i} style={{ borderBottomWidth: i === FAQS.length - 1 ? 0 : 1, borderBottomColor: C.divider }}>
              <LiquidButton onPress={() => setExpandedFaq(expandedFaq === i ? null : i)} activeScale={0.98} style={{ padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'transparent' }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: C.text, flex: 1, paddingRight: 16 }}>{faq.q}</Text>
                <ChevronDown size={18} color={C.textSoft} style={{ transform: [{ rotate: expandedFaq === i ? '180deg' : '0deg' }] }} />
              </LiquidButton>
              {expandedFaq === i && (
                <View style={{ paddingHorizontal: 16, paddingBottom: 16, paddingTop: 0 }}>
                  <Text style={{ fontSize: 14, color: C.textSoft, lineHeight: 22 }}>{faq.a}</Text>
                </View>
              )}
            </View>
          ))}
        </SettingsGroup>

        <SettingsGroup title="Support">
          <SettingsRow icon={<Mail size={16} color="white" />} iconBg="#4C79FF" label="Contact Support" type="link" onPress={() => Linking.openURL('mailto:support@example.com?subject=Support Request')} />
          <SettingsRow icon={<MessageCircle size={16} color="white" />} iconBg="#9B5EDB" label="Request a Feature" type="link" onPress={() => Linking.openURL('mailto:support@example.com?subject=Feature Request')} />
          <SettingsRow icon={<Star size={16} color="white" />} iconBg="#F5A623" label="Rate on Google Play" type="link" onPress={() => Linking.openURL('market://details?id=com.example.lasttime')} isLast />
        </SettingsGroup>
      </ScrollView>
    </View>
  );
};

export const About = () => {
  const { C } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [doc, setDoc] = useState<'terms' | 'privacy' | null>(null);

  const MOCK_TEXT = "This is a placeholder for the legal documentation required for the Google Play Store. In a production app, this would contain the full legal text for the Terms of Service or Privacy Policy, outlining data collection, usage, and user rights in detail.";

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScreenHeader title="About" />

      {doc ? (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: C.bg, zIndex: 200, paddingTop: insets.top }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: C.border }}>
            <Text style={{ flex: 1, fontSize: 18, fontWeight: '700', color: C.text }}>
              {doc === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
            </Text>
            <LiquidButton onPress={() => setDoc(null)} style={{ padding: 8, backgroundColor: C.card, borderRadius: 20 }}>
              <X size={20} color={C.text} />
            </LiquidButton>
          </View>
          <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
            <Text style={{ fontSize: 14, color: C.textSoft, lineHeight: 24, marginBottom: 16 }}>Last Updated: October 2023</Text>
            <Text style={{ fontSize: 15, color: C.text, lineHeight: 24 }}>{MOCK_TEXT}{'\n\n'}{MOCK_TEXT}{'\n\n'}{MOCK_TEXT}</Text>
          </ScrollView>
        </View>
      ) : null}

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: insets.top + 100, paddingHorizontal: 16, paddingBottom: 120 }}>
        <View style={{ alignItems: 'center', marginVertical: 32 }}>
          <Text style={{ fontSize: 64, marginBottom: 16 }}>🕰️</Text>
          <Text style={{ fontSize: 22, fontWeight: '800', color: C.text, marginBottom: 4 }}>Last Time</Text>
          <Text style={{ color: C.textSoft, fontSize: 14, marginBottom: 24 }}>Version 1.0.0 (Build 42)</Text>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <LiquidButton style={{ backgroundColor: '#1DA1F2', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Share2 size={14} color="white" />
              <Text style={{ color: 'white', fontWeight: '700', fontSize: 13 }}>Follow</Text>
            </LiquidButton>
            <LiquidButton style={{ backgroundColor: '#E1306C', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <ExternalLink size={14} color="white" />
              <Text style={{ color: 'white', fontWeight: '700', fontSize: 13 }}>Instagram</Text>
            </LiquidButton>
          </View>
        </View>

        <SettingsGroup title="Legal">
          <SettingsRow icon={<FileText size={16} color="white" />} iconBg="#8A8A8A" label="Terms of Service" type="button" onPress={() => setDoc('terms')} />
          <SettingsRow icon={<Lock size={16} color="white" />} iconBg="#2BB57A" label="Privacy Policy" type="button" onPress={() => setDoc('privacy')} />
          <SettingsRow icon={<Info size={16} color="white" />} iconBg="#4C79FF" label="Open Source Licenses" type="button" onPress={() => { }} isLast />
        </SettingsGroup>

        <Text style={{ textAlign: 'center', fontSize: 12, color: C.textSoft, marginTop: 20 }}>
          Made with ❤️ for memories.
        </Text>
      </ScrollView>
    </View>
  );
};

// Aliases for missing ones
export const SettingsTheme = SettingsAppearance;
export const MemoryResurface = SettingsNotifications;
export const AnnualSummary = () => <Help />; // Placeholder reuse
