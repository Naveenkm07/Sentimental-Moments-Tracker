import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SAMPLE_MOMENTS } from './sampleData';
import { Moment, CategoryType, Category, CAT } from './theme';

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
  passcode: string | null;
  setPasscode: (p: string | null) => void;
  isUnlocked: boolean;
  setIsUnlocked: (v: boolean) => void;
  themeChoice: 'light' | 'dark' | 'system';
  setThemeChoice: (v: 'light' | 'dark' | 'system') => void;
  hasOnboarded: boolean;
  setHasOnboarded: (v: boolean) => void;
  categories: Record<string, Category>;
  addCategory: (id: string, cat: Category) => void;
  removeCategory: (id: string) => void;
  isLoaded: boolean;
}

export const AppContext = createContext<AppCtx>({} as AppCtx);
export const useApp = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [isPremium, setPremium] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [passcodeEnabled, setPasscodeEnabled] = useState(false);
  const [passcode, setPasscode] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [themeChoice, setThemeChoice] = useState<'light' | 'dark' | 'system'>('system');
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [customCategories, setCustomCategories] = useState<Record<string, Category>>({});
  const [selectedCategories, setSelectedCategories] = useState<CategoryType[]>([
    'parenthood', 'family', 'friendships', 'travel', 'self', 'milestones', 'other'
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

        const pc = await AsyncStorage.getItem('lt-passcode');
        if (pc) setPasscode(pc);
        
        const pce = await AsyncStorage.getItem('lt-passcodeEnabled');
        if (pce === 'true') {
          if (pc) {
            setPasscodeEnabled(true);
          } else {
            setPasscodeEnabled(false);
            AsyncStorage.setItem('lt-passcodeEnabled', 'false');
          }
        }
        
        const storedCats = await AsyncStorage.getItem('lt-categories');
        if (storedCats) {
          try { setCustomCategories(JSON.parse(storedCats)); } catch(e) {}
        }

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

  useEffect(() => {
    if (!isLoaded) return;
    AsyncStorage.setItem('lt-passcodeEnabled', passcodeEnabled ? 'true' : 'false');
    if (passcode) AsyncStorage.setItem('lt-passcode', passcode);
    else AsyncStorage.removeItem('lt-passcode');
  }, [passcodeEnabled, passcode, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    AsyncStorage.setItem('lt-categories', JSON.stringify(customCategories));
  }, [customCategories, isLoaded]);

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

  const addCategory = useCallback((id: string, cat: Category) => {
    setCustomCategories(prev => ({ ...prev, [id]: cat }));
  }, []);

  const removeCategory = useCallback((id: string) => {
    setCustomCategories(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const categories = { ...CAT, ...customCategories };

  const ctx: AppCtx = {
    moments, addMoment, updateMoment, deleteMoment,
    isPremium, setPremium,
    notificationsEnabled, setNotificationsEnabled,
    selectedCategories, setSelectedCategories,
    passcodeEnabled, setPasscodeEnabled,
    passcode, setPasscode,
    isUnlocked, setIsUnlocked,
    themeChoice, setThemeChoice,
    hasOnboarded, setHasOnboarded,
    categories, addCategory, removeCategory,
    isLoaded,
  };

  return <AppContext.Provider value={ctx}>{children}</AppContext.Provider>;
};
