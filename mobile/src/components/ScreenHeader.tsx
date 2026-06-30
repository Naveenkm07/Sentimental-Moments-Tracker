import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../theme';
import { LiquidButton } from './LiquidButton';

interface ScreenHeaderProps {
  title: string;
  right?: React.ReactNode;
  transparent?: boolean;
}

export function ScreenHeader({ title, right, onBack, transparent }: { title: string; right?: React.ReactNode; onBack?: () => void; transparent?: boolean }) {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { C, isDark } = useAppTheme();

  return (
    <BlurView
      intensity={isDark ? 80 : 60}
      tint={isDark ? 'dark' : 'light'}
      style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100,
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingTop: Math.max(insets.top + 16, 16), paddingBottom: 12,
        backgroundColor: transparent ? 'transparent' : (isDark ? 'rgba(30,30,30,0.5)' : 'rgba(255,255,255,0.7)'),
        borderBottomWidth: transparent ? 0 : StyleSheet.hairlineWidth,
        borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        gap: 12,
      }}
    >
      <LiquidButton onPress={onBack || (() => navigation.goBack())} activeScale={0.85} style={{
        backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
        borderRadius: 17,
        width: 34, height: 34,
        alignItems: 'center', justifyContent: 'center',
      }}>
        <ArrowLeft size={18} color={isDark ? '#FFFFFF' : '#1A1A1A'} />
      </LiquidButton>
      <Text style={{ flex: 1, fontSize: 17, fontWeight: '700', color: C.text }}>{title}</Text>
      {right}
    </BlurView>
  );
}
