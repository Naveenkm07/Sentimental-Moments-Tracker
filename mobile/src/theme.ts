import { useColorScheme } from 'react-native';

export const lightC = {
  bg: '#F9F7F4',
  card: '#FFFFFF',
  primary: '#D84E3B',
  primaryLight: '#FFF0EE',
  amber: '#F5A623',
  amberLight: '#FFF8EC',
  text: '#1A1A1A',
  textMid: '#444444',
  textSoft: '#8A8A8A',
  border: '#EBEBEB',
  divider: '#F5F2EF',
  green: '#2BB57A',
  blue: '#4C79FF',
  purple: '#9B5EDB',
  teal: '#2BB5D3',
  shadow: '#000000', // RN uses shadowColor, shadowOffset, shadowOpacity, shadowRadius
} as const;

export const darkC = {
  bg: '#121212',
  card: '#1E1E1E',
  primary: '#D84E3B',
  primaryLight: '#3D1C17',
  amber: '#F5A623',
  amberLight: '#3D2D11',
  text: '#EDEDED',
  textMid: '#A1A1A1',
  textSoft: '#666666',
  border: '#2A2A2A',
  divider: '#202020',
  green: '#2BB57A',
  blue: '#4C79FF',
  purple: '#9B5EDB',
  teal: '#2BB5D3',
  shadow: '#000000',
} as const;

export function useAppTheme() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  return {
    C: isDark ? darkC : lightC,
    isDark
  };
}

export const CAT = {
  parenthood:  { emoji: '👶', color: '#FF7040', lightBg: '#FFF2EC', darkBg: '#3D1C17', label: 'Parenthood' },
  family:      { emoji: '🏡', color: '#4C79FF', lightBg: '#EEF3FF', darkBg: '#1A243D', label: 'Family' },
  friendships: { emoji: '🤝', color: '#9B5EDB', lightBg: '#F5F0FF', darkBg: '#2C1A3D', label: 'Friendships' },
  travel:      { emoji: '✈️', color: '#2BB5D3', lightBg: '#E8F9FF', darkBg: '#1A343D', label: 'Travel' },
  self:        { emoji: '🌱', color: '#2BB57A', lightBg: '#E8FFF4', darkBg: '#1A3D2C', label: 'Self' },
  milestones:  { emoji: '🎯', color: '#FF5A5A', lightBg: '#FFF0F0', darkBg: '#3D1A1A', label: 'Milestones' },
  other:       { emoji: '✨', color: '#8A8A8A', lightBg: '#F5F5F5', darkBg: '#2A2A2A', label: 'Other' },
} as const;

export const MOOD = {
  bittersweet: { emoji: '🍂', label: 'Bittersweet', color: '#E86B3A', lightBg: '#FFF2EC', darkBg: '#3D1C17' },
  grateful:    { emoji: '🌟', label: 'Grateful',    color: '#C49010', lightBg: '#FFF9E0', darkBg: '#3D3511' },
  nostalgic:   { emoji: '🌙', label: 'Nostalgic',   color: '#7B5EA7', lightBg: '#F4EFFF', darkBg: '#2C1A3D' },
  peaceful:    { emoji: '🌿', label: 'Peaceful',    color: '#2B9B64', lightBg: '#E8FFF4', darkBg: '#1A3D2C' },
  joyful:      { emoji: '☀️', label: 'Joyful',      color: '#D4900A', lightBg: '#FFFAEA', darkBg: '#3D3A11' },
  melancholic: { emoji: '🌧', label: 'Melancholic', color: '#5B8FCA', lightBg: '#EEF5FF', darkBg: '#1A243D' },
} as const;

export type MoodType = keyof typeof MOOD;
export type CategoryType = keyof typeof CAT;

export interface Moment {
  id: string;
  title: string;
  detail?: string;
  date: string;
  category: CategoryType;
  mood: MoodType;
  hasVoiceNote?: boolean;
  hasPhoto?: boolean;
  photoUrl?: string;
  createdAt: string;
}

export type ScreenName =
  | 'splash'
  | 'onboarding'
  | 'home'
  | 'search'
  | 'log'
  | 'log-voice'
  | 'log-success'
  | 'timeline'
  | 'moment-detail'
  | 'moment-edit'
  | 'moment-delete'
  | 'stats'
  | 'stats-mood'
  | 'settings'
  | 'settings-notifications'
  | 'settings-categories'
  | 'settings-backup'
  | 'settings-passcode'
  | 'settings-theme'
  | 'profile'
  | 'memory-resurface'
  | 'annual-summary'
  | 'keepsake'
  | 'keepsake-export'
  | 'family-timeline'
  | 'family-invite'
  | 'help'
  | 'about';

export interface NavState {
  screen: ScreenName;
  params?: Record<string, unknown>;
}
