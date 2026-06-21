import buttonStyles from "./Button.module.css";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = {
  variant?: ButtonVariant;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  children?: string | JSX.Element;
};

export function Button({
  variant = "primary",
  type = "button",
  onClick,
  className,
  disabled,
  children,
}: ButtonProps): JSX.Element {
  const classes = className
    ? `${buttonStyles.button} ${buttonStyles[variant]} ${className}`
    : `${buttonStyles.button} ${buttonStyles[variant]}`;

  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
