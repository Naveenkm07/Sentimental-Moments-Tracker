import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Mic, Image as ImageIcon } from 'lucide-react-native';
import { formatDistanceToNow, parseISO, format } from 'date-fns';
import { useAppTheme, CAT, MOOD, Moment } from '../theme';

interface EntryCardProps {
  moment: Moment;
  onClick?: () => void;
  compact?: boolean;
}

export function EntryCard({ moment, onClick, compact }: EntryCardProps) {
  const { C, isDark } = useAppTheme();
  const cat = CAT[moment.category];
  const mood = MOOD[moment.mood];
  const rel = formatDistanceToNow(parseISO(moment.date), { addSuffix: true });
  const catBg = isDark ? cat.darkBg : cat.lightBg;
  const moodBg = isDark ? mood.darkBg : mood.lightBg;

  return (
    <TouchableOpacity
      onPress={onClick}
      disabled={!onClick}
      style={{
        flexDirection: 'row', alignItems: 'flex-start', gap: 12,
        backgroundColor: C.card,
        borderWidth: 1, borderColor: C.border,
        borderRadius: 14, padding: 14,
        width: '100%',
        shadowColor: C.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {/* Category Icon */}
      <View style={{
        width: 44, height: 44, borderRadius: 12,
        backgroundColor: catBg, alignItems: 'center', justifyContent: 'center',
      }}>
        <Text style={{ fontSize: 20 }}>{cat.emoji}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ color: C.text, fontSize: 15, fontWeight: '600', marginBottom: 3, lineHeight: 20 }}>
          {moment.title}
        </Text>
        {!compact && moment.detail && (
          <Text numberOfLines={2} style={{ color: C.textSoft, fontSize: 13, marginBottom: 6, lineHeight: 18 }}>
            {moment.detail}
          </Text>
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
          <Text style={{ color: C.textSoft, fontSize: 12 }}>{rel}</Text>
          <Text style={{ color: C.border }}>·</Text>
          <Text style={{ fontSize: 12, fontWeight: '500', color: cat.color }}>
            {cat.label.toLowerCase()}
          </Text>
          {moment.hasVoiceNote && <Mic size={11} color={C.textSoft} />}
          {moment.hasPhoto && <ImageIcon size={11} color={C.textSoft} />}
          
          <View style={{
            marginLeft: 'auto',
            backgroundColor: moodBg,
            paddingVertical: 2, paddingHorizontal: 8, borderRadius: 20,
            flexDirection: 'row', alignItems: 'center'
          }}>
            <Text style={{ color: mood.color, fontSize: 11, fontWeight: '600' }}>
              {mood.emoji} {mood.label}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function TimelineRow({ moment, onClick }: { moment: Moment; onClick?: () => void }) {
  const { C } = useAppTheme();
  const cat = CAT[moment.category];
  const mood = MOOD[moment.mood];

  return (
    <TouchableOpacity
      onPress={onClick}
      disabled={!onClick}
      style={{
        flexDirection: 'row', alignItems: 'center', gap: 12,
        backgroundColor: C.card, borderWidth: 1, borderColor: C.border,
        borderRadius: 12, padding: 12,
        width: '100%',
        shadowColor: C.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: cat.color }} />

      <View style={{ flex: 1 }}>
        <Text style={{ color: C.text, fontSize: 14, fontWeight: '600', lineHeight: 18 }}>
          {moment.title}
        </Text>
        <Text style={{ color: C.textSoft, fontSize: 12, marginTop: 2 }}>
          {format(parseISO(moment.date), 'MMM d, yyyy')} · <Text style={{ color: mood.color }}>{mood.label}</Text>
        </Text>
      </View>

      {(moment.hasPhoto || moment.hasVoiceNote) && (
        <View style={{ flexDirection: 'row', gap: 4 }}>
          {moment.hasPhoto && <ImageIcon size={13} color={C.textSoft} />}
          {moment.hasVoiceNote && <Mic size={13} color={C.textSoft} />}
        </View>
      )}
    </TouchableOpacity>
  );
}
