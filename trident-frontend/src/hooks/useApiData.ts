import { useEffect, useState } from "react";
import { useToast } from "../components/ui/ToastProvider";

type ApiDataState<T> = {
    data: T | null;
    isLoading: boolean;
    error: string | null;
    reload: () => Promise<void>;
};

export function useApiData<T>(
    loader: () => Promise<T>,
    failureMessage: string,
): ApiDataState<T> {
    const { addToast } = useToast();
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = async (): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await loader();
            setData(response);
        } catch {
            setError(failureMessage);
            addToast({ message: failureMessage, type: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void load();
    }, []);

    return {
        data,
        isLoading,
        error,
        reload: load,
    };
}
