import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Bell, Search, Sparkles } from 'lucide-react-native';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../AppContext';
import { useAppTheme } from '../theme';
import { EntryCard } from '../components/EntryCard';
import { BottomNav } from '../components/BottomNav';

const DAILY_PROMPTS = [
  "When did you last watch the sunset together?",
  "When did you last call your dad just to talk?",
  "When did you last hold your child while they slept?",
  "When did you last tell someone you loved them without a reason?",
  "When did you last visit somewhere that feels like home?",
  "When did you last laugh until it hurt?",
  "When did you last see a friend who knew you before life got complicated?",
  "When did you last do something just for yourself?",
  "When did you last sit in silence and feel okay?",
  "When did you last write something just for you?",
  "When did you last cook something from your childhood?",
  "When did you last say goodbye properly?",
];

function getDailyPrompt() {
  const day = Math.floor(Date.now() / 86400000);
  return DAILY_PROMPTS[day % DAILY_PROMPTS.length];
}

export function HomeScreen() {
  const { moments } = useApp();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { C } = useAppTheme();
  
  const recent = moments.slice(0, 6);
  const today = format(new Date(), 'EEEE, MMMM d');
  const prompt = getDailyPrompt();

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 20, paddingBottom: 16, backgroundColor: C.card, borderBottomWidth: 1, borderBottomColor: C.border }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontSize: 12, color: C.textSoft, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 2 }}>{today}</Text>
            <Text style={{ fontSize: 28, fontWeight: '800', color: C.text, marginBottom: 2, letterSpacing: -0.3 }}>Last Time</Text>
            <Text style={{ fontSize: 13, color: C.textSoft }}>cherish what's still here</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
            <TouchableOpacity onPress={() => navigation.navigate('Search')} style={styles.iconBtn}>
              <Search size={18} color="#444" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Settings', { screen: 'notifications' })} style={styles.iconBtn}>
              <Bell size={18} color="#444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 160 }}>
        {/* Daily Nudge */}
        <View style={{ backgroundColor: C.amberLight, borderWidth: 1, borderColor: '#FDEABB', borderRadius: 16, padding: 18, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Text style={{ fontSize: 14 }}>🌅</Text>
            <Text style={{ fontSize: 11, fontWeight: '700', color: '#B8810A', letterSpacing: 0.8, textTransform: 'uppercase' }}>Today's Nudge</Text>
          </View>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#5C3D00', marginBottom: 12, lineHeight: 22 }}>"{prompt}"</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Log')} style={{ backgroundColor: '#F5A623', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 16, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Sparkles size={13} color="white" />
            <Text style={{ color: 'white', fontSize: 13, fontWeight: '700' }}>Log this moment</Text>
          </TouchableOpacity>
        </View>

        {/* Recently Logged */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <Text style={{ fontSize: 11, fontWeight: '700', color: C.textSoft, letterSpacing: 0.8, textTransform: 'uppercase' }}>Recently Logged</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Timeline')}>
            <Text style={{ color: C.primary, fontSize: 13, fontWeight: '600' }}>See all</Text>
          </TouchableOpacity>
        </View>

        {recent.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 48, paddingHorizontal: 24 }}>
            <Text style={{ fontSize: 52, marginBottom: 16 }}>📖</Text>
            <Text style={{ fontSize: 20, fontWeight: '700', color: C.text, marginBottom: 8 }}>Your story starts here</Text>
            <Text style={{ fontSize: 14, color: C.textSoft, lineHeight: 22, marginBottom: 24, textAlign: 'center' }}>Record your first "last time" — a moment you want to hold onto before it passes.</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Log')} style={{ backgroundColor: C.primary, borderRadius: 12, paddingVertical: 13, paddingHorizontal: 28, shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 4 }}>
              <Text style={{ color: 'white', fontSize: 15, fontWeight: '700' }}>Add your first moment</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ gap: 10 }}>
            {recent.map(m => (
              <EntryCard key={m.id} moment={m} onClick={() => navigation.navigate('MomentDetail', { id: m.id })} />
            ))}
          </View>
        )}
      </ScrollView>

      {/* FAB - Overlays everything, but BottomNav will sit below it */}
      <View style={{ position: 'absolute', bottom: 88, left: 0, right: 0, paddingHorizontal: 16, zIndex: 10 }}>
        <TouchableOpacity onPress={() => navigation.navigate('Log')} style={{ backgroundColor: C.primary, borderRadius: 14, padding: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, shadowColor: C.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 24, elevation: 5 }}>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>+ Log a last time</Text>
        </TouchableOpacity>
      </View>
      <BottomNav />
    </View>
  );
}

const styles = {
  iconBtn: {
    backgroundColor: '#F2EFEB',
    borderRadius: 10,
    width: 36, height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  } as const
};
