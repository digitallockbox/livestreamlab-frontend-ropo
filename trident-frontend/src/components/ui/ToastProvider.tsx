import { createContext, useContext, useEffect, useState } from "react";
import { Toast } from "./Toast";

type ToastType = "success" | "error";

type ToastModel = {
  id: number;
  message: string;
  type: ToastType;
};

type ToastContextModel = {
  addToast: (toast: { message: string; type?: ToastType }) => void;
};

const ToastContext = createContext<ToastContextModel | null>(null);

type ToastProviderProps = {
  children?: JSX.Element | JSX.Element[];
};

export function ToastProvider({ children }: ToastProviderProps): JSX.Element {
  const [toasts, setToasts] = useState<ToastModel[]>([]);

  const addToast = (toast: { message: string; type?: ToastType }): void => {
    const nextToast: ToastModel = {
      id: Date.now(),
      message: toast.message,
      type: toast.type ?? "success",
    };

    setToasts((prev) => [...prev, nextToast]);
  };

  useEffect(() => {
    if (toasts.length === 0) {
      return;
    }

    const timer = setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 2500);

    return () => clearTimeout(timer);
  }, [toasts]);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-stack">
        {toasts.map((toast) => (
          <Toast key={toast.id} message={toast.message} type={toast.type} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextModel {
  const value = useContext<ToastContextModel | null>(ToastContext);
  if (!value) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return value;
}
