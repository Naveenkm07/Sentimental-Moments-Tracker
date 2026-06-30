import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { ChevronRight, Check } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../AppContext';
import { useAppTheme, CAT, CategoryType } from '../theme';

const steps = [
  {
    id: 'welcome',
    emoji: '🕰️',
    title: 'Welcome to Last Time',
    subtitle: 'The app that helps you notice the moments you never want to forget.',
    body: 'We never realize when something is the last time it happens — the last time you carry your kid to bed, the last time you visit a city, the last time a friend is healthy.\n\nBy then, it\'s already gone.',
  },
  {
    id: 'how',
    emoji: '✍️',
    title: 'How it works',
    subtitle: 'Simple, beautiful, and entirely yours.',
    body: null,
    features: [
      { icon: '📝', title: 'Log a last time', desc: 'Record the moment before it passes with a note, photo, or voice memo.' },
      { icon: '📋', title: 'Browse your timeline', desc: 'A reverse scrapbook of your life, sorted by year and category.' },
      { icon: '💫', title: 'Daily gentle nudges', desc: 'Soft prompts — never spam — to help you notice what matters.' },
    ],
  },
  {
    id: 'categories',
    emoji: '🗂️',
    title: 'What matters most to you?',
    subtitle: 'Choose the life areas you want to track. You can always change this later.',
    body: null,
  },
  {
    id: 'reminders',
    emoji: '🔔',
    title: 'Stay present',
    subtitle: "A gentle nudge, once a day. That's all.",
    body: 'Last Time will send you one quiet reminder each evening — a question to help you reflect. No spam, no streaks, no pressure.',
  },
];

const ALL_CATS = Object.entries(CAT) as [CategoryType, typeof CAT[CategoryType]][];

export function OnboardingScreen() {
  const navigation = useNavigation<any>();
  const { setHasOnboarded, selectedCategories, setSelectedCategories, setNotificationsEnabled } = useApp();
  const { C, isDark } = useAppTheme();
  
  const [step, setStep] = useState(0);
  const [notifChoice, setNotifChoice] = useState<'yes' | 'no' | null>(null);
  
  const cur = steps[step];
  const isLast = step === steps.length - 1;

  const toggleCat = (c: CategoryType) => {
    setSelectedCategories(
      selectedCategories.includes(c)
        ? selectedCategories.filter(x => x !== c)
        : [...selectedCategories, c]
    );
  };

  const handleNext = () => {
    if (isLast) {
      if (notifChoice) setNotificationsEnabled(notifChoice === 'yes');
      setHasOnboarded(true);
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } else {
      setStep(s => s + 1);
    }
  };

  const canNext = cur.id === 'categories' ? selectedCategories.length > 0 :
                  cur.id === 'reminders' ? notifChoice !== null : true;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      {/* Progress */}
      <View style={{ flexDirection: 'row', gap: 6, paddingHorizontal: 24, paddingTop: 16 }}>
        {steps.map((_, i) => (
          <View key={i} style={{ flex: 1, height: 3, borderRadius: 3, backgroundColor: i <= step ? C.primary : C.border }} />
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 40, flexGrow: 1 }}>
        <Text style={{ fontSize: 56, marginBottom: 20 }}>{cur.emoji}</Text>
        <Text style={{ fontSize: 28, fontWeight: '800', color: C.text, marginBottom: 8, lineHeight: 34 }}>{cur.title}</Text>
        <Text style={{ fontSize: 15, color: C.textMid, marginBottom: 28, lineHeight: 23 }}>{cur.subtitle}</Text>

        {cur.body && (
          <Text style={{ fontSize: 15, color: C.textSoft, lineHeight: 24 }}>{cur.body}</Text>
        )}

        {cur.features && (
          <View style={{ gap: 16 }}>
            {cur.features.map(f => (
              <View key={f.title} style={{ flexDirection: 'row', gap: 14 }}>
                <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 22 }}>{f.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '700', color: C.text, fontSize: 15, marginBottom: 3 }}>{f.title}</Text>
                  <Text style={{ color: C.textSoft, fontSize: 13, lineHeight: 18 }}>{f.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {cur.id === 'categories' && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {ALL_CATS.map(([key, cat]) => {
              const sel = selectedCategories.includes(key);
              const bg = isDark ? cat.darkBg : cat.lightBg;
              return (
                <TouchableOpacity key={key} onPress={() => toggleCat(key)} style={{
                  flexDirection: 'row', alignItems: 'center', gap: 8,
                  paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20,
                  backgroundColor: sel ? bg : C.card,
                  borderWidth: 2, borderColor: sel ? cat.color : C.border,
                }}>
                  <Text style={{ fontSize: 18 }}>{cat.emoji}</Text>
                  <Text style={{ fontSize: 14, fontWeight: sel ? '700' : '500', color: sel ? cat.color : C.textMid }}>{cat.label}</Text>
                  {sel && <Check size={14} color={cat.color} />}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {cur.id === 'reminders' && (
          <View style={{ gap: 12, marginTop: 8 }}>
            {[
              { val: 'yes' as const, emoji: '🔔', label: 'Yes, send me a daily nudge', desc: 'One gentle question each evening' },
              { val: 'no' as const, emoji: '🔕', label: "No thanks, I'll open the app myself", desc: 'No reminders' },
            ].map(opt => (
              <TouchableOpacity key={opt.val} onPress={() => setNotifChoice(opt.val)} style={{
                flexDirection: 'row', alignItems: 'center', gap: 14,
                padding: 16, borderRadius: 14,
                backgroundColor: notifChoice === opt.val ? C.primaryLight : C.card,
                borderWidth: 2, borderColor: notifChoice === opt.val ? C.primary : C.border,
              }}>
                <Text style={{ fontSize: 24 }}>{opt.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '700', color: C.text, fontSize: 14 }}>{opt.label}</Text>
                  <Text style={{ color: C.textSoft, fontSize: 12, marginTop: 2 }}>{opt.desc}</Text>
                </View>
                {notifChoice === opt.val && (
                  <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={12} color="white" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ flex: 1, minHeight: 40 }} />

        <TouchableOpacity onPress={handleNext} disabled={!canNext} style={{
          backgroundColor: canNext ? C.primary : C.border,
          borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
          shadowColor: canNext ? C.primary : 'transparent', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 20, elevation: canNext ? 4 : 0,
        }}>
          <Text style={{ color: canNext ? 'white' : C.textSoft, fontSize: 16, fontWeight: '700' }}>{isLast ? 'Get Started' : 'Continue'}</Text>
          <ChevronRight size={18} color={canNext ? 'white' : C.textSoft} />
        </TouchableOpacity>

        {step > 0 && (
          <TouchableOpacity onPress={() => setStep(s => s - 1)} style={{ marginTop: 12, padding: 8, alignItems: 'center' }}>
            <Text style={{ color: C.textSoft, fontSize: 14 }}>← Back</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
