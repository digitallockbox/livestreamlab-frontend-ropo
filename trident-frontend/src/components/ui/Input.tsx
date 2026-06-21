import inputStyles from "./Input.module.css";

type InputProps = {
  value?: string;
  placeholder?: string;
  className?: string;
  type?: "text" | "email" | "password" | "number";
  onChange?: (value: string) => void;
  ariaLabel?: string;
};

export function Input({
  value,
  placeholder,
  className,
  type = "text",
  onChange,
  ariaLabel,
}: InputProps): JSX.Element {
  const classes = className
    ? `${inputStyles.input} ${className}`
    : inputStyles.input;

  return (
    <input
      className={classes}
      type={type}
      value={value}
      placeholder={placeholder}
      aria-label={ariaLabel}
      onChange={(event: { target: { value: string } }) =>
        onChange?.(event.target.value)
      }
    />
  );
}
