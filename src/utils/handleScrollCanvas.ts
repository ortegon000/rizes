"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

type SeqManifest = { baseUrl:string; ext:string; count:number; pad:number; width:number; height:number; };
const pad = (n:number, len:number)=> n.toString().padStart(len,"0");
const urlAt = (m:SeqManifest,i:number)=> `${m.baseUrl}${pad(i,m.pad)}${m.ext}`;
const clamp = (n:number,a:number,b:number)=> Math.max(a, Math.min(b,n));

async function loadImageBitmap(url:string) {
  const res = await fetch(url, { cache: "force-cache" });
  const blob = await res.blob();
  return await createImageBitmap(blob);
}

export function handleScrollCanvasSequence({
  canvas, manifest, target, preload = 80,
  scrub, fadeIn, fadeOut,
}: {
  canvas: HTMLCanvasElement;
  manifest: SeqManifest;
  target: string | Element;
  preload?: "all" | number;
  scrub: { trigger: string | Element; start?: string; end?: string; pin?: boolean };
  fadeIn: { trigger: string | Element; start?: string; end?: string };
  fadeOut:{ trigger: string | Element; start?: string; end?: string };
}) {
  const el = typeof target === "string" ? document.querySelector(target)! : target;
  if (!el) return;

  const dpr = Math.max(1, window.devicePixelRatio || 1);
  canvas.width = Math.round(manifest.width*dpr);
  canvas.height= Math.round(manifest.height*dpr);
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;

  let inP=0, outP=0;
  const applyFx = () => {
    const alpha = Math.max(0, Math.min(1, inP*(1-outP)));
    const blur = 20*(1-alpha);
    (el as HTMLElement).style.opacity = String(alpha);
    (el as HTMLElement).style.filter = blur>0.5 ? `blur(${blur}px)` : "none";
  };

  const cache = new Map<number, ImageBitmap>();
  let currentIndex = -1;
  const draw = (idx:number) => {
    if (idx===currentIndex) return;
    const img = cache.get(idx); if (!img) return;
    currentIndex = idx;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(img,0,0,canvas.width,canvas.height);
  };

  const warm = async (center:number) => {
    if (preload==="all") {
      await Promise.all(
        Array.from({length: manifest.count}, (_,i)=> cache.has(i)
          ? Promise.resolve()
          : loadImageBitmap(urlAt(manifest,i)).then(b=>cache.set(i,b)).catch(()=>{}))
      );
      return;
    }
    const radius = typeof preload==="number" ? preload : 80;
    const start = clamp(center-radius,0,manifest.count-1);
    const end   = clamp(center+radius,0,manifest.count-1);
    for (let i=start;i<=end;i++) if (!cache.has(i))
      loadImageBitmap(urlAt(manifest,i)).then(b=>cache.set(i,b)).then(()=>{ if(i===center) draw(i); }).catch(()=>{});
    for (const k of [...cache.keys()]) if (k<start-30 || k>end+30) { cache.get(k)?.close(); cache.delete(k); }
  };

  warm(0).then(()=>draw(0));

  ScrollTrigger.create({
    trigger: scrub.trigger,
    start: scrub.start || "top bottom",
    end: scrub.end || "bottom top",
    scrub: true,
    pin: !!scrub.pin,
    anticipatePin: scrub.pin ? 1 : 0,
    invalidateOnRefresh: true,
    onUpdate: (st) => {
      const idx = Math.round(st.progress * (manifest.count-1));
      warm(idx); draw(idx);
    },
  });

  ScrollTrigger.create({
    trigger: fadeIn.trigger, start: fadeIn.start || "top center",
    end: fadeIn.end || "bottom center", scrub: true, invalidateOnRefresh: true,
    onUpdate: (st)=>{ inP = st.progress; applyFx(); },
  });
  ScrollTrigger.create({
    trigger: fadeOut.trigger, start: fadeOut.start || "top center",
    end: fadeOut.end || "bottom center", scrub: true, invalidateOnRefresh: true,
    onUpdate: (st)=>{ outP = st.progress; applyFx(); },
  });
}
