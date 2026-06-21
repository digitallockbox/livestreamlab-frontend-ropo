import { Component } from "react";

type ErrorBoundaryProps = {
  children?: JSX.Element | JSX.Element[];
  fallback?: JSX.Element;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown): void {
    console.error("Dashboard render failure", error);
  }

  render(): JSX.Element | null {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="page-section">Something went wrong.</div>
        )
      );
    }

    return (this.props.children as JSX.Element) ?? null;
  }
}
