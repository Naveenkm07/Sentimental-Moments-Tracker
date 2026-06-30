import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, Clock, BarChart2, Settings, User, Plus } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../theme';

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
  const { C } = useAppTheme();

  return (
    <View style={{
      position: 'absolute',
      bottom: 0, left: 0, right: 0,
      backgroundColor: C.card,
      borderTopWidth: 1,
      borderTopColor: C.border,
      flexDirection: 'row',
      alignItems: 'center',
      height: 72 + insets.bottom,
      paddingBottom: insets.bottom,
      zIndex: 100,
    }}>
      {tabs.slice(0, 2).map(tab => (
        <TabBtn key={tab.screen} tab={tab} active={route.name === tab.screen} />
      ))}

      <TouchableOpacity
        onPress={() => navigation.navigate('Log')}
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
      </TouchableOpacity>

      {tabs.slice(2).map(tab => (
        <TabBtn key={tab.screen} tab={tab} active={route.name === tab.screen} />
      ))}
    </View>
  );
}

function TabBtn({ tab, active }: { tab: typeof tabs[0]; active: boolean }) {
  const navigation = useNavigation<any>();
  const { C } = useAppTheme();
  const Icon = tab.icon;

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(tab.screen)}
      style={{
        flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3,
        paddingTop: 4,
      }}
    >
      <Icon size={21} strokeWidth={active ? 2.5 : 1.8} color={active ? C.primary : '#B0ABA6'} />
      <Text style={{ fontSize: 10, fontWeight: active ? '600' : '400', color: active ? C.primary : '#B0ABA6' }}>
        {tab.label}
      </Text>
    </TouchableOpacity>
  );
}
