import { useEffect, useMemo, useState } from 'react';

function getPrefersReducedMotion() {
  if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  const prefersReducedMotion = useMemo(() => getPrefersReducedMotion(), []);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  };

  return (
    <button
      type="button"
      className={`back-to-top ${visible ? 'visible' : ''}`}
      onClick={handleClick}
      aria-label="Back to top"
    >
      ↑
    </button>
  );
};

export default BackToTop;
