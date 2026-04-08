import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MorphLoader from '../ui/MorphLoader.jsx';

export const PageTransition = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>

      {/* Actual page content — GPU composited to prevent flicker, blurred while loading */}
      <div style={{
        width: '100%',
        height: '100%',
        filter: isLoading ? 'blur(8px) brightness(0.6)' : 'blur(0px) brightness(1)',
        transform: 'translateZ(0)',           /* force GPU layer — prevents render artifacts */
        transition: 'filter 0.5s ease',
        pointerEvents: isLoading ? 'none' : 'auto',
      }}>
        {children}
      </div>

      {/* Semi-transparent overlay — content visible through it */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="overlay"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 14,
              background: 'rgba(8, 10, 16, 0.45)',  /* semi-transparent — blurred content shows */
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}
            >
              <MorphLoader size={64} />
              <span style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(168, 137, 68, 0.8)',
                fontFamily: 'inherit',
              }}>
                Loading…
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
