import "@styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
  }, [])

  return <Component {...pageProps} />;
}
