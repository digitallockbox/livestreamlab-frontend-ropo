import { useOverlayRuntime } from "../hooks/useOverlayRuntime";

const getCreatorIdFromLocation = (): string => {
  if (typeof window === "undefined") {
    return "creator_default";
  }

  const params = new URLSearchParams(window.location.search);
  return params.get("creatorId") ?? "creator_default";
};

export default function OverlayPreviewPage(): JSX.Element {
  const creatorId = getCreatorIdFromLocation();
  const { config, events, status, runtimeClassName } = useOverlayRuntime(
    creatorId,
    {
      mode: "preview",
    },
  );

  return (
    <main className="overlay-preview-page">
      <section className={runtimeClassName}>
        <p className="overlay-preview-title">
          Preview Runtime ({config?.themeKey ?? "neon"})
        </p>
        <p className="overlay-runtime-status">Runtime: {status}</p>
        <ul>
          {events.length > 0 ? (
            events.map((event) => (
              <li key={event.id}>
                {event.type.toUpperCase()} - {event.message}
              </li>
            ))
          ) : (
            <li>No preview events yet.</li>
          )}
        </ul>
      </section>
    </main>
  );
}
