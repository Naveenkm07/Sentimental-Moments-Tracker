import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { format, parseISO } from 'date-fns';
import { Edit3, Trash2, Mic, Image as ImageIcon, Share2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../AppContext';
import { useAppTheme, CAT, MOOD, CategoryType, MoodType } from '../theme';
import { ScreenHeader } from '../components/ScreenHeader';

export function MomentDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { moments } = useApp();
  const { C } = useAppTheme();
  
  const id = route.params?.id;
  const m = moments.find(x => x.id === id);

  if (!m) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: C.textSoft }}>Moment not found.</Text>
      </View>
    );
  }

  const cat = CAT[m.category];
  const mood = MOOD[m.mood];

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScreenHeader title="Memory" right={
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity onPress={() => navigation.navigate('MomentEdit', { id })} style={{ backgroundColor: '#F2EFEB', borderRadius: 10, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}>
            <Edit3 size={16} color={C.textMid} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('MomentDelete', { id })} style={{ backgroundColor: '#FFF0EE', borderRadius: 10, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}>
            <Trash2 size={16} color={C.primary} />
          </TouchableOpacity>
        </View>
      } />

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: cat.lightBg, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 24 }}>{cat.emoji}</Text>
          </View>
          <View>
            <Text style={{ fontSize: 12, fontWeight: '700', color: cat.color, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>{cat.label}</Text>
            <Text style={{ fontSize: 13, color: C.textSoft }}>{format(parseISO(m.date), 'MMMM d, yyyy')}</Text>
          </View>
        </View>

        <Text style={{ fontSize: 22, fontWeight: '800', color: C.text, marginBottom: 12, lineHeight: 28 }}>{m.title}</Text>

        <View style={{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: mood.lightBg, paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, marginBottom: 20 }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: mood.color }}>{mood.emoji} {mood.label}</Text>
        </View>

        {m.detail && (
          <View style={{ backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 14, padding: 16, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: cat.color }}>
            <Text style={{ fontSize: 15, color: C.textMid, lineHeight: 24, fontStyle: 'italic' }}>"{m.detail}"</Text>
          </View>
        )}

        {(m.hasVoiceNote || m.hasPhoto) && (
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
            {m.hasVoiceNote && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 14 }}>
                <Mic size={15} color={C.primary} />
                <Text style={{ fontSize: 13, fontWeight: '600', color: C.textMid }}>Voice note attached</Text>
              </View>
            )}
            {m.hasPhoto && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 14 }}>
                <ImageIcon size={15} color="#4C79FF" />
                <Text style={{ fontSize: 13, fontWeight: '600', color: C.textMid }}>Photo attached</Text>
              </View>
            )}
          </View>
        )}

        <View style={{ backgroundColor: '#FFF9EB', borderWidth: 1, borderColor: '#FDEABB', borderRadius: 14, padding: 14 }}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#B8810A', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>💛 Reflection</Text>
          <Text style={{ fontSize: 14, color: '#7A5600', lineHeight: 22 }}>You captured this moment. One day, this record will be something you're deeply grateful for.</Text>
        </View>

        <TouchableOpacity style={{ width: '100%', marginTop: 20, padding: 14, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <Share2 size={16} color={C.textMid} />
          <Text style={{ fontSize: 14, fontWeight: '600', color: C.textMid }}>Share this memory</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

export function EditMomentScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { moments, updateMoment } = useApp();
  const { C, isDark } = useAppTheme();
  
  const id = route.params?.id;
  const m = moments.find(x => x.id === id);

  const [title, setTitle] = useState(m?.title ?? '');
  const [detail, setDetail] = useState(m?.detail ?? '');
  const [date, setDate] = useState(m?.date ?? new Date().toISOString().split('T')[0]);
  const [mood, setMood] = useState<MoodType>(m?.mood ?? 'nostalgic');
  const [category, setCategory] = useState<CategoryType>(m?.category ?? 'family');

  if (!m) return null;

  const handleSave = () => {
    updateMoment(id, { title, detail: detail || undefined, date, mood, category });
    navigation.goBack(); // Go back to detail
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScreenHeader title="Edit memory" right={
        <TouchableOpacity onPress={handleSave} style={{ backgroundColor: C.primary, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 16 }}>
          <Text style={{ color: 'white', fontSize: 14, fontWeight: '700' }}>Save</Text>
        </TouchableOpacity>
      } />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
        <FormLabel text="The last time I..." />
        <TextInput value={title} onChangeText={setTitle} style={{ backgroundColor: C.card, borderWidth: 1.5, borderColor: C.border, borderRadius: 12, padding: 12, fontSize: 15, color: C.text, marginBottom: 14 }} />

        <FormLabel text="A little more..." />
        <TextInput value={detail} onChangeText={setDetail} multiline numberOfLines={4} style={{ backgroundColor: C.card, borderWidth: 1.5, borderColor: C.border, borderRadius: 12, padding: 12, fontSize: 15, color: C.text, marginBottom: 14, minHeight: 100, textAlignVertical: 'top' }} />

        <FormLabel text="When?" />
        <TextInput value={date} onChangeText={setDate} style={{ backgroundColor: C.card, borderWidth: 1.5, borderColor: C.border, borderRadius: 12, padding: 12, fontSize: 15, color: C.text, marginBottom: 14 }} />

        <FormLabel text="How did it feel?" />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {(Object.entries(MOOD) as [MoodType, typeof MOOD[MoodType]][]).map(([key, mv]) => {
            const mBg = isDark ? mv.darkBg : mv.lightBg;
            return (
              <TouchableOpacity key={key} onPress={() => setMood(key)} style={{ paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, backgroundColor: mood === key ? mBg : C.card, borderWidth: 1.5, borderColor: mood === key ? mv.color : C.border }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: mood === key ? mv.color : C.textSoft }}>{mv.emoji} {mv.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <FormLabel text="Category" />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {(Object.entries(CAT) as [CategoryType, typeof CAT[CategoryType]][]).map(([key, cv]) => {
            const catBg = isDark ? cv.darkBg : cv.lightBg;
            return (
              <TouchableOpacity key={key} onPress={() => setCategory(key)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, backgroundColor: category === key ? catBg : C.card, borderWidth: 1.5, borderColor: category === key ? cv.color : C.border }}>
                <Text>{cv.emoji}</Text>
                <Text style={{ fontSize: 13, fontWeight: '600', color: category === key ? cv.color : C.textMid }}>{cv.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity onPress={handleSave} style={{ width: '100%', padding: 16, backgroundColor: C.primary, borderRadius: 14, alignItems: 'center', shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 4 }}>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>Save changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

export function DeleteConfirmScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { moments, deleteMoment } = useApp();
  const { C } = useAppTheme();
  
  const id = route.params?.id;
  const m = moments.find(x => x.id === id);

  const handleDelete = () => {
    deleteMoment(id);
    navigation.reset({ index: 0, routes: [{ name: 'Timeline' }] });
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScreenHeader title="Delete memory" />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <View style={{ width: 80, height: 80, borderRadius: 24, backgroundColor: '#FFF0EE', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <Text style={{ fontSize: 36 }}>🗑️</Text>
        </View>
        <Text style={{ fontSize: 22, fontWeight: '800', color: C.text, marginBottom: 10, textAlign: 'center' }}>Delete this memory?</Text>
        <Text style={{ fontSize: 15, color: C.textSoft, textAlign: 'center', lineHeight: 22, marginBottom: 8 }}>This action cannot be undone.</Text>

        {m && (
          <View style={{ backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 18, width: '100%', marginBottom: 28 }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 4 }}>{m.title}</Text>
            <Text style={{ fontSize: 13, color: C.textSoft }}>{format(parseISO(m.date), 'MMMM d, yyyy')}</Text>
          </View>
        )}

        <TouchableOpacity onPress={handleDelete} style={{ width: '100%', padding: 15, backgroundColor: '#D84E3B', borderRadius: 14, alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>Yes, delete it</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: '100%', padding: 15, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 14, alignItems: 'center' }}>
          <Text style={{ color: C.textMid, fontSize: 16, fontWeight: '600' }}>Keep this memory</Text>
        </TouchableOpacity>
      </View>
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
