import { ErrorBoundary } from "../components/ui/ErrorBoundary";
import { ToastProvider } from "../components/ui/ToastProvider";
import "../styles/globals.css";

type AppProps = {
  Component: (props: Record<string, unknown>) => JSX.Element;
  pageProps: Record<string, unknown>;
};

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <Component {...pageProps} />
      </ToastProvider>
    </ErrorBoundary>
  );
}
