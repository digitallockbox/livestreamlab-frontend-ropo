import badgeStyles from "./Badge.module.css";

type BadgeVariant = "success" | "warning" | "error" | "neutral";

type BadgeProps = {
  text: string;
  variant?: BadgeVariant;
};

export function Badge({ text, variant = "neutral" }: BadgeProps): JSX.Element {
  return (
    <span className={`${badgeStyles.badge} ${badgeStyles[variant]}`}>
      {text}
    </span>
  );
}
