// src/hooks/useFetch.ts
import { useState, useEffect } from "react";

export function useFetch<T = any>(
    url: string | null,
    options: RequestInit | null = null
) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | string | null>(null);
    const [controller, setController] = useState<AbortController | null>(null);

    useEffect(() => {
        if (!url || !options) return;

        const abortController = new AbortController();
        setController(abortController);
        setLoading(true);

        fetch(url, { ...options, signal: abortController.signal })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json() as Promise<T>;
            })
            .then((json) => setData(json))
            .catch((err) => {
                if (err.name === "AbortError") {
                    console.log("Petición cancelada");
                } else {
                    setError(err);
                }
            })
            .finally(() => setLoading(false));

        return () => abortController.abort();
    }, [url, JSON.stringify(options)]);

    const handleCancelRequest = () => {
        if (controller) {
            controller.abort();
            setError("Cancelled Request");
            setLoading(false);
        }
    };

    return { data, loading, error, handleCancelRequest };
}
