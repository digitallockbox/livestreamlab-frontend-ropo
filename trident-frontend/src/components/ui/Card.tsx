import cardStyles from "./Card.module.css";

type CardProps = {
  title?: string;
  className?: string;
  children?: JSX.Element | JSX.Element[] | string | number;
};

export function Card({ title, className, children }: CardProps): JSX.Element {
  const wrapperClassName = className
    ? `${cardStyles.card} ${className}`
    : cardStyles.card;

  return (
    <article className={wrapperClassName}>
      {title ? <p className={cardStyles.title}>{title}</p> : null}
      <div className={cardStyles.body}>{children ?? null}</div>
    </article>
  );
}
