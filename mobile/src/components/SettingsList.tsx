import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useAppTheme } from '../theme';
import { LiquidButton } from './LiquidButton';

interface SettingsGroupProps {
  title?: string;
  footer?: string;
  children: React.ReactNode;
}

export function SettingsGroup({ title, footer, children }: SettingsGroupProps) {
  const { C, isDark } = useAppTheme();
  
  return (
    <View style={{ marginBottom: 24 }}>
      {title && (
        <Text style={{ 
          fontSize: 13, fontWeight: '600', color: C.textSoft, 
          textTransform: 'uppercase', letterSpacing: 0.5, 
          marginLeft: 16, marginBottom: 8 
        }}>
          {title}
        </Text>
      )}
      <View style={{ 
        backgroundColor: C.card, borderRadius: 12, overflow: 'hidden', 
        borderWidth: 1, borderColor: C.border,
        shadowColor: C.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2
      }}>
        {children}
      </View>
      {footer && (
        <Text style={{ 
          fontSize: 13, color: C.textSoft, 
          marginLeft: 16, marginTop: 8, marginRight: 16 
        }}>
          {footer}
        </Text>
      )}
    </View>
  );
}

interface SettingsRowProps {
  icon?: React.ReactNode;
  iconBg?: string;
  label: string;
  value?: string;
  type?: 'link' | 'toggle' | 'button' | 'destructive';
  toggleValue?: boolean;
  onToggle?: (val: boolean) => void;
  onPress?: () => void;
  isLast?: boolean;
}

export function SettingsRow({ 
  icon, iconBg, label, value, type = 'link', 
  toggleValue, onToggle, onPress, isLast 
}: SettingsRowProps) {
  const { C } = useAppTheme();

  const content = (
    <View style={{ 
      flexDirection: 'row', alignItems: 'center', gap: 14,
      paddingVertical: 12, paddingLeft: 16, paddingRight: 16,
      borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
      borderBottomColor: C.divider,
    }}>
      {icon && (
        <View style={{ 
          width: 30, height: 30, borderRadius: 8, 
          backgroundColor: iconBg || C.primary, 
          alignItems: 'center', justifyContent: 'center' 
        }}>
          {icon}
        </View>
      )}
      <Text style={{ 
        flex: 1, fontSize: 16, fontWeight: '500', 
        color: type === 'destructive' ? '#FF3B30' : C.text 
      }}>
        {label}
      </Text>
      
      {value && <Text style={{ fontSize: 16, color: C.textSoft, marginRight: type === 'link' ? 4 : 0 }}>{value}</Text>}
      
      {type === 'link' && <ChevronRight size={18} color={C.textSoft} />}
      {type === 'toggle' && (
        <Switch 
          value={toggleValue} 
          onValueChange={onToggle}
          trackColor={{ false: C.border, true: C.primary }}
        />
      )}
    </View>
  );

  if (type === 'toggle' || !onPress) {
    return content; 
  }

  return (
    <LiquidButton onPress={onPress} activeScale={0.97} style={{ backgroundColor: 'transparent', padding: 0 }}>
      {content}
    </LiquidButton>
  );
}
