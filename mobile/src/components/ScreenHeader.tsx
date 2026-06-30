import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppTheme } from '../theme';

interface ScreenHeaderProps {
  title: string;
  right?: React.ReactNode;
  transparent?: boolean;
}

export function ScreenHeader({ title, right, transparent }: ScreenHeaderProps) {
  const navigation = useNavigation();
  const { C } = useAppTheme();

  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12,
      backgroundColor: transparent ? 'transparent' : C.card,
      borderBottomWidth: transparent ? 0 : 1,
      borderBottomColor: C.border,
      gap: 12,
    }}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{
        backgroundColor: '#F2EFEB',
        borderRadius: 17,
        width: 34, height: 34,
        alignItems: 'center', justifyContent: 'center',
      }}>
        <ArrowLeft size={18} color="#1A1A1A" />
      </TouchableOpacity>
      <Text style={{ flex: 1, fontSize: 17, fontWeight: '700', color: C.text }}>{title}</Text>
      {right}
    </View>
  );
}
