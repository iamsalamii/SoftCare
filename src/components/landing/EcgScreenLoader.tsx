import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface EcgScreenLoaderProps {
  onComplete: () => void;
  onStartReveal?: () => void;
}

export const EcgScreenLoader: React.FC<EcgScreenLoaderProps> = ({ onComplete, onStartReveal }) => {
  const [progress, setProgress] = useState(0);
  const [isSplitting, setIsSplitting] = useState(false);
  const [statusText, setStatusText] = useState("Synchronisation des plateaux CHU...");
  const [isDismissed, setIsDismissed] = useState(() => {
    if (typeof window !== 'undefined') {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const alreadySeen = sessionStorage.getItem('softcare_loader_seen');
      return Boolean(prefersReduced || alreadySeen);
    }
    return false;
  });
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (isDismissed) {
      onComplete();
      return;
    }

    // Bloquer le scroll pendant le chargement
    document.body.style.overflow = 'hidden';

    const startTime = performance.now();
    const duration = 2200; // 2.2s de tracé dynamique

    const updateProgress = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const rawProgress = Math.min(1, elapsed / duration);
      // Courbe d'accélération fluide
      const easeProgress = rawProgress < 0.5
        ? 2 * rawProgress * rawProgress
        : 1 - Math.pow(-2 * rawProgress + 2, 2) / 2;

      const currentPercent = Math.round(easeProgress * 100);
      setProgress(currentPercent);

      if (currentPercent > 75) {
        setStatusText("Validation sérialisée et dossier unique...");
      } else if (currentPercent > 40) {
        setStatusText("Synchronisation des 5 plateaux de soins...");
      } else if (currentPercent > 15) {
        setStatusText("Initialisation du noyau clinique hospitalier...");
      }

      if (rawProgress < 1) {
        animationFrameRef.current = requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
        setStatusText("Architecture zéro-rupture • Sérialisation validée");
        sessionStorage.setItem('softcare_loader_seen', 'true');

        setTimeout(() => {
          setIsSplitting(true);
          onStartReveal?.();
        }, 180);

        setTimeout(() => {
          document.body.style.overflow = '';
          setIsDismissed(true);
          onComplete();
        }, 1050); // 900ms d'animation d'ouverture
      }
    };

    animationFrameRef.current = requestAnimationFrame(updateProgress);

    return () => {
      document.body.style.overflow = '';
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isDismissed, onComplete, onStartReveal]);

  if (isDismissed || typeof document === 'undefined') return null;

  const content = (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        overflow: 'hidden',
        pointerEvents: isSplitting ? 'none' : 'auto',
      }}
      role="status"
      aria-label="Chargement du système d'information hospitalier"
    >
      {/* Rideau supérieur (Blanc jour clinique) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '50%',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid rgba(16, 185, 129, 0.25)',
          transform: isSplitting ? 'translateY(-100%)' : 'translateY(0%)',
          transition: 'transform 0.9s cubic-bezier(0.76, 0, 0.24, 1)',
          willChange: 'transform',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.05), transparent 70%)',
          }}
        />
        {/* Logo & Version dans le volet supérieur */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            opacity: isSplitting ? 0 : 1,
            transition: 'opacity 0.4s ease-out',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '8px',
              border: '1px solid #a7f3d0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#ecfdf5',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)',
            }}
          >
            <svg style={{ width: '24px', height: '24px', color: '#059669' }} fill="none" viewBox="0 0 40 40">
              <path
                d="M4 20h8l3-10 6 22 5-16 4 9h6"
                stroke="#059669"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="20" r="2.5" fill="#10b981" />
              <circle cx="30" cy="20" r="2.5" fill="#10b981" />
            </svg>
          </div>
          <span style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', color: '#0f172a', fontWeight: 500, letterSpacing: '-0.02em' }}>
            SoftCare
          </span>
          <span
            style={{
              fontSize: '10px',
              fontFamily: 'Space Grotesk, monospace',
              textTransform: 'uppercase',
              padding: '3px 8px',
              borderRadius: '6px',
              border: '1px solid #a7f3d0',
              color: '#047857',
              backgroundColor: '#ecfdf5',
              fontWeight: 600,
            }}
          >
            Clinique v4.8
          </span>
        </div>
      </div>

      {/* Rideau inférieur (Blanc jour clinique) */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '50%',
          backgroundColor: '#ffffff',
          borderTop: '1px solid rgba(16, 185, 129, 0.25)',
          transform: isSplitting ? 'translateY(100%)' : 'translateY(0%)',
          transition: 'transform 0.9s cubic-bezier(0.76, 0, 0.24, 1)',
          willChange: 'transform',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at bottom, rgba(16, 185, 129, 0.04), transparent 70%)',
          }}
        />
        {/* Compteur 0-100% en bas à gauche */}
        <div
          style={{
            position: 'absolute',
            bottom: '36px',
            left: '36px',
            fontFamily: 'Fraunces, serif',
            fontSize: 'clamp(48px, 6vw, 76px)',
            color: '#059669',
            fontWeight: 400,
            lineHeight: 1,
            opacity: isSplitting ? 0 : 1,
            transition: 'opacity 0.4s ease-out',
          }}
        >
          {progress}%
        </div>

        {/* Message d'état en bas à droite */}
        <div
          style={{
            position: 'absolute',
            bottom: '36px',
            right: '36px',
            textAlign: 'right',
            opacity: isSplitting ? 0 : 1,
            transition: 'opacity 0.4s ease-out',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: '#047857',
              fontFamily: 'Space Grotesk, monospace',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '8px',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                boxShadow: '0 0 6px rgba(16, 185, 129, 0.5)',
              }}
            />
            {statusText}
          </div>
          <div
            style={{
              fontSize: '11px',
              color: '#64748b',
              fontFamily: 'Space Grotesk, monospace',
              marginTop: '4px',
            }}
          >
            Architecture zéro-rupture • Sérialisation validée
          </div>
        </div>
      </div>

      {/* Ligne ECG centrale en cours de tracé (Vert doux médical) */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          width: '100%',
          transform: 'translateY(-50%)',
          zIndex: 20,
          padding: '0 24px',
          opacity: isSplitting ? 0 : 1,
          transition: 'opacity 0.3s ease-out',
        }}
      >
        <svg
          style={{ width: '100%', height: '80px' }}
          viewBox="0 0 1200 60"
          fill="none"
        >
          {/* Ligne de fond subtile */}
          <path
            d="M0 30 H1200"
            stroke="rgba(16, 185, 129, 0.15)"
            strokeWidth="1.5"
          />
          {/* Ligne ECG animée */}
          <path
            d="M0 30 H320 L345 8 L370 52 L395 14 L420 40 L440 30 H740 L765 6 L790 54 L815 12 L840 44 L860 30 H1200"
            stroke="#10b981"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1200"
            strokeDashoffset={1200 - (1200 * (progress / 100))}
            style={{
              filter: 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.4))',
              transition: 'stroke-dashoffset 0.05s linear',
            }}
          />
        </svg>
      </div>
    </div>
  );

  return createPortal(content, document.body);
};
