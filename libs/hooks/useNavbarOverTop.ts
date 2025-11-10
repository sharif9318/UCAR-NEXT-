import { useEffect } from "react";

export function useNavbarOverTop({
  navbarSelector = ".InteractiveNavbar",
  topSelector = "#top",
  className = "over-top",
  threshold = 100,
} = {}) {
  useEffect(() => {
    function checkOverlap() {
      const navbar = document.querySelector(navbarSelector);
      const top = document.querySelector(topSelector);

      if (!navbar || !top) return;

      const topRect = top.getBoundingClientRect();

      const hasScrolledPast = topRect.bottom < threshold;

      if (hasScrolledPast) {
        navbar.classList.add(className);
      } else {
        navbar.classList.remove(className);
      }
    }

    window.addEventListener("scroll", checkOverlap, { passive: true });
    window.addEventListener("resize", checkOverlap);

    checkOverlap();

    return () => {
      window.removeEventListener("scroll", checkOverlap);
      window.removeEventListener("resize", checkOverlap);
    };
  }, [navbarSelector, topSelector, className, threshold]);
}
