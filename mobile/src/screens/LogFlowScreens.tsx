import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { ArrowLeft, Mic, Square, Play, Pause, Check, Sparkles } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../AppContext';
import { useAppTheme } from '../theme';

export function LogVoiceScreen() {
  const navigation = useNavigation<any>();
  const { C, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();
  
  const [state, setState] = useState<'idle' | 'recording' | 'done'>('idle');
  const [seconds, setSeconds] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRec = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === 'granted') {
        await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
        const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
        setRecording(recording);
        setState('recording');
        setSeconds(0);
        timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
      } else {
        Alert.alert('Permission needed', 'Please grant microphone access to record voice notes.');
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRec = async () => {
    setState('done');
    if (timerRef.current) clearInterval(timerRef.current);
    if (recording) {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setAudioUri(uri);
      setRecording(null);
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
    }
  };

  const togglePlayback = async () => {
    if (playing) {
      if (sound) await sound.pauseAsync();
      setPlaying(false);
    } else {
      if (!sound && audioUri) {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: audioUri },
          { shouldPlay: true }
        );
        newSound.setOnPlaybackStatusUpdate(status => {
          if (status.isLoaded && status.didJustFinish) {
            setPlaying(false);
          }
        });
        setSound(newSound);
        setPlaying(true);
      } else if (sound) {
        await sound.playAsync();
        setPlaying(true);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (sound) sound.unloadAsync();
    };
  }, [sound]);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ backgroundColor: C.card, borderBottomWidth: 1, borderBottomColor: C.border, paddingTop: insets.top + 16, paddingHorizontal: 16, paddingBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ backgroundColor: isDark ? '#2A2A2A' : '#F2EFEB', borderRadius: 18, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}>
          <ArrowLeft size={18} color={C.text} />
        </TouchableOpacity>
        <Text style={{ fontSize: 17, fontWeight: '700', color: C.text }}>Voice Note</Text>
      </View>

      <View style={{ flex: 1, alignItems: 'center', paddingVertical: 60, paddingHorizontal: 32, gap: 32 }}>
        {/* Fake waveform */}
        <View style={{ height: 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
          {Array.from({ length: 30 }, (_, i) => (
            <View key={i} style={{ width: 4, height: state === 'recording' ? Math.random() * 50 + 10 : 8, borderRadius: 2, backgroundColor: state === 'recording' ? C.primary : C.border }} />
          ))}
        </View>

        <Text style={{ fontSize: 48, fontWeight: '800', color: C.text, letterSpacing: -1 }}>{fmt(seconds)}</Text>
        
        <Text style={{ fontSize: 15, color: C.textSoft, textAlign: 'center', maxWidth: 260, lineHeight: 22 }}>
          {state === 'idle' && 'Press the button to start recording your voice note.'}
          {state === 'recording' && 'Recording... speak your memory aloud.'}
          {state === 'done' && 'Your voice note has been captured. Listen back or save it.'}
        </Text>

        {state !== 'done' ? (
          <TouchableOpacity
            onPress={state === 'idle' ? startRec : stopRec}
            style={{
              width: 80, height: 80, borderRadius: 40,
              backgroundColor: state === 'recording' ? '#FF4444' : C.primary,
              alignItems: 'center', justifyContent: 'center',
              shadowColor: state === 'recording' ? '#FF4444' : C.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 24, elevation: 8,
            }}
          >
            {state === 'idle' ? <Mic size={32} color="white" /> : <Square size={28} color="white" fill="white" />}
          </TouchableOpacity>
        ) : (
          <View style={{ gap: 12, width: '100%' }}>
            <TouchableOpacity onPress={togglePlayback} style={{ backgroundColor: C.card, borderWidth: 1.5, borderColor: C.border, borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              {playing ? <Pause size={18} color={C.text} /> : <Play size={18} color={C.text} />}
              <Text style={{ fontSize: 15, fontWeight: '600', color: C.text }}>{playing ? 'Pause' : 'Play back'} ({fmt(seconds)})</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ backgroundColor: C.primary, borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 4 }}>
              <Check size={18} color="white" />
              <Text style={{ fontSize: 15, fontWeight: '700', color: 'white' }}>Attach to memory</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setState('idle'); setSeconds(0); setAudioUri(null); if (sound) { sound.unloadAsync(); setSound(null); } }} style={{ padding: 10, alignItems: 'center' }}>
              <Text style={{ color: C.textSoft, fontSize: 14 }}>Re-record</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

export function LogSuccessScreen() {
  const navigation = useNavigation<any>();
  const { moments } = useApp();
  const latest = moments[0];

  return (
    <View style={{ flex: 1, backgroundColor: '#D84E3B', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <View style={{ width: 90, height: 90, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
        <Text style={{ fontSize: 44 }}>✨</Text>
      </View>

      <View style={{ alignItems: 'center', marginBottom: 32 }}>
        <Text style={{ color: 'white', fontSize: 28, fontWeight: '800', marginBottom: 8 }}>Memory saved</Text>
        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, marginBottom: 20 }}>You've captured a moment that will matter.</Text>
        
        {latest && (
          <View style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', borderRadius: 14, paddingVertical: 14, paddingHorizontal: 18, width: '100%' }}>
            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6 }}>Just logged</Text>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>{latest.title}</Text>
          </View>
        )}
      </View>

      <View style={{ width: '100%', gap: 12 }}>
        <TouchableOpacity onPress={() => navigation.navigate('Log')} style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)', borderRadius: 14, padding: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Sparkles size={16} color="white" />
          <Text style={{ color: 'white', fontSize: 15, fontWeight: '700' }}>Log another moment</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{ backgroundColor: 'white', borderRadius: 14, padding: 15, alignItems: 'center' }}>
          <Text style={{ color: '#D84E3B', fontSize: 15, fontWeight: '700' }}>Back to home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Timeline')} style={{ padding: 8, alignItems: 'center' }}>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>View in timeline →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
