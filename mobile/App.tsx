import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppProvider, useApp } from './src/AppContext';
import { View, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppTheme } from './src/theme';

import { SplashScreen } from './src/screens/SplashScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { TimelineScreen } from './src/screens/TimelineScreen';
import { StatsScreen } from './src/screens/StatsScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { LogScreen } from './src/screens/LogScreen';
import { LogVoiceScreen, LogSuccessScreen } from './src/screens/LogFlowScreens';
import { MomentDetailScreen, EditMomentScreen, DeleteConfirmScreen } from './src/screens/MomentScreens';
import { PasscodeScreen } from './src/screens/PasscodeScreen';
import { SearchScreen } from './src/screens/SearchScreen';
import { ProfileScreen } from './src/screens/ProfileScreens';
import {
  SettingsNotifications, SettingsCategories, SettingsBackup, SettingsPasscode, SettingsTheme,
  Keepsake, FamilyTimeline, Help, About, MemoryResurface, AnnualSummary
} from './src/screens/PlaceholderScreens';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Home: undefined;
  Timeline: undefined;
  Stats: undefined;
  Settings: undefined;
  Profile: undefined;
  Log: undefined;
  LogVoice: undefined;
  LogSuccess: undefined;
  MomentDetail: { id: string };
  MomentEdit: { id: string };
  MomentDelete: { id: string };
  Search: undefined;
  Notifications: undefined;
  Categories: undefined;
  Backup: undefined;
  Passcode: undefined;
  Theme: undefined;
  Keepsake: undefined;
  FamilyTimeline: undefined;
  Help: undefined;
  About: undefined;
  MemoryResurface: undefined;
  AnnualSummary: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function MainNavigator() {
  const { isLoaded, hasOnboarded, passcodeEnabled, isUnlocked } = useApp();
  const { C } = useAppTheme();

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: C.bg }}>
        <ActivityIndicator size="large" color={C.primary} />
      </View>
    );
  }

  if (passcodeEnabled && !isUnlocked) {
    return <PasscodeScreen mode="unlock" onSuccess={() => {}} />;
  }

  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: C.bg }
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Timeline" component={TimelineScreen} />
      <Stack.Screen name="Stats" component={StatsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Log" component={LogScreen} />
      <Stack.Screen name="LogVoice" component={LogVoiceScreen} />
      <Stack.Screen name="LogSuccess" component={LogSuccessScreen} />
      <Stack.Screen name="MomentDetail" component={MomentDetailScreen} />
      <Stack.Screen name="MomentEdit" component={EditMomentScreen} />
      <Stack.Screen name="MomentDelete" component={DeleteConfirmScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Notifications" component={SettingsNotifications} />
      <Stack.Screen name="Categories" component={SettingsCategories} />
      <Stack.Screen name="Backup" component={SettingsBackup} />
      <Stack.Screen name="Passcode" component={SettingsPasscode} />
      <Stack.Screen name="Theme" component={SettingsTheme} />
      <Stack.Screen name="Keepsake" component={Keepsake} />
      <Stack.Screen name="FamilyTimeline" component={FamilyTimeline} />
      <Stack.Screen name="Help" component={Help} />
      <Stack.Screen name="About" component={About} />
      <Stack.Screen name="MemoryResurface" component={MemoryResurface} />
      <Stack.Screen name="AnnualSummary" component={AnnualSummary} />
    </Stack.Navigator>
  );
}

export default function App() {
  const isWeb = Platform.OS === 'web';
  return (
    <SafeAreaProvider>
      <AppProvider>
        <View style={{ flex: 1, backgroundColor: isWeb ? '#0A0A0A' : undefined, alignItems: isWeb ? 'center' : undefined }}>
          <View style={{ 
            flex: 1, 
            maxWidth: isWeb ? 480 : undefined, 
            width: '100%', 
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: isWeb ? 0.5 : 0,
            shadowRadius: 30,
          }}>
            <NavigationContainer>
              <MainNavigator />
            </NavigationContainer>
          </View>
        </View>
      </AppProvider>
    </SafeAreaProvider>
  );
}
