import selectStyles from "./Select.module.css";

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  options: SelectOption[];
  value?: string;
  ariaLabel?: string;
  className?: string;
  onChange?: (value: string) => void;
};

export function Select({
  options,
  value,
  ariaLabel,
  className,
  onChange,
}: SelectProps): JSX.Element {
  const classes = className
    ? `${selectStyles.select} ${className}`
    : selectStyles.select;

  return (
    <select
      className={classes}
      value={value}
      aria-label={ariaLabel ?? "Select option"}
      onChange={(event: { target: { value: string } }) =>
        onChange?.(event.target.value)
      }
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
