export const C = {
  bg: 'var(--c-bg)',
  card: 'var(--c-card)',
  primary: 'var(--c-primary)',
  primaryLight: 'var(--c-primary-light)',
  amber: 'var(--c-amber)',
  amberLight: 'var(--c-amber-light)',
  text: 'var(--c-text)',
  textMid: 'var(--c-text-mid)',
  textSoft: 'var(--c-text-soft)',
  border: 'var(--c-border)',
  divider: 'var(--c-divider)',
  green: '#2BB57A',
  blue: '#4C79FF',
  purple: '#9B5EDB',
  teal: '#2BB5D3',
  shadow: 'var(--c-shadow)',
  shadowMd: 'var(--c-shadow-md)',
} as const;

export const CAT = {
  parenthood:  { emoji: '👶', color: '#FF7040', bg: 'var(--cat-parenthood-bg, #FFF2EC)', label: 'Parenthood' },
  family:      { emoji: '🏡', color: '#4C79FF', bg: 'var(--cat-family-bg, #EEF3FF)', label: 'Family' },
  friendships: { emoji: '🤝', color: '#9B5EDB', bg: 'var(--cat-friendships-bg, #F5F0FF)', label: 'Friendships' },
  travel:      { emoji: '✈️', color: '#2BB5D3', bg: 'var(--cat-travel-bg, #E8F9FF)', label: 'Travel' },
  self:        { emoji: '🌱', color: '#2BB57A', bg: 'var(--cat-self-bg, #E8FFF4)', label: 'Self' },
  milestones:  { emoji: '🎯', color: '#FF5A5A', bg: 'var(--cat-milestones-bg, #FFF0F0)', label: 'Milestones' },
  other:       { emoji: '✨', color: '#8A8A8A', bg: 'var(--cat-other-bg, #F5F5F5)', label: 'Other' },
} as const;

export const MOOD = {
  bittersweet: { emoji: '🍂', label: 'Bittersweet', color: '#E86B3A', bg: 'var(--mood-bittersweet-bg, #FFF2EC)' },
  grateful:    { emoji: '🌟', label: 'Grateful',    color: '#C49010', bg: 'var(--mood-grateful-bg, #FFF9E0)' },
  nostalgic:   { emoji: '🌙', label: 'Nostalgic',   color: '#7B5EA7', bg: 'var(--mood-nostalgic-bg, #F4EFFF)' },
  peaceful:    { emoji: '🌿', label: 'Peaceful',    color: '#2B9B64', bg: 'var(--mood-peaceful-bg, #E8FFF4)' },
  joyful:      { emoji: '☀️', label: 'Joyful',      color: '#D4900A', bg: 'var(--mood-joyful-bg, #FFFAEA)' },
  melancholic: { emoji: '🌧', label: 'Melancholic', color: '#5B8FCA', bg: 'var(--mood-melancholic-bg, #EEF5FF)' },
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
