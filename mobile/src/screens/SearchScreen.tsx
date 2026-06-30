import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Search, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../AppContext';
import { useAppTheme, CAT } from '../theme';
import { EntryCard } from '../components/EntryCard';

export function SearchScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { moments } = useApp();
  const { C, isDark } = useAppTheme();
  
  const [query, setQuery] = useState('');

  const results = query.trim().length >= 2
    ? moments.filter(m =>
        m.title.toLowerCase().includes(query.toLowerCase()) ||
        m.detail?.toLowerCase().includes(query.toLowerCase()) ||
        CAT[m.category].label.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const recent = moments.slice(0, 3);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ backgroundColor: C.card, borderBottomWidth: 1, borderBottomColor: C.border, paddingTop: insets.top + 16, paddingHorizontal: 16, paddingBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ backgroundColor: '#F2EFEB', borderRadius: 18, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}>
          <ArrowLeft size={18} color={C.text} />
        </TouchableOpacity>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#F2EFEB', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 }}>
          <Search size={16} color={C.textSoft} />
          <TextInput
            autoFocus
            value={query}
            onChangeText={setQuery}
            placeholder="Search your memories..."
            placeholderTextColor={C.textSoft}
            style={{ flex: 1, padding: 0, fontSize: 15, color: C.text }}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <X size={15} color={C.textSoft} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {query.trim().length < 2 ? (
          <View>
            <Text style={{ fontSize: 11, fontWeight: '700', color: C.textSoft, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 12 }}>Recent</Text>
            <View style={{ gap: 10 }}>
              {recent.map(m => (
                <EntryCard key={m.id} moment={m} compact onClick={() => navigation.navigate('MomentDetail', { id: m.id })} />
              ))}
            </View>

            <Text style={{ fontSize: 11, fontWeight: '700', color: C.textSoft, letterSpacing: 0.8, textTransform: 'uppercase', marginTop: 24, marginBottom: 12 }}>Browse by Category</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {Object.entries(CAT).map(([key, cat]) => {
                const count = moments.filter(m => m.category === key).length;
                const bg = isDark ? cat.darkBg : cat.lightBg;
                return (
                  <TouchableOpacity
                    key={key}
                    onPress={() => setQuery(cat.label)}
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, backgroundColor: bg, borderWidth: 1, borderColor: cat.color + '30' }}
                  >
                    <Text>{cat.emoji}</Text>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: cat.color }}>{cat.label}</Text>
                    <View style={{ backgroundColor: cat.color, borderRadius: 10, paddingVertical: 1, paddingHorizontal: 6 }}>
                      <Text style={{ color: 'white', fontSize: 11, fontWeight: '600' }}>{count}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ) : results.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 48, paddingHorizontal: 24 }}>
            <Text style={{ fontSize: 40, marginBottom: 12 }}>🔍</Text>
            <Text style={{ fontSize: 16, fontWeight: '600', color: C.text, marginBottom: 6 }}>No results found</Text>
            <Text style={{ fontSize: 14, color: C.textSoft, textAlign: 'center' }}>Try searching by title, detail, or category</Text>
          </View>
        ) : (
          <View>
            <Text style={{ fontSize: 11, fontWeight: '700', color: C.textSoft, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 12 }}>
              {results.length} Result{results.length !== 1 ? 's' : ''}
            </Text>
            <View style={{ gap: 10 }}>
              {results.map(m => (
                <EntryCard key={m.id} moment={m} onClick={() => navigation.navigate('MomentDetail', { id: m.id })} />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
