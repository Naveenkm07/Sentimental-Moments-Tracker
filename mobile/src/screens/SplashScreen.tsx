import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../AppContext';

export function SplashScreen() {
  const navigation = useNavigation<any>();
  const { hasOnboarded, isLoaded } = useApp();

  useEffect(() => {
    if (!isLoaded) return;
    const t = setTimeout(() => {
      navigation.reset({ index: 0, routes: [{ name: hasOnboarded ? 'Home' : 'Onboarding' }] });
    }, 2200);
    return () => clearTimeout(t);
  }, [navigation, hasOnboarded, isLoaded]);

  return (
    <View style={{
      flex: 1,
      backgroundColor: '#D84E3B', // Fake gradient color for now
      alignItems: 'center', justifyContent: 'center',
      gap: 20,
    }}>
      <View style={{
        width: 90, height: 90, borderRadius: 26,
        backgroundColor: 'rgba(255,255,255,0.12)',
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
      }}>
        <Text style={{ fontSize: 44 }}>🕰️</Text>
      </View>

      <View style={{ alignItems: 'center' }}>
        <Text style={{ color: 'white', fontSize: 36, fontWeight: '800', marginBottom: 6, letterSpacing: -0.5 }}>
          Last Time
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 16 }}>
          cherish what's still here
        </Text>
      </View>
    </View>
  );
}
