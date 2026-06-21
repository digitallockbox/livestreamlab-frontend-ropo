type LoadingOverlayProps = {
  message?: string;
};

export function LoadingOverlay({
  message = "Loading...",
}: LoadingOverlayProps): JSX.Element {
  return (
    <div className="loading-overlay" role="status">
      <div className="loading-overlay-panel">{message}</div>
    </div>
  );
}
