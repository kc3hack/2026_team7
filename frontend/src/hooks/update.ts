import { useEffect,useState } from "react";
import type { StatusResponse } from "../types/update";
import { fetchUserId } from "../utils/auth";

export const useUpdateStatus = () => {
    const [status, setStatus] = useState<StatusResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initializeUpdate = async () => {
            try {
                setLoading(true);
                
                // 1. ここで user_id を取得（await で待機）
                const user_id = await fetchUserId();
                
                // 2. 取得した ID を使って POST リクエストを送る
                const response = await fetch(`/api/v1/cards/${user_id}/update`, { 
                    method: "POST" 
                });

                if (!response.ok) {
                    throw new Error(`Error fetching update status: ${response.statusText}`);
                }

                const data: StatusResponse = await response.json();
                setStatus(data);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : String(err));
            } finally {
                setLoading(false);
            }
        };

        initializeUpdate();
    }, []); // 最初に1回だけ実行される

    return { status, loading, error };
};