import { useEffect, useState } from "react";

type LiveIndicatorProps = {
  url?: string;
};

export function LiveIndicator({ url }: LiveIndicatorProps): JSX.Element {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const envUrl = (
      globalThis as {
        process?: { env?: { NEXT_PUBLIC_WS_URL?: string } };
      }
    ).process?.env?.NEXT_PUBLIC_WS_URL;

    const websocketUrl = url ?? envUrl ?? "";
    if (!websocketUrl) {
      return;
    }

    const socket = new WebSocket(websocketUrl);
    socket.onopen = () => setConnected(true);
    socket.onclose = () => setConnected(false);
    socket.onerror = () => setConnected(false);

    return () => socket.close();
  }, [url]);

  return (
    <span
      className={`live-indicator ${connected ? "live-indicator-on" : "live-indicator-off"}`}
      role="status"
      aria-live="polite"
      aria-label={connected ? "Live connection active" : "Connection offline"}
    >
      <span className={`live-indicator-dot ${connected ? "pulse" : ""}`} />
      {connected ? "Live connection" : "Offline"}
    </span>
  );
}
