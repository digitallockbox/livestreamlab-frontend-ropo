type PageHeaderProps = {
  title: string;
  actions?: JSX.Element;
  subtitle?: string;
};

export function PageHeader({
  title,
  actions,
  subtitle,
}: PageHeaderProps): JSX.Element {
  return (
    <header className="page-header">
      <div>
        <h1 className="page-header-title">{title}</h1>
        {subtitle ? <p className="page-header-subtitle">{subtitle}</p> : null}
      </div>
      {actions ? <div className="page-header-actions">{actions}</div> : null}
    </header>
  );
}
