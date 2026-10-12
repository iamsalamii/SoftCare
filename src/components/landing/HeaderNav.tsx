import React, { useState, useEffect } from 'react';

interface HeaderNavProps {
  onGoToLogin: () => void;
  onOpenDemo: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ onGoToLogin, onOpenDemo }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 60);

      const winHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const totalScroll = docHeight - winHeight;
      if (totalScroll > 0) {
        const progress = Math.min(100, Math.max(0, (scrollY / totalScroll) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Parcours de soins', href: '#parcours' },
    { label: 'Modules cliniques', href: '#modules' },
    { label: 'Le produit en action', href: '#produit' },
    { label: 'IA décisionnelle', href: '#intelligence' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      {/* Fin trait néon vert en haut de l'écran indiquant la progression du scroll */}
      <div
        className="fixed top-0 left-0 right-0 h-[3px] z-[60] bg-transparent pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="h-full bg-gradient-to-r from-emerald via-neon to-mint transition-[width] duration-75 ease-out shadow-[0_0_12px_rgba(0,220,130,0.8)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Header Bar */}
      <header
        id="site-header"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#021411]/95 backdrop-blur-md border-b border-[#09382f]/80 py-4 shadow-lg'
            : 'bg-transparent border-b border-transparent py-6'
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-6 flex items-center justify-between">
          {/* Logo institutionnel */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded border border-neon/50 flex items-center justify-center bg-deep/80 shadow-neon-sm group-hover:border-neon group-hover:shadow-neon-glow transition-all duration-300">
              <svg
                className="w-5 h-5 text-neon transition-transform duration-300 group-hover:scale-110"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="M2 12h5l2-6 4 13 3-9 2 5h4"
                  stroke="#00dc82"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl tracking-tight text-white group-hover:text-mint transition-colors">
                SoftCare
              </span>
              <span className="text-[9px] font-mono text-neon tracking-widest uppercase -mt-1">
                Hospital Core OS
              </span>
            </div>
          </a>

          {/* Menu centré sur une seule ligne (Desktop) */}
          <nav
            className="hidden lg:flex items-center space-x-8 text-sm font-medium text-[#bacbbc]"
            aria-label="Navigation principale"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-neon transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Boutons d'action à droite (Desktop) */}
          <div className="hidden lg:flex items-center space-x-5">
            <button
              onClick={onGoToLogin}
              type="button"
              className="text-sm font-medium text-[#bacbbc] hover:text-white transition-colors duration-200 cursor-pointer"
            >
              Se connecter
            </button>
            <button
              onClick={onOpenDemo}
              type="button"
              className="text-sm px-5 py-2.5 rounded bg-gradient-to-r from-emerald via-neon to-mint text-darkforest font-bold transition-all duration-300 hover:shadow-neon-glow hover:brightness-110 active:scale-95 cursor-pointer shadow-neon-sm"
            >
              Demander une démo
            </button>
          </div>

          {/* Bouton Menu Mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            type="button"
            className="lg:hidden p-2 text-white/80 hover:text-white cursor-pointer focus:outline-none"
            aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={isMobileMenuOpen}
          >
            <svg
              className="w-6 h-6 text-neon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Menu Mobile Tiroir */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#021411] border-b border-[#09382f] px-6 py-6 space-y-4 shadow-xl">
            <nav className="flex flex-col space-y-3" aria-label="Navigation mobile">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-medium text-[#bacbbc] hover:text-neon py-1.5 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="pt-4 border-t border-[#09382f] flex flex-col space-y-3">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onGoToLogin();
                }}
                type="button"
                className="w-full text-center text-sm font-medium text-white/90 hover:text-white py-2.5 rounded-lg border border-neon/30 bg-[#041f1a]"
              >
                Se connecter
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenDemo();
                }}
                type="button"
                className="w-full text-center bg-gradient-to-r from-emerald via-neon to-mint text-darkforest font-bold text-sm py-3 rounded-lg shadow-neon-sm"
              >
                Demander une démo
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
