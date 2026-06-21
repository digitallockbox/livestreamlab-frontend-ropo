import toastStyles from "./Toast.module.css";

type ToastType = "success" | "error";

type ToastProps = {
  key?: number;
  message: string;
  type?: ToastType;
};

export function Toast({ message, type = "success" }: ToastProps): JSX.Element {
  return (
    <div className={`${toastStyles.toast} ${toastStyles[type]}`}>{message}</div>
  );
}
