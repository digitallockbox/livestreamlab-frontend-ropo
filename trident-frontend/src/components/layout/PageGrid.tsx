type PageGridProps = {
  children?: JSX.Element | JSX.Element[];
};

export function PageGrid({ children }: PageGridProps): JSX.Element {
  return <div className="page-grid">{children}</div>;
}
