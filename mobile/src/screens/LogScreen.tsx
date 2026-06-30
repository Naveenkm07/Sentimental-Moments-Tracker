import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Camera, Mic, ChevronDown } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../AppContext';
import { useAppTheme, CAT, MOOD, CategoryType, MoodType } from '../theme';
import { ScreenHeader } from '../components/ScreenHeader';

export function LogScreen() {
  const { addMoment } = useApp();
  const navigation = useNavigation<any>();
  const { C, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();
  
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<CategoryType>('family');
  const [mood, setMood] = useState<MoodType>('nostalgic');
  const [showCats, setShowCats] = useState(false);

  const canSave = title.trim().length >= 3;

  const handleSave = () => {
    if (!canSave) return;
    addMoment({ title: title.trim(), detail: detail.trim() || undefined, date, category, mood });
    // Navigate to Success screen later, just go back for now
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: insets.top }}>
      <ScreenHeader title="New memory" right={
        <TouchableOpacity onPress={handleSave} disabled={!canSave} style={{
          backgroundColor: canSave ? C.primary : C.border,
          borderRadius: 10, paddingVertical: 8, paddingHorizontal: 16,
        }}>
          <Text style={{ color: canSave ? 'white' : C.textSoft, fontSize: 14, fontWeight: '700' }}>Save</Text>
        </TouchableOpacity>
      } />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        {/* Photo/Voice Area */}
        <View style={{
          backgroundColor: C.card, borderWidth: 2, borderColor: C.border, borderStyle: 'dashed',
          borderRadius: 16, padding: 24, marginBottom: 16, alignItems: 'center'
        }}>
          <View style={{ flexDirection: 'row', gap: 20 }}>
            <TouchableOpacity style={{ alignItems: 'center', gap: 6 }}>
              <View style={{ width: 52, height: 52, borderRadius: 14, backgroundColor: isDark ? '#3D1C17' : '#FFF0EE', alignItems: 'center', justifyContent: 'center' }}>
                <Camera size={22} color={C.primary} />
              </View>
              <Text style={{ fontSize: 12, color: C.textSoft, fontWeight: '500' }}>Add photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ alignItems: 'center', gap: 6 }}>
              <View style={{ width: 52, height: 52, borderRadius: 14, backgroundColor: isDark ? '#3D1C17' : '#FFF0EE', alignItems: 'center', justifyContent: 'center' }}>
                <Mic size={22} color={C.primary} />
              </View>
              <Text style={{ fontSize: 12, color: C.textSoft, fontWeight: '500' }}>Add voice note</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Title */}
        <FormLabel text="The last time I..." />
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="carried Mia to bed without her asking"
          placeholderTextColor={C.textSoft}
          style={{
            backgroundColor: C.card, borderWidth: 1.5, borderColor: title ? C.primary : C.border,
            borderRadius: 12, padding: 14, fontSize: 15, fontWeight: '600', color: C.text,
            marginBottom: 14,
          }}
        />

        {/* Detail */}
        <FormLabel text="A little more... (optional)" />
        <TextInput
          value={detail}
          onChangeText={setDetail}
          placeholder="She fell asleep mid-sentence asking for water. I just stood there for a minute."
          placeholderTextColor={C.textSoft}
          multiline
          numberOfLines={4}
          style={{
            backgroundColor: C.card, borderWidth: 1.5, borderColor: C.border,
            borderRadius: 12, padding: 14, fontSize: 14, color: C.text,
            marginBottom: 14, textAlignVertical: 'top', minHeight: 100,
          }}
        />

        {/* Date (Simplified text input for RN demo, use DatePicker normally) */}
        <FormLabel text="When did it happen? (YYYY-MM-DD)" />
        <TextInput
          value={date}
          onChangeText={setDate}
          style={{
            backgroundColor: C.card, borderWidth: 1.5, borderColor: C.border,
            borderRadius: 12, padding: 14, fontSize: 15, color: C.text,
            marginBottom: 14,
          }}
        />

        {/* Mood */}
        <FormLabel text="How did it feel?" />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {(Object.entries(MOOD) as [MoodType, typeof MOOD[MoodType]][]).map(([key, m]) => {
            const mBg = isDark ? m.darkBg : m.lightBg;
            return (
              <TouchableOpacity key={key} onPress={() => setMood(key)} style={{
                paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20,
                backgroundColor: mood === key ? mBg : C.card,
                borderWidth: 1.5, borderColor: mood === key ? m.color : C.border,
              }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: mood === key ? m.color : C.textSoft }}>
                  {m.emoji} {m.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Category */}
        <FormLabel text="Tag this moment" />
        <TouchableOpacity onPress={() => setShowCats(!showCats)} style={{
          backgroundColor: C.card, borderWidth: 1.5, borderColor: C.border,
          borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10,
          marginBottom: 8,
        }}>
          <Text style={{ fontSize: 20 }}>{CAT[category].emoji}</Text>
          <Text style={{ flex: 1, fontSize: 15, fontWeight: '600', color: CAT[category].color }}>
            {CAT[category].label}
          </Text>
          <ChevronDown size={16} color={C.textSoft} style={{ transform: [{ rotate: showCats ? '180deg' : '0deg' }] }} />
        </TouchableOpacity>

        {showCats && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
            {(Object.entries(CAT) as [CategoryType, typeof CAT[CategoryType]][]).map(([key, cat]) => {
              const catBg = isDark ? cat.darkBg : cat.lightBg;
              return (
                <TouchableOpacity key={key} onPress={() => { setCategory(key); setShowCats(false); }} style={{
                  flexDirection: 'row', alignItems: 'center', gap: 6,
                  paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20,
                  backgroundColor: category === key ? catBg : C.card,
                  borderWidth: 1.5, borderColor: category === key ? cat.color : C.border,
                }}>
                  <Text>{cat.emoji}</Text>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: category === key ? cat.color : C.textMid }}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <TouchableOpacity onPress={handleSave} disabled={!canSave} style={{
          backgroundColor: canSave ? C.primary : C.border,
          borderRadius: 14, padding: 16, alignItems: 'center', justifyContent: 'center',
          shadowColor: canSave ? C.primary : 'transparent', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 20, elevation: canSave ? 4 : 0,
          marginTop: 8,
        }}>
          <Text style={{ color: canSave ? 'white' : C.textSoft, fontSize: 16, fontWeight: '700' }}>Save this memory</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function FormLabel({ text }: { text: string }) {
  const { C } = useAppTheme();
  return (
    <Text style={{ fontSize: 11, fontWeight: '700', color: C.textSoft, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8 }}>
      {text}
    </Text>
  );
}
