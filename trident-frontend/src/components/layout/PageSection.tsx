type PageSectionProps = {
  children?: JSX.Element | JSX.Element[];
};

export function PageSection({ children }: PageSectionProps): JSX.Element {
  return <section className="page-section">{children}</section>;
}
