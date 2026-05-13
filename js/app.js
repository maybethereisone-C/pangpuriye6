import { loadSiteData } from "./data.js";
import { renderSite } from "./render.js";
import {
  initMemberCarousel,
  initMenu,
  initParticles,
  initProgress,
  initTheme,
  initTopbar,
  initCursor,
  initMagneticHover,
  initSmoothScroll,
  initGsapReveal,
} from "./motion.js";

async function main() {
  const data = await loadSiteData();
  renderSite(data);
  initTheme();
  initMenu();
  initTopbar();
  initProgress();
  initSmoothScroll();
  initGsapReveal();
  initMemberCarousel();
  initParticles();
  initCursor();
  initMagneticHover();
}

main().catch((error) => {
  console.error("[pangpuriye-static] failed to boot", error);
  document.body.innerHTML =
    '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;color:#C1121F">Failed to load. Please refresh.</div>';
});
