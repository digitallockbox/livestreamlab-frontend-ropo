type EmptyStateProps = {
  title?: string;
  message?: string;
};

export function EmptyState({
  title = "Nothing here yet",
  message = "This section will populate once data is available.",
}: EmptyStateProps): JSX.Element {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}
