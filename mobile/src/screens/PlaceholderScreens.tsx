import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../theme';

function GenericScreen({ title }: { title: string }) {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { C } = useAppTheme();

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ backgroundColor: C.card, borderBottomWidth: 1, borderBottomColor: C.border, paddingTop: insets.top + 16, paddingHorizontal: 16, paddingBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ backgroundColor: '#F2EFEB', borderRadius: 18, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}>
          <ArrowLeft size={18} color={C.text} />
        </TouchableOpacity>
        <Text style={{ fontSize: 17, fontWeight: '700', color: C.text }}>{title}</Text>
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ fontSize: 20, color: C.text, fontWeight: '600', marginBottom: 8 }}>{title}</Text>
        <Text style={{ color: C.textSoft, textAlign: 'center' }}>This screen is under construction in the React Native port.</Text>
      </View>
    </View>
  );
}

export const SettingsNotifications = () => <GenericScreen title="Notifications" />;
export const SettingsCategories = () => <GenericScreen title="Categories" />;
export const SettingsBackup = () => <GenericScreen title="Backup & Sync" />;
export const SettingsPasscode = () => <GenericScreen title="Passcode Lock" />;
export const SettingsTheme = () => <GenericScreen title="Appearance" />;
export const Keepsake = () => <GenericScreen title="Keepsake Premium" />;
export const FamilyTimeline = () => <GenericScreen title="Family Timeline" />;
export const Help = () => <GenericScreen title="Help & FAQ" />;
export const About = () => <GenericScreen title="About Last Time" />;
export const MemoryResurface = () => <GenericScreen title="This day last year" />;
export const AnnualSummary = () => <GenericScreen title="Annual summary" />;
