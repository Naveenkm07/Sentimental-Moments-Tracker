import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getYear, parseISO } from 'date-fns';
import { ChevronRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../AppContext';
import { useAppTheme, MOOD } from '../theme';
import { BottomNav } from '../components/BottomNav';

export function ProfileScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { moments, categories } = useApp();
  const { C, isDark } = useAppTheme();

  const years = useMemo(() => {
    const s = new Set(moments.map(m => getYear(parseISO(m.date))));
    return [...s].sort((a, b) => b - a);
  }, [moments]);

  const favCat = useMemo(() => {
    const counts: Record<string, number> = {};
    moments.forEach(m => { counts[m.category] = (counts[m.category] ?? 0) + 1; });
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return top ? categories[top[0]] : null;
  }, [moments, categories]);

  const favMood = useMemo(() => {
    const counts: Record<string, number> = {};
    moments.forEach(m => { counts[m.mood] = (counts[m.mood] ?? 0) + 1; });
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return top ? MOOD[top[0] as keyof typeof MOOD] : null;
  }, [moments]);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Hero */}
        <View style={{ backgroundColor: '#D84E3B', paddingTop: insets.top + 32, paddingHorizontal: 20, paddingBottom: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 28 }}>🕰️</Text>
            </View>
            <View>
              <Text style={{ color: 'white', fontSize: 22, fontWeight: '800', marginBottom: 2 }}>My Memories</Text>
              <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14 }}>
                {moments.length} moments across {years.length} {years.length === 1 ? 'year' : 'years'}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            {[
              { n: moments.length, label: 'Moments' },
              { n: moments.filter(m => m.hasVoiceNote).length, label: 'Voice notes' },
              { n: moments.filter(m => m.hasPhoto).length, label: 'Photos' },
            ].map(s => (
              <View key={s.label} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 8, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' }}>
                <Text style={{ color: 'white', fontSize: 20, fontWeight: '800', marginBottom: 2 }}>{s.n}</Text>
                <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ padding: 16, gap: 14 }}>
          {/* Identity cards */}
          {(favCat || favMood) && (
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {favCat && (
                <View style={{ flex: 1, backgroundColor: isDark ? favCat.darkBg : favCat.lightBg, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: favCat.color + '30' }}>
                  <Text style={{ fontSize: 26, marginBottom: 6 }}>{favCat.emoji}</Text>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: favCat.color, marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>Most logged</Text>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: C.text }}>{favCat.label}</Text>
                </View>
              )}
              {favMood && (
                <View style={{ flex: 1, backgroundColor: isDark ? favMood.darkBg : favMood.lightBg, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: favMood.color + '30' }}>
                  <Text style={{ fontSize: 26, marginBottom: 6 }}>{favMood.emoji}</Text>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: favMood.color, marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>Common feeling</Text>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: C.text }}>{favMood.label}</Text>
                </View>
              )}
            </View>
          )}

          {/* Quick access */}
          <View style={{ backgroundColor: C.card, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: C.border, shadowColor: C.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
            {[
              { label: '🌅 This day last year', desc: 'See what you captured on this date', screen: 'MemoryResurface' },
              { label: '📅 Annual summary', desc: 'Your year in memories', screen: 'AnnualSummary' },
              { label: '👨‍👩‍👧 Family timeline', desc: 'Shared moments with loved ones', screen: 'FamilyTimeline' },
            ].map((row, i, arr) => (
              <TouchableOpacity key={row.screen} onPress={() => {}} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderBottomColor: C.divider }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '600', color: C.text, fontSize: 14, marginBottom: 2 }}>{row.label}</Text>
                  <Text style={{ color: C.textSoft, fontSize: 12 }}>{row.desc}</Text>
                </View>
                <ChevronRight size={16} color={C.textSoft} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Years summary */}
          {years.length > 0 && (
            <View style={{ backgroundColor: C.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.border, shadowColor: C.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: C.text, marginBottom: 14 }}>By year</Text>
              <View style={{ gap: 8 }}>
                {years.map(year => {
                  const count = moments.filter(m => getYear(parseISO(m.date)) === year).length;
                  return (
                    <TouchableOpacity key={year} onPress={() => navigation.navigate('Timeline')} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: isDark ? '#2A2A2A' : '#F7F5F2', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14 }}>
                      <Text style={{ fontWeight: '700', color: C.text, fontSize: 15 }}>{year}</Text>
                      <Text style={{ color: C.primary, fontWeight: '700', fontSize: 14 }}>{count} {count === 1 ? 'memory' : 'memories'}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      <BottomNav />
    </View>
  );
}
