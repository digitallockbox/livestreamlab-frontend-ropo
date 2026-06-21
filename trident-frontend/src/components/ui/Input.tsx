import inputStyles from "./Input.module.css";

type InputProps = {
  value?: string;
  placeholder?: string;
  className?: string;
  type?: "text" | "email" | "password" | "number";
  onChange?: (value: string) => void;
};

export function Input({
  value,
  placeholder,
  className,
  type = "text",
  onChange,
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
      onChange={(event: { target: { value: string } }) =>
        onChange?.(event.target.value)
      }
    />
  );
}
