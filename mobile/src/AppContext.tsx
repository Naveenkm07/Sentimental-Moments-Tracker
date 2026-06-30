import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SAMPLE_MOMENTS } from './sampleData';
import { Moment, CategoryType, ScreenName, NavState } from './theme';

export interface AppCtx {
  moments: Moment[];
  addMoment: (m: Omit<Moment, 'id' | 'createdAt'>) => void;
  updateMoment: (id: string, m: Partial<Moment>) => void;
  deleteMoment: (id: string) => void;
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
  hasOnboarded: boolean;
  setHasOnboarded: (v: boolean) => void;
  isLoaded: boolean;
}

export const AppContext = createContext<AppCtx>({} as AppCtx);
export const useApp = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [isPremium, setPremium] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [passcodeEnabled, setPasscodeEnabled] = useState(false);
  const [themeChoice, setThemeChoice] = useState<'light' | 'dark' | 'system'>('system');
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<CategoryType[]>([
    'parenthood', 'family', 'friendships', 'travel', 'self', 'milestones'
  ]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const m = await AsyncStorage.getItem('lt-moments');
        if (m) setMoments(JSON.parse(m));
        else setMoments(SAMPLE_MOMENTS);

        const t = await AsyncStorage.getItem('lt-theme');
        if (t) setThemeChoice(t as any);

        const o = await AsyncStorage.getItem('lt-onboarded');
        if (o === 'true') setHasOnboarded(true);

      } catch (e) {
        setMoments(SAMPLE_MOMENTS);
      } finally {
        setIsLoaded(true);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    AsyncStorage.setItem('lt-moments', JSON.stringify(moments));
  }, [moments, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    AsyncStorage.setItem('lt-theme', themeChoice);
  }, [themeChoice, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    AsyncStorage.setItem('lt-onboarded', hasOnboarded ? 'true' : 'false');
  }, [hasOnboarded, isLoaded]);

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

  const ctx: AppCtx = {
    moments, addMoment, updateMoment, deleteMoment,
    isPremium, setPremium,
    notificationsEnabled, setNotificationsEnabled,
    selectedCategories, setSelectedCategories,
    passcodeEnabled, setPasscodeEnabled,
    themeChoice, setThemeChoice,
    hasOnboarded, setHasOnboarded,
    isLoaded,
  };

  return <AppContext.Provider value={ctx}>{children}</AppContext.Provider>;
};
