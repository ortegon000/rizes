import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
};

/**
 * Catches render/lifecycle errors so a canvas/manifest failure
 * cannot blank the whole page.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  private handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          role="alert"
          className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-[#1d1b22] px-6 text-center text-white"
        >
          <p className="text-lg font-medium">Algo salió mal al cargar la página.</p>
          <p className="max-w-md text-sm text-white/70">
            Puedes reintentar. Si el problema continúa, recarga el navegador.
          </p>
          <button
            type="button"
            onClick={this.handleRetry}
            className="border border-white/40 px-5 py-2 text-sm transition-colors hover:bg-white hover:text-[#1d1b22]"
          >
            Reintentar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
