import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import { getYear, parseISO } from 'date-fns';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight } from 'lucide-react-native';
import { useApp } from '../AppContext';
import { useAppTheme, MOOD } from '../theme';
import { BottomNav } from '../components/BottomNav';

export function StatsScreen() {
  const { moments, categories } = useApp();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { C, isDark } = useAppTheme();

  const catCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    moments.forEach(m => { counts[m.category] = (counts[m.category] ?? 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [moments]);

  const moodCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    moments.forEach(m => { counts[m.mood] = (counts[m.mood] ?? 0) + 1; });
    return counts;
  }, [moments]);

  const byYear = useMemo(() => {
    const counts: Record<number, number> = {};
    moments.forEach(m => { const y = getYear(parseISO(m.date)); counts[y] = (counts[y] ?? 0) + 1; });
    return Object.entries(counts).sort(([a], [b]) => Number(a) - Number(b));
  }, [moments]);

  const maxYear = Math.max(...byYear.map(([, n]) => n), 1);
  const maxCat = Math.max(...catCounts.map(([, n]) => n), 1);
  const streak = 7;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <BlurView
        intensity={isDark ? 80 : 60}
        tint={isDark ? 'dark' : 'light'}
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100,
          backgroundColor: isDark ? 'rgba(30,30,30,0.5)' : 'rgba(255,255,255,0.7)',
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          paddingTop: insets.top + 16, paddingHorizontal: 20, paddingBottom: 16
        }}
      >
        <Text style={{ fontSize: 26, fontWeight: '800', color: C.text, marginBottom: 2 }}>Your stats</Text>
        <Text style={{ fontSize: 13, color: C.textSoft }}>A reflection of what you've captured</Text>
      </BlurView>

      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 110, padding: 16, paddingBottom: 160, gap: 16 }}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <StatCard n={moments.length} label="Moments logged" color={C.primary} emoji="📝" />
          <StatCard n={streak} label="Day streak" color={C.green} emoji="🔥" />
        </View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <StatCard n={moments.filter(m => m.hasVoiceNote).length} label="Voice notes" color={C.purple} emoji="🎙️" />
          <StatCard n={moments.filter(m => m.hasPhoto).length} label="Photos" color={C.blue} emoji="📸" />
        </View>

        <SectionCard title="Moments per year">
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-end', height: 80, paddingVertical: 4 }}>
            {byYear.map(([year, count]) => {
              const height = `${(count / maxYear) * 76}px`;
              return (
                <View key={year} style={{ flex: 1 }}>
                  <View style={{ flex: 1, backgroundColor: C.primary, opacity: 0.8, borderTopLeftRadius: 4, borderTopRightRadius: 4, width: '100%', minHeight: (count / maxYear) * 76 }} />
                  <Text style={{ fontSize: 10, color: C.textSoft, textAlign: 'center', marginTop: 4 }}>{String(year).slice(2)}</Text>
                </View>
              );
            })}
          </View>
        </SectionCard>

        <SectionCard title="By category">
          <View style={{ gap: 10 }}>
            {catCounts.map(([key, count]) => {
              const cat = categories[key];
              if (!cat) return null;
              return (
                <View key={key}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: C.textMid }}>{cat.emoji} {cat.label}</Text>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: cat.color }}>{count}</Text>
                  </View>
                  <View style={{ backgroundColor: C.border, borderRadius: 4, height: 6, width: '100%' }}>
                    <View style={{ backgroundColor: cat.color, height: '100%', borderRadius: 4, width: `${(count / maxCat) * 100}%` }} />
                  </View>
                </View>
              );
            })}
          </View>
        </SectionCard>

        <SectionCard title="Mood breakdown">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {(Object.entries(MOOD) as [string, typeof MOOD[keyof typeof MOOD]][]).map(([key, m]) => {
              const count = moodCounts[key] ?? 0;
              const mBg = isDark ? m.darkBg : m.lightBg;
              return (
                <View key={key} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: mBg, borderRadius: 20, paddingVertical: 6, paddingHorizontal: 12 }}>
                  <Text style={{ fontSize: 14 }}>{m.emoji}</Text>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: m.color }}>{count}</Text>
                  <Text style={{ fontSize: 12, color: m.color, opacity: 0.8 }}>{m.label}</Text>
                </View>
              );
            })}
          </View>
        </SectionCard>

        <View style={{ backgroundColor: '#4C2009', borderRadius: 16, padding: 18 }}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.5)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.6 }}>✨ Insight</Text>
          <Text style={{ fontSize: 15, color: 'white', fontWeight: '700', marginBottom: 6, lineHeight: 21 }}>
            You log most in "{catCounts[0] ? categories[catCounts[0][0]]?.label : 'Family'}"
          </Text>
          <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 18 }}>
            The things we record most are often the things we care about deepest.
          </Text>
        </View>
      </ScrollView>
      <BottomNav />
    </View>
  );
}


function StatCard({ n, label, color, emoji }: { n: number; label: string; color: string; emoji: string }) {
  const { C } = useAppTheme();
  return (
    <View style={{ flex: 1, backgroundColor: C.card, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: C.border, shadowColor: C.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
      <Text style={{ fontSize: 28, marginBottom: 4 }}>{emoji}</Text>
      <Text style={{ fontSize: 26, fontWeight: '800', color, marginBottom: 2 }}>{n}</Text>
      <Text style={{ fontSize: 12, color: C.textSoft }}>{label}</Text>
    </View>
  );
}

function SectionCard({ title, children, action }: { title: string; children: React.ReactNode; action?: { label: string; onPress: () => void } }) {
  const { C } = useAppTheme();
  return (
    <View style={{ backgroundColor: C.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.border, shadowColor: C.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <Text style={{ fontSize: 14, fontWeight: '700', color: C.text }}>{title}</Text>
        {action && (
          <TouchableOpacity onPress={action.onPress}>
            <Text style={{ color: C.primary, fontSize: 13, fontWeight: '600' }}>{action.label}</Text>
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  );
}
