import "@styles/globals.css";
import type { AppProps } from "next/app";
import SmoothScroll from "@components/smoothScroll";
import ErrorBoundary from "@components/ErrorBoundary";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <div id="page-atmosphere" aria-hidden="true" />
      <SmoothScroll>
        <Component {...pageProps} />
      </SmoothScroll>
    </ErrorBoundary>
  );
}
