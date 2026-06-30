import { Home, Clock, BarChart2, Settings, User, Plus } from "lucide-react";
import { useApp } from "../App";
import type { ScreenName } from "../theme";
import { C } from "../theme";

const tabs: { screen: ScreenName; icon: typeof Home; label: string }[] = [
  { screen: 'home',     icon: Home,     label: 'Home' },
  { screen: 'timeline', icon: Clock,    label: 'Timeline' },
  { screen: 'stats',    icon: BarChart2,label: 'Stats' },
  { screen: 'settings', icon: Settings, label: 'Settings' },
  { screen: 'profile',  icon: User,     label: 'Profile' },
];

export function BottomNav() {
  const { navigate, navState } = useApp();
  const cur = navState.screen;

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '430px',
      background: '#FFFFFF',
      borderTop: `1px solid ${C.border}`,
      display: 'flex',
      alignItems: 'center',
      height: '72px',
      zIndex: 100,
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {tabs.slice(0, 2).map(tab => (
        <TabBtn key={tab.screen} tab={tab} active={cur === tab.screen} />
      ))}

      {/* Center FAB */}
      <button
        onClick={() => navigate('log')}
        style={{
          width: 50, height: 50,
          borderRadius: '50%',
          background: C.primary,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '3px solid #F9F7F4',
          boxShadow: `0 4px 16px rgba(216,78,59,0.40)`,
          cursor: 'pointer',
          flexShrink: 0,
          marginTop: -16,
        }}
      >
        <Plus size={22} color="white" strokeWidth={2.5} />
      </button>

      {tabs.slice(2).map(tab => (
        <TabBtn key={tab.screen} tab={tab} active={cur === tab.screen} />
      ))}
    </nav>
  );
}

function TabBtn({ tab, active }: { tab: typeof tabs[0]; active: boolean }) {
  const { navigate } = useApp();
  const Icon = tab.icon;
  return (
    <button
      onClick={() => navigate(tab.screen)}
      style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 3,
        background: 'none', border: 'none', cursor: 'pointer',
        color: active ? C.primary : '#B0ABA6',
        paddingTop: 4,
      }}
    >
      <Icon size={21} strokeWidth={active ? 2.5 : 1.8} />
      <span style={{ fontSize: 10, fontWeight: active ? 600 : 400, letterSpacing: '0.02em' }}>
        {tab.label}
      </span>
    </button>
  );
}
