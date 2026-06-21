type ErrorStateProps = {
  title?: string;
  message?: string;
};

export function ErrorState({
  title = "Request failed",
  message = "We could not load this view. Please try again.",
}: ErrorStateProps): JSX.Element {
  return (
    <div className="error-state">
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}
