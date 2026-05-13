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
});
