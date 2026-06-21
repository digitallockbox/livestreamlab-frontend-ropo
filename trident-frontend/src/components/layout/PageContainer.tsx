type PageContainerProps = {
  children?: JSX.Element | JSX.Element[];
};

export function PageContainer({ children }: PageContainerProps): JSX.Element {
  return <div className="page-container">{children}</div>;
}
