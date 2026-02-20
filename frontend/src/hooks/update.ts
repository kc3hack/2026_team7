import { useState, useCallback } from "react"; // useCallbackを追加
import type { StatusResponse } from "../types/update";
import { fetchUserId } from "../utils/auth";

export const useUpdateStatus = () => {
    const [status, setStatus] = useState<StatusResponse | null>(null);
    const [loading, setLoading] = useState(false); // 初期値はfalseにする
    const [error, setError] = useState<string | null>(null);

    // ★ useEffectを消して、代わりにこの関数を作る
    const triggerUpdate = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const user_id = await fetchUserId();
            const response = await fetch(`/api/v1/cards/${user_id}/update`, { 
                method: "POST" 
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data: StatusResponse = await response.json();
            setStatus(data);
            return data;
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            setError(msg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // triggerUpdate を外で使えるように返す
    return { status, loading, error, triggerUpdate };
};