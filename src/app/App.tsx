import React, { useState, useEffect, createContext, useContext, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Moment, ScreenName, NavState, MoodType, CategoryType } from "./theme";
import { SAMPLE_MOMENTS } from "./sampleData";
import { BottomNav } from "./components/BottomNav";

// Screens
import { SplashScreen } from "./screens/SplashScreen";
import { OnboardingScreen } from "./screens/OnboardingScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { SearchScreen } from "./screens/SearchScreen";
import { LogScreen } from "./screens/LogScreen";
import { LogVoiceScreen } from "./screens/LogFlowScreens";
import { LogSuccessScreen } from "./screens/LogFlowScreens";
import { TimelineScreen } from "./screens/TimelineScreen";
import { MomentDetailScreen, EditMomentScreen, DeleteConfirmScreen } from "./screens/MomentScreens";
import { StatsScreen } from "./screens/StatsScreen";
import { StatsMoodScreen } from "./screens/StatsMoodScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import {
  SettingsNotificationsScreen,
  SettingsCategoriesScreen,
  SettingsBackupScreen,
  SettingsPasscodeScreen,
  SettingsThemeScreen,
} from "./screens/SettingsSubScreens";
import { ProfileScreen } from "./screens/ProfileScreens";
import { MemoryResurfaceScreen, AnnualSummaryScreen } from "./screens/MemoryScreens";
import { KeepsakeScreen, KeepsakeExportScreen } from "./screens/PremiumScreens";
import { FamilyTimelineScreen, FamilyInviteScreen } from "./screens/FamilyScreens";
import { HelpScreen, AboutScreen } from "./screens/HelpScreens";

// ─── Context ─────────────────────────────────────────────────────────────────

export interface AppCtx {
  moments: Moment[];
  addMoment: (m: Omit<Moment, 'id' | 'createdAt'>) => void;
  updateMoment: (id: string, m: Partial<Moment>) => void;
  deleteMoment: (id: string) => void;
  navigate: (s: ScreenName, p?: Record<string, unknown>) => void;
  goBack: () => void;
  navState: NavState;
  isPremium: boolean;
  setPremium: (v: boolean) => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (v: boolean) => void;
  selectedCategories: CategoryType[];
  setSelectedCategories: (c: CategoryType[]) => void;
  passcodeEnabled: boolean;
  setPasscodeEnabled: (v: boolean) => void;
  themeChoice: 'light' | 'dark' | 'system';
  setThemeChoice: (v: 'light' | 'dark' | 'system') => void;
  darkMode: boolean;
  hasOnboarded: boolean;
  setHasOnboarded: (v: boolean) => void;
}

export const AppContext = createContext<AppCtx>({} as AppCtx);
export const useApp = () => useContext(AppContext);

// ─── Bottom nav screens ───────────────────────────────────────────────────────

const MAIN_SCREENS: ScreenName[] = ['home', 'timeline', 'stats', 'settings', 'profile'];

// ─── Router ───────────────────────────────────────────────────────────────────

function Router() {
  const { navState } = useApp();
  const s = navState.screen;
  const screens: Partial<Record<ScreenName, React.ReactNode>> = {
    splash: <SplashScreen />,
    onboarding: <OnboardingScreen />,
    home: <HomeScreen />,
    search: <SearchScreen />,
    log: <LogScreen />,
    'log-voice': <LogVoiceScreen />,
    'log-success': <LogSuccessScreen />,
    timeline: <TimelineScreen />,
    'moment-detail': <MomentDetailScreen />,
    'moment-edit': <EditMomentScreen />,
    'moment-delete': <DeleteConfirmScreen />,
    stats: <StatsScreen />,
    'stats-mood': <StatsMoodScreen />,
    settings: <SettingsScreen />,
    'settings-notifications': <SettingsNotificationsScreen />,
    'settings-categories': <SettingsCategoriesScreen />,
    'settings-backup': <SettingsBackupScreen />,
    'settings-passcode': <SettingsPasscodeScreen />,
    'settings-theme': <SettingsThemeScreen />,
    profile: <ProfileScreen />,
    'memory-resurface': <MemoryResurfaceScreen />,
    'annual-summary': <AnnualSummaryScreen />,
    keepsake: <KeepsakeScreen />,
    'keepsake-export': <KeepsakeExportScreen />,
    'family-timeline': <FamilyTimelineScreen />,
    'family-invite': <FamilyInviteScreen />,
    help: <HelpScreen />,
    about: <AboutScreen />,
  };
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={s}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.18 }}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
      >
        {screens[s] ?? <HomeScreen />}
      </motion.div>
    </AnimatePresence>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [moments, setMoments] = useState<Moment[]>(() => {
    try {
      const s = localStorage.getItem('lt-moments');
      return s ? JSON.parse(s) : SAMPLE_MOMENTS;
    } catch { return SAMPLE_MOMENTS; }
  });
  const [navHistory, setNavHistory] = useState<NavState[]>([{ screen: 'splash' }]);
  const [isPremium, setPremium] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [passcodeEnabled, setPasscodeEnabled] = useState(false);
  const [themeChoice, setThemeChoice] = useState<'light' | 'dark' | 'system'>(() => {
    return (localStorage.getItem('lt-theme') as 'light' | 'dark' | 'system') || 'system';
  });
  const [darkMode, setDarkMode] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(() => {
    return localStorage.getItem('lt-onboarded') === 'true';
  });
  const [selectedCategories, setSelectedCategories] = useState<CategoryType[]>([
    'parenthood', 'family', 'friendships', 'travel', 'self', 'milestones'
  ]);

  const navState = navHistory[navHistory.length - 1];

  useEffect(() => {
    localStorage.setItem('lt-moments', JSON.stringify(moments));
  }, [moments]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const updateTheme = () => {
      const isDark = themeChoice === 'dark' || (themeChoice === 'system' && media.matches);
      setDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    updateTheme();
    media.addEventListener('change', updateTheme);
    return () => media.removeEventListener('change', updateTheme);
  }, [themeChoice]);

  useEffect(() => {
    localStorage.setItem('lt-theme', themeChoice);
  }, [themeChoice]);

  useEffect(() => {
    localStorage.setItem('lt-onboarded', hasOnboarded ? 'true' : 'false');
  }, [hasOnboarded]);

  const navigate = useCallback((screen: ScreenName, params?: Record<string, unknown>) => {
    setNavHistory(prev => [...prev, { screen, params }]);
  }, []);

  const goBack = useCallback(() => {
    setNavHistory(prev => prev.length > 1 ? prev.slice(0, -1) : prev);
  }, []);

  const addMoment = useCallback((m: Omit<Moment, 'id' | 'createdAt'>) => {
    const nm: Moment = { ...m, id: Date.now().toString(), createdAt: new Date().toISOString() };
    setMoments(prev => [nm, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, []);

  const updateMoment = useCallback((id: string, m: Partial<Moment>) => {
    setMoments(prev => prev.map(x => x.id === id ? { ...x, ...m } : x));
  }, []);

  const deleteMoment = useCallback((id: string) => {
    setMoments(prev => prev.filter(x => x.id !== id));
  }, []);

  const showBottomNav = MAIN_SCREENS.includes(navState.screen);

  const ctx: AppCtx = {
    moments, addMoment, updateMoment, deleteMoment,
    navigate, goBack, navState,
    isPremium, setPremium,
    notificationsEnabled, setNotificationsEnabled,
    selectedCategories, setSelectedCategories,
    passcodeEnabled, setPasscodeEnabled,
    themeChoice, setThemeChoice,
    darkMode,
    hasOnboarded, setHasOnboarded,
  };

  return (
    <AppContext.Provider value={ctx}>
      <div style={{
        background: 'var(--c-bg)',
        minHeight: '100vh',
        maxWidth: '430px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: showBottomNav ? 72 : 0, display: 'flex', flexDirection: 'column' }}>
          <Router />
        </div>
        {showBottomNav && <BottomNav />}
      </div>
    </AppContext.Provider>
  );
}
