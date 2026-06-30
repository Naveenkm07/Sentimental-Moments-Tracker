import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Vibration, TouchableOpacity } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Delete } from 'lucide-react-native';
import { useAppTheme } from '../theme';
import { useApp } from '../AppContext';
import { LiquidButton } from '../components/LiquidButton';

interface Props {
  mode: 'unlock' | 'set' | 'change' | 'remove';
  onSuccess: () => void;
  onCancel?: () => void;
}

export function PasscodeScreen({ mode, onSuccess, onCancel }: Props) {
  const { C } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { passcode, setPasscode, setPasscodeEnabled, setIsUnlocked } = useApp();

  const [step, setStep] = useState<'current' | 'new' | 'confirm'>(
    mode === 'set' ? 'new' : 'current'
  );
  
  const [pin, setPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [error, setError] = useState(false);
  
  const shakeAnim = React.useRef(new Animated.Value(0)).current;

  const triggerError = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => Vibration.vibrate(50));
    setError(true);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true })
    ]).start(() => {
      setPin('');
      setError(false);
    });
  };

  useEffect(() => {
    if (mode === 'unlock') {
      tryBiometricUnlock();
    }
  }, []);

  const tryBiometricUnlock = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (hasHardware && isEnrolled) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Unlock Last Time',
          fallbackLabel: 'Use Passcode',
        });
        if (result.success) {
          setIsUnlocked(true);
          onSuccess();
        }
      }
    } catch (e) {
      // Ignore errors on web or unsupported platforms
    }
  };

  useEffect(() => {
    if (pin.length === 4) {
      setTimeout(() => {
        handleCompletePin(pin);
      }, 50);
    }
  }, [pin]);

  const handleCompletePin = (enteredPin: string) => {
    if (step === 'current') {
      if (enteredPin === passcode) {
        setPin('');
        if (mode === 'unlock') {
          setIsUnlocked(true);
          onSuccess();
        } else if (mode === 'change') {
          setStep('new');
        } else if (mode === 'remove') {
          setPasscodeEnabled(false);
          setPasscode(null);
          onSuccess();
        }
      } else {
        triggerError();
      }
    } else if (step === 'new') {
      setNewPin(enteredPin);
      setPin('');
      setStep('confirm');
    } else if (step === 'confirm') {
      if (enteredPin === newPin) {
        setPasscode(enteredPin);
        setPasscodeEnabled(true);
        if (mode === 'unlock') setIsUnlocked(true);
        onSuccess();
      } else {
        triggerError();
        setStep('new');
        setNewPin('');
      }
    }
  };

  const handlePress = (val: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (pin.length < 4) setPin(pin + val);
  };

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setPin(pin.slice(0, -1));
  };

  let title = 'Enter Passcode';
  if (step === 'new') title = 'Enter New Passcode';
  if (step === 'confirm') title = 'Confirm New Passcode';
  if (mode === 'remove') title = 'Enter Current Passcode to Disable';

  const textCol = '#FFFFFF';
  const bgCol = '#0A0A0A';

  return (
    <View style={{ flex: 1, backgroundColor: bgCol, paddingTop: insets.top, paddingBottom: insets.bottom }}>
      {onCancel && mode !== 'unlock' && (
        <LiquidButton onPress={onCancel} activeScale={0.9} style={{ position: 'absolute', top: insets.top + 16, right: 16, zIndex: 10, width: 44, height: 44, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 22 }}>
          <X size={20} color={textCol} />
        </LiquidButton>
      )}

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 64, marginBottom: 24 }}>🕰️</Text>
        <Text style={{ fontSize: 20, fontWeight: '600', color: textCol, marginBottom: 40 }}>{title}</Text>

        <Animated.View style={{ flexDirection: 'row', gap: 24, marginBottom: 60, transform: [{ translateX: shakeAnim }] }}>
          {[0, 1, 2, 3].map(i => {
            const isFilled = pin.length > i;
            return (
              <View key={i} style={{
                width: 16, height: 16, borderRadius: 8,
                backgroundColor: isFilled ? C.primary : 'transparent',
                borderWidth: 2, borderColor: isFilled ? C.primary : 'rgba(255,255,255,0.3)',
                ...(error && !isFilled ? { borderColor: '#FF3B30' } : {})
              }} />
            );
          })}
        </Animated.View>

        <View style={{ width: 280, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 24 }}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map((key, i) => {
            if (key === '') return <View key={i} style={{ width: 72, height: 72 }} />;
            if (key === 'del') return (
              <TouchableOpacity key={i} onPress={handleDelete} activeOpacity={0.7} style={{ width: 72, height: 72, alignItems: 'center', justifyContent: 'center' }}>
                <Delete size={24} color={textCol} />
              </TouchableOpacity>
            );
            return (
              <TouchableOpacity key={i} onPress={() => handlePress(key)} activeOpacity={0.7} style={{
                width: 72, height: 72, borderRadius: 36,
                backgroundColor: 'rgba(255,255,255,0.1)',
                alignItems: 'center', justifyContent: 'center'
              }}>
                <Text style={{ fontSize: 32, fontWeight: '500', color: textCol }}>{key}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}