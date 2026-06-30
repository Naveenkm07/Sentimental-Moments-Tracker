import { useEffect } from "react";
import { motion } from "motion/react";
import { useApp } from "../App";
import { C } from "../theme";

export function SplashScreen() {
  const { navigate, hasOnboarded } = useApp();

  useEffect(() => {
    const t = setTimeout(() => {
      navigate(hasOnboarded ? 'home' : 'onboarding');
    }, 2200);
    return () => clearTimeout(t);
  }, [navigate, hasOnboarded]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #1A0A00 0%, #5C1A00 50%, #D84E3B 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 20,
    }}>
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        style={{
          width: 90, height: 90, borderRadius: 26,
          background: 'rgba(255,255,255,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 44, backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.2)',
        }}
      >
        🕰️
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        style={{ textAlign: 'center' }}
      >
        <h1 style={{
          color: 'white', fontSize: 36, fontWeight: 800,
          margin: '0 0 6px', letterSpacing: '-0.5px',
        }}>
          Last Time
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 16, margin: 0 }}>
          cherish what's still here
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        style={{ position: 'absolute', bottom: 60 }}
      >
        <div style={{ display: 'flex', gap: 6 }}>
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.6)' }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
