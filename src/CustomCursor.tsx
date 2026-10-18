import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';

const LABELS: Record<string, string> = {
  view: 'VIEW',
  play: '▶',
  link: '↗',
  drag: '↔',
  close: '✕',
};

const CLICKABLE_SELECTOR =
  'a, button, [role="button"], input[type="button"], input[type="submit"], input[type="reset"], input[type="range"], select, summary, .theme-sliding-switch, .clickable, [tabindex]:not([tabindex="-1"]), .logo, .nav-atom-wrap, .standalone-nav-brand, .user-chip, #user-profile-btn, [data-route], .slider, .slider-thumb, .rotary-knob';

export default function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 600, damping: 45, mass: 0.25 });
  const springY = useSpring(y, { stiffness: 600, damping: 45, mass: 0.25 });

  const [mode, setMode] = useState<string | null>(null);
  const [hoverLink, setHoverLink] = useState(false);
  const [visible, setVisible] = useState(false);
  const [down, setDown] = useState(false);

  const modeRef = useRef<string | null>(null);
  const hoverLinkRef = useRef(false);
  const visibleRef = useRef(false);
  const downRef = useRef(false);

  useEffect(() => {
    // Only enable on pointer-fine non-touch devices
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isFinePointer) return;

    document.documentElement.classList.add('has-custom-cursor', 'custom-cursor-active');

    const handlePointerMove = (e: PointerEvent) => {
      // 1. Direct coordinate motion value update (no React re-renders)
      x.set(e.clientX);
      y.set(e.clientY);

      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }

      // 2. Resolve cursor mode with nested closest() priority
      const t = e.target as HTMLElement | null;
      const tagged = t?.closest<HTMLElement>('[data-cursor]');
      const cursorMode = tagged?.dataset.cursor ?? null;
      const nextHoverLink = !cursorMode && Boolean(t?.closest(CLICKABLE_SELECTOR));

      // 3. Update React state ONLY when resolved interaction mode genuinely changes
      if (cursorMode !== modeRef.current) {
        modeRef.current = cursorMode;
        setMode(cursorMode);
      }
      if (nextHoverLink !== hoverLinkRef.current) {
        hoverLinkRef.current = nextHoverLink;
        setHoverLink(nextHoverLink);
      }
    };

    const handlePointerLeave = () => {
      if (visibleRef.current) {
        visibleRef.current = false;
        setVisible(false);
      }
    };

    const handlePointerDown = () => {
      if (!downRef.current) {
        downRef.current = true;
        setDown(true);
      }
    };

    const handlePointerUp = () => {
      if (downRef.current) {
        downRef.current = false;
        setDown(false);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });

    return () => {
      document.documentElement.classList.remove('has-custom-cursor', 'custom-cursor-active');
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [x, y]);

  const label = mode ? LABELS[mode] : null;
  // Size: special labels (view: 72, others: 52), generic clickable hover: 18px, default: 10px
  const size = label ? (mode === 'view' ? 72 : 52) : hoverLink ? 18 : 10;

  return (
    // Outer positioning container: fixed to viewport, centered once via motion values
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[200]"
      style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%' }}
    >
      {/* Inner visual element: Handles scaling, colors, borders, and labels without displacing coordinates */}
      <motion.div
        className="flex items-center justify-center rounded-full"
        animate={{
          width: size,
          height: size,
          opacity: visible ? 1 : 0,
          scale: down ? 0.85 : 1,
          backgroundColor: label
            ? 'rgba(59,130,246,0.94)' // PhysiX Blue accent
            : hoverLink
              ? 'rgba(59,130,246,0.95)' // Enlarged 18px PhysiX Blue circle on clickable hover
              : 'rgba(244,241,236,1)', // Normal 10px white dot
          borderColor: label
            ? 'rgba(96,165,250,0.4)'
            : hoverLink
              ? 'rgba(96,165,250,0.5)'
              : 'rgba(244,241,236,0)',
          boxShadow: label
            ? (mode === 'view' ? '0 0 25px rgba(59,130,246,0.45)' : '0 0 20px rgba(59,130,246,0.45)')
            : hoverLink
              ? '0 0 14px rgba(59,130,246,0.45)'
              : '0 0 0 1px rgba(15,23,42,0.2), 0 1px 3px rgba(0,0,0,0.35)',
        }}
        transition={{ type: 'spring', stiffness: 420, damping: 30 }}
      >
        <span className="absolute inset-0 rounded-full border" style={{ borderColor: 'inherit' }} />
        <AnimatePresence>
          {label && (
            <motion.span
              key={label}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="font-sans text-[11px] font-bold tracking-[0.18em] text-white"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
