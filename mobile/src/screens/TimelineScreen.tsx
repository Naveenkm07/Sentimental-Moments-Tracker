import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import { getYear, parseISO } from 'date-fns';
import { useApp } from '../AppContext';
import { useAppTheme, CategoryType } from '../theme';
import { TimelineRow } from '../components/EntryCard';
import { BottomNav } from '../components/BottomNav';
import { LiquidButton } from '../components/LiquidButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FILTERS: { label: string; value: CategoryType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Parenthood', value: 'parenthood' },
  { label: 'Family', value: 'family' },
  { label: 'Friends', value: 'friendships' },
  { label: 'Travel', value: 'travel' },
  { label: 'Self', value: 'self' },
  { label: 'Milestones', value: 'milestones' },
  { label: 'Other', value: 'other' },
];

export function TimelineScreen() {
  const { moments, categories } = useApp();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { C, isDark } = useAppTheme();
  
  const [filter, setFilter] = useState<CategoryType | 'all'>('all');

  const filtered = useMemo(() =>
    filter === 'all' ? moments : moments.filter(m => m.category === filter),
    [moments, filter]
  );

  const byYear = useMemo(() => {
    const map: Record<number, typeof filtered> = {};
    filtered.forEach(m => {
      const y = getYear(parseISO(m.date));
      if (!map[y]) map[y] = [];
      map[y].push(m);
    });
    return Object.entries(map).sort(([a], [b]) => Number(b) - Number(a));
  }, [filtered]);

  const totalVoice = moments.filter(m => m.hasVoiceNote).length;
  const totalTags = [...new Set(moments.map(m => m.category))].length;

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
          paddingTop: insets.top + 16, paddingHorizontal: 20
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <View>
            <Text style={{ fontSize: 26, fontWeight: '800', color: C.text, marginBottom: 2 }}>Your lasts</Text>
            <Text style={{ fontSize: 13, color: C.textSoft }}>{moments.length} moments logged</Text>
          </View>
          <LiquidButton onPress={() => navigation.navigate('Stats')} activeScale={0.93} style={{
            backgroundColor: isDark ? '#3D1C17' : '#FFF0EE',
            borderRadius: 10, paddingVertical: 8, paddingHorizontal: 14,
            marginTop: 4,
          }}>
            <Text style={{ color: C.primary, fontSize: 13, fontWeight: '700' }}>View stats</Text>
          </LiquidButton>
        </View>

        {/* Stats Row */}
        <View style={{ flexDirection: 'row', gap: 1, marginBottom: 16, backgroundColor: C.border, borderRadius: 12, overflow: 'hidden' }}>
          {[
            { n: moments.length, label: 'moments\nlogged' },
            { n: totalTags, label: 'tags\ncreated' },
            { n: totalVoice, label: 'voice\nnotes' },
          ].map(({ n, label }) => (
            <View key={label} style={{ flex: 1, backgroundColor: C.card, paddingVertical: 12, paddingHorizontal: 8, alignItems: 'center' }}>
              <Text style={{ fontSize: 22, fontWeight: '800', color: C.primary, marginBottom: 2 }}>{n}</Text>
              <Text style={{ fontSize: 11, color: C.textSoft, textAlign: 'center', lineHeight: 14 }}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Category Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 12, gap: 8 }}>
          {FILTERS.map(f => {
            const active = filter === f.value;
            const cat = f.value !== 'all' ? categories[f.value] : null;
            const catBg = cat ? (isDark ? cat.darkBg : cat.lightBg) : C.primary;
            return (
              <LiquidButton key={f.value} onPress={() => setFilter(f.value)} activeScale={0.92} style={{
                flexDirection: 'row', alignItems: 'center',
                paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20,
                backgroundColor: active ? catBg : C.card,
                borderWidth: 1.5, borderColor: active ? (cat ? cat.color : C.primary) : C.border,
              }}>
                {cat && <Text style={{ marginRight: 4, fontSize: 14 }}>{cat.emoji}</Text>}
                <Text style={{ fontSize: 13, fontWeight: active ? '700' : '500', color: active ? (cat ? cat.color : 'white') : C.textMid }}>
                  {f.label}
                </Text>
              </LiquidButton>
            );
          })}
        </ScrollView>
      </BlurView>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: insets.top + 210, paddingHorizontal: 16, paddingBottom: 160 }}>
        {byYear.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 48, paddingHorizontal: 24 }}>
            <Text style={{ fontSize: 40, marginBottom: 12 }}>📂</Text>
            <Text style={{ fontSize: 16, fontWeight: '600', color: C.text, marginBottom: 6 }}>Nothing here yet</Text>
            <Text style={{ fontSize: 14, color: C.textSoft, textAlign: 'center' }}>Log a moment in this category to see it here.</Text>
          </View>
        ) : (
          byYear.map(([year, moms]) => (
            <View key={year} style={{ marginBottom: 24 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <Text style={{ fontSize: 20, fontWeight: '800', color: C.text }}>{year}</Text>
                <View style={{ flex: 1, height: 1, backgroundColor: C.border }} />
                <View style={{ backgroundColor: isDark ? '#2A2A2A' : '#F2EFEB', paddingVertical: 2, paddingHorizontal: 8, borderRadius: 10 }}>
                  <Text style={{ color: C.textSoft, fontSize: 12, fontWeight: '600' }}>{moms.length}</Text>
                </View>
              </View>
              <View style={{ gap: 8 }}>
                {moms.map(m => (
                  <TimelineRow key={m.id} moment={m} onClick={() => navigation.navigate('MomentDetail', { id: m.id })} />
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <BottomNav />
    </View>
  );
}
