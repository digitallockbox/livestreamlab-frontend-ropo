import sectionStyles from "./Section.module.css";

type SectionProps = {
  wide?: boolean;
  children?: JSX.Element | JSX.Element[];
};

export function Section({ wide = false, children }: SectionProps): JSX.Element {
  const className = wide
    ? `${sectionStyles.section} ${sectionStyles.wide}`
    : sectionStyles.section;

  return <section className={className}>{children}</section>;
}
