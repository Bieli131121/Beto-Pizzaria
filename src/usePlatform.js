import { useState, useEffect } from "react";

/**
 * usePlatform — detecta a plataforma em tempo real.
 * Retorna: { platform, isIOS, isAndroid, isMobile, isDesktop, safeArea }
 *
 * platform: "ios" | "android" | "desktop"
 * safeArea: { top, bottom, left, right } — valores em px para safe-area (notch / barra home iOS)
 */
export function usePlatform() {
  const [info, setInfo] = useState(() => detect());

  useEffect(() => {
    // Re-detecta se o viewport mudar (rotação, DevTools responsive)
    const mq = window.matchMedia("(max-width: 768px)");
    const handler = () => setInfo(detect());
    mq.addEventListener("change", handler);
    window.addEventListener("resize", handler);
    return () => {
      mq.removeEventListener("change", handler);
      window.removeEventListener("resize", handler);
    };
  }, []);

  return info;
}

function detect() {
  const ua = navigator.userAgent || "";
  const w  = window.innerWidth;

  const isIOS     = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
  const isAndroid = /Android/.test(ua);
  const isMobile  = isIOS || isAndroid || w <= 768;
  const isDesktop = !isMobile;

  let platform = "desktop";
  if (isIOS)     platform = "ios";
  else if (isAndroid) platform = "android";

  // Safe-area (suporte a iOS notch e Dynamic Island)
  const safeArea = getSafeArea();

  return { platform, isIOS, isAndroid, isMobile, isDesktop, safeArea };
}

function getSafeArea() {
  // Usa CSS env() via elemento temporário para ler os valores reais
  const el = document.createElement("div");
  el.style.cssText = `
    position:fixed;top:0;left:0;width:0;height:0;overflow:hidden;
    padding-top:env(safe-area-inset-top,0px);
    padding-bottom:env(safe-area-inset-bottom,0px);
    padding-left:env(safe-area-inset-left,0px);
    padding-right:env(safe-area-inset-right,0px);
  `;
  document.body.appendChild(el);
  const cs = getComputedStyle(el);
  const result = {
    top:    parseFloat(cs.paddingTop)    || 0,
    bottom: parseFloat(cs.paddingBottom) || 0,
    left:   parseFloat(cs.paddingLeft)   || 0,
    right:  parseFloat(cs.paddingRight)  || 0,
  };
  document.body.removeChild(el);
  return result;
}
