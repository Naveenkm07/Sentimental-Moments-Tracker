import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Home, Clock, BarChart2, Settings, User, Plus } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../theme';
import { LiquidButton } from './LiquidButton';

const tabs = [
  { screen: 'Home',     icon: Home,     label: 'Home' },
  { screen: 'Timeline', icon: Clock,    label: 'Timeline' },
  { screen: 'Stats',    icon: BarChart2,label: 'Stats' },
  { screen: 'Settings', icon: Settings, label: 'Settings' },
  { screen: 'Profile',  icon: User,     label: 'Profile' },
];

export function BottomNav() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { C, isDark } = useAppTheme();

  return (
    <View style={{
      position: 'absolute',
      bottom: insets.bottom + 12,
      left: 16,
      right: 16,
      borderRadius: 36,
      overflow: 'hidden',
      zIndex: 100,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 10,
    }}>
      <BlurView
        intensity={isDark ? 80 : 60}
        tint={isDark ? 'dark' : 'light'}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: 72,
          paddingHorizontal: 8,
          backgroundColor: isDark ? 'rgba(30,30,30,0.6)' : 'rgba(255,255,255,0.7)',
          borderWidth: 1,
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.5)',
          borderRadius: 36,
        }}
      >
        {tabs.slice(0, 2).map(tab => (
          <TabBtn key={tab.screen} tab={tab} active={route.name === tab.screen} />
        ))}

      <LiquidButton
        onPress={() => navigation.navigate('Log')}
        activeScale={0.85}
        style={{
          width: 50, height: 50,
          borderRadius: 25,
          backgroundColor: C.primary,
          alignItems: 'center', justifyContent: 'center',
          borderWidth: 3, borderColor: C.bg,
          shadowColor: C.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 8,
          elevation: 5,
          marginTop: -20,
        }}
      >
        <Plus size={22} color="white" strokeWidth={2.5} />
      </LiquidButton>

      {tabs.slice(2).map(tab => (
        <TabBtn key={tab.screen} tab={tab} active={route.name === tab.screen} />
      ))}
      </BlurView>
    </View>
  );
}

function TabBtn({ tab, active }: { tab: typeof tabs[0]; active: boolean }) {
  const navigation = useNavigation<any>();
  const { C } = useAppTheme();
  const Icon = tab.icon;

  return (
    <LiquidButton
      onPress={() => navigation.navigate(tab.screen)}
      activeScale={0.9}
      style={{
        flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3,
        paddingTop: 4,
      }}
    >
      <Icon size={21} strokeWidth={active ? 2.5 : 1.8} color={active ? C.primary : '#B0ABA6'} />
      <Text style={{ fontSize: 10, fontWeight: active ? '600' : '400', color: active ? C.primary : '#B0ABA6' }}>
        {tab.label}
      </Text>
    </LiquidButton>
  );
}
