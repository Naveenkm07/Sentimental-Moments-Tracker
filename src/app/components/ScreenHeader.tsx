import { ArrowLeft } from "lucide-react";
import { useApp } from "../App";
import { C } from "../theme";

interface ScreenHeaderProps {
  title: string;
  right?: React.ReactNode;
  transparent?: boolean;
}

export function ScreenHeader({ title, right, transparent }: ScreenHeaderProps) {
  const { goBack } = useApp();
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      padding: '16px 16px 12px',
      background: transparent ? 'transparent' : C.card,
      borderBottom: transparent ? 'none' : `1px solid ${C.border}`,
      gap: 12,
    }}>
      <button onClick={goBack} style={{
        background: '#F2EFEB', border: 'none', borderRadius: '50%',
        width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', flexShrink: 0,
      }}>
        <ArrowLeft size={18} color={C.text} />
      </button>
      <h2 style={{ flex: 1, fontSize: 17, fontWeight: 700, color: C.text, margin: 0 }}>{title}</h2>
      {right}
    </div>
  );
}
