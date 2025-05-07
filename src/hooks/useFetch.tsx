import { useState, useEffect } from "react";

export function useFetch<T = any>(
    url: string | null,
    options: RequestInit | null = null
) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    // `error` now holds the full response body on error
    const [error, setError] = useState<any>(null);
    const [controller, setController] = useState<AbortController | null>(null);

    useEffect(() => {
        if (!url || !options) return;

        const abortController = new AbortController();
        setController(abortController);
        setLoading(true);
        setError(null);

        fetch(url, { ...options, signal: abortController.signal })
            .then(async (res) => {
                const text = await res.text();
                let body: any;
                try {
                    body = JSON.parse(text);
                } catch {
                    body = text;
                }

                if (!res.ok) {
                    // adjuntar código HTTP para referencia
                    if (typeof body === "object") {
                        body.status = res.status;
                    } else {
                        body = { message: String(body), status: res.status };
                    }
                    // lanzar el body completo
                    throw body;
                }

                return body as T;
            })
            .then((json) => {
                setData(json);
            })
            .catch((err) => {
                if (err.name === "AbortError") {
                    console.log("Petición cancelada");
                } else {
                    // `err` es el body completo o un objeto de error
                    setError(err);
                    console.log("Error en fetch:", err);
                }
            })
            .finally(() => {
                setLoading(false);
            });

        return () => abortController.abort();
    }, [url, JSON.stringify(options)]);

    const handleCancelRequest = () => {
        if (controller) {
            controller.abort();
            setError({ message: "Request cancelled" });
            setLoading(false);
        }
    };

    return { data, loading, error, handleCancelRequest };
}
