/**
 * PhysiX — Cinematic Sideways Experiment Card Entrance System
 * 
 * Implements smooth sideways-sliding scroll entrance inspired by ProjectCard:
 * - Alternating left/right horizontal slide (±48px X)
 * - Subtle vertical offset (+26px Y)
 * - Blur-to-clear transition (blur: 10px -> 0px)
 * - Opacity fade (0 -> 1)
 * - Staggered entrance timing (index % 3 * 0.08s)
 * - Animate-once via IntersectionObserver (rootMargin: '0px 0px -8% 0px')
 * - Independent hover lift & scale
 * - prefers-reduced-motion support
 */

let cardObserver = null;
const observedCards = new WeakSet();

/**
 * Initialize scroll-driven entrance animations on experiment cards
 */
export function initCardScrollAnimations(targetContainer = null) {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return { refresh: () => {}, destroy: () => {} };
  }

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Clean up existing observer if re-initializing
  if (cardObserver) {
    cardObserver.disconnect();
    cardObserver = null;
  }

  // Find containers to observe
  const containers = targetContainer
    ? (typeof targetContainer === "string" ? Array.from(document.querySelectorAll(targetContainer)) : [targetContainer])
    : Array.from(document.querySelectorAll(".exp-page-grid"));

  if (containers.length === 0) {
    return { refresh: () => {}, destroy: () => {} };
  }

  // IntersectionObserver to animate cards as user scrolls into viewport
  cardObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const card = entry.target;
          card.classList.add("card-in-view");
          // Animate each card only once to prevent flickering when scrolling up and down
          obs.unobserve(card);
        }
      });
    },
    {
      root: null,
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.12
    }
  );

  containers.forEach((container) => {
    refreshContainerCards(container, prefersReduced);
  });

  function refresh() {
    containers.forEach((c) => refreshContainerCards(c, prefersReduced));
  }

  function destroy() {
    if (cardObserver) {
      cardObserver.disconnect();
      cardObserver = null;
    }
  }

  return { refresh, destroy };
}

/**
 * Configure alternating directions and observe visible cards within a container
 */
export function refreshContainerCards(container, prefersReduced = false) {
  if (!container) return;

  const isHorizontalGallery =
    container.id === "exp-page-labs-grid" ||
    (container.classList && typeof container.classList.contains === "function" && container.classList.contains("exp-gallery-cards-track")) ||
    Boolean(typeof container.closest === "function" && container.closest(".exp-gallery-track"));

  const cards = Array.from(container.querySelectorAll(".lab-card"));

  if (isHorizontalGallery) {
    cards.forEach((card) => {
      card.classList.remove("card-slide-left", "card-slide-right");
      card.classList.add("card-in-view");
      card.style.transitionDelay = "";
    });
    return;
  }

  let visibleIndex = 0;

  cards.forEach((card) => {
    // If card is hidden via category/search filter, skip it from alternating index
    if (card.style.display === "none") {
      return;
    }

    if (prefersReduced) {
      card.classList.add("card-in-view");
      return;
    }

    // Alternate entrance direction between successive visible cards
    const isEven = visibleIndex % 2 === 0;
    card.classList.remove("card-slide-left", "card-slide-right");
    card.classList.add(isEven ? "card-slide-left" : "card-slide-right");

    // Apply subtle stagger delay across columns (0s, 0.08s, 0.16s)
    const staggerDelay = (visibleIndex % 3) * 0.08;
    card.style.transitionDelay = `${staggerDelay.toFixed(2)}s`;

    visibleIndex++;

    // If card is already in view, keep it revealed
    if (card.classList.contains("card-in-view")) {
      return;
    }

    // Check if card is already in viewport on initial render
    const rect = card.getBoundingClientRect();
    const isInitiallyVisible =
      rect.top < window.innerHeight * 0.92 &&
      rect.bottom > 0 &&
      rect.left < window.innerWidth &&
      rect.right > 0;

    if (isInitiallyVisible) {
      // Small timeout for DOM repaint so CSS transition activates smoothly
      requestAnimationFrame(() => {
        card.classList.add("card-in-view");
      });
    } else if (cardObserver) {
      cardObserver.observe(card);
    }
  });
}
