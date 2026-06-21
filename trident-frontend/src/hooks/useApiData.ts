import { useEffect, useState } from "react";
import { useToast } from "../components/ui/ToastProvider";
import { logger } from "../utils/logger";

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
        const startTime = performance.now();
        try {
            const response = await loader();
            const duration = performance.now() - startTime;
            setData(response);
            logger.info("API data loaded successfully", {
                page: window.location.pathname,
                duration,
            });
        } catch (err) {
            const duration = performance.now() - startTime;
            setError(failureMessage);
            addToast({ message: failureMessage, type: "error" });
            logger.error("API data load failed", {
                page: window.location.pathname,
                duration,
                errorMessage: failureMessage,
                error: err instanceof Error ? err.message : String(err),
            });
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
