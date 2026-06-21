import { useEffect, useState } from "react";
import toastStyles from "./Toast.module.css";

type ToastType = "success" | "error";

type ToastProps = {
  key?: number;
  message: string;
  type?: ToastType;
};

export function Toast({ message, type = "success" }: ToastProps): JSX.Element {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const dismissTimer = setTimeout(() => {
      setIsClosing(true);
    }, 4000);
    return () => clearTimeout(dismissTimer);
  }, []);

  return (
    <div
      className={`${toastStyles.toast} ${toastStyles[type]} ${
        isClosing ? toastStyles.closing : ""
      }`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {message}
    </div>
  );
}
