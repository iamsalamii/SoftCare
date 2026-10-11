/**
 * SOFTCARE MOTION TOKENS
 * Design System - Animations & Transitions Cliniques
 *
 * Principes :
 * - Respect strict de 'prefers-reduced-motion'
 * - Courbes cubiques naturelles (sans à-coups ni inertie exagérée)
 * - Durées ciblées (<350ms) pour ne jamais retarder le flux soignant
 */

export const motionTokens = {
  duration: {
    instant: '75ms',
    fast: '150ms',
    normal: '240ms',
    smooth: '350ms',
    ambient: '600ms',
  },
  easing: {
    // Entrée vive avec décélération douce (recommandé pour les dashboards)
    decelerate: 'cubic-bezier(0.16, 1, 0.3, 1)',
    // Standard UI interaction
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
    // Transition symétrique
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    // Sortie nette
    accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
  },
  transitions: {
    pageEnter: 'pageEnter 240ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
    fadeIn: 'fadeIn 180ms ease-out forwards',
    cardHover: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
    microInteraction: 'transform 120ms cubic-bezier(0.2, 0, 0, 1)',
  },
} as const;

export default motionTokens;
