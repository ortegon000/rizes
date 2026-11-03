import "@styles/globals.css";
import type { AppProps } from "next/app";
import SmoothScroll from "@components/smoothScroll";
import ErrorBoundary from "@components/ErrorBoundary";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <SmoothScroll>
        <Component {...pageProps} />
      </SmoothScroll>
    </ErrorBoundary>
  );
}
