import { Mic, Image } from "lucide-react";
import { formatDistanceToNow, parseISO, format } from "date-fns";
import { C, CAT, MOOD } from "../theme";
import type { Moment } from "../theme";

interface EntryCardProps {
  moment: Moment;
  onClick?: () => void;
  compact?: boolean;
}

export function EntryCard({ moment, onClick, compact }: EntryCardProps) {
  const cat = CAT[moment.category];
  const mood = MOOD[moment.mood];
  const rel = formatDistanceToNow(parseISO(moment.date), { addSuffix: true });

  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 12,
        background: C.card, border: `1px solid ${C.border}`,
        borderRadius: 14, padding: '14px 14px',
        width: '100%', textAlign: 'left', cursor: onClick ? 'pointer' : 'default',
        boxShadow: C.shadow,
      }}
    >
      {/* Category Icon */}
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: cat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, fontSize: 20,
      }}>
        {cat.emoji}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: C.text, fontSize: 15, fontWeight: 600, margin: '0 0 3px', lineHeight: 1.35 }}>
          {moment.title}
        </p>
        {!compact && moment.detail && (
          <p style={{ color: C.textSoft, fontSize: 13, margin: '0 0 6px', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {moment.detail}
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ color: C.textSoft, fontSize: 12 }}>{rel}</span>
          <span style={{ color: C.border }}>·</span>
          <span style={{
            fontSize: 12, fontWeight: 500,
            color: cat.color,
          }}>
            {cat.label.toLowerCase()}
          </span>
          {moment.hasVoiceNote && <Mic size={11} color={C.textSoft} />}
          {moment.hasPhoto && <Image size={11} color={C.textSoft} />}
          <span style={{
            marginLeft: 'auto',
            background: mood.bg, color: mood.color,
            fontSize: 11, fontWeight: 600,
            padding: '2px 8px', borderRadius: 20,
          }}>
            {mood.emoji} {mood.label}
          </span>
        </div>
      </div>
    </button>
  );
}

export function TimelineRow({ moment, onClick }: { moment: Moment; onClick?: () => void }) {
  const cat = CAT[moment.category];
  const mood = MOOD[moment.mood];

  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        background: C.card, border: `1px solid ${C.border}`,
        borderRadius: 12, padding: '12px 14px',
        width: '100%', textAlign: 'left', cursor: onClick ? 'pointer' : 'default',
        boxShadow: C.shadow,
      }}
    >
      {/* Dot */}
      <div style={{
        width: 10, height: 10, borderRadius: '50%',
        background: cat.color, flexShrink: 0,
      }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: C.text, fontSize: 14, fontWeight: 600, margin: 0, lineHeight: 1.3 }}>
          {moment.title}
        </p>
        <p style={{ color: C.textSoft, fontSize: 12, margin: '2px 0 0' }}>
          {format(parseISO(moment.date), 'MMM d, yyyy')} · <span style={{ color: mood.color }}>{mood.label}</span>
        </p>
      </div>

      {(moment.hasPhoto || moment.hasVoiceNote) && (
        <div style={{ display: 'flex', gap: 4 }}>
          {moment.hasPhoto && <Image size={13} color={C.textSoft} />}
          {moment.hasVoiceNote && <Mic size={13} color={C.textSoft} />}
        </div>
      )}
    </button>
  );
}
