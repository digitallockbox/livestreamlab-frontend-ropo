import textareaStyles from "./Textarea.module.css";

type TextareaProps = {
  value?: string;
  placeholder?: string;
  className?: string;
  onChange?: (value: string) => void;
};

export function Textarea({
  value,
  placeholder,
  className,
  onChange,
}: TextareaProps): JSX.Element {
  const classes = className
    ? `${textareaStyles.textarea} ${className}`
    : textareaStyles.textarea;

  return (
    <textarea
      className={classes}
      value={value}
      placeholder={placeholder}
      onChange={(event: { target: { value: string } }) =>
        onChange?.(event.target.value)
      }
    />
  );
}
