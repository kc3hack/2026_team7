import { useEffect,useState } from "react";
import type { StatusResponse } from "../types/update";

export const useUpdateStatus = (user_name: string) => {

    const [status, setStatus] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchStatus = async () => {
            try {   
                const response = await fetch(`/api/v1/engineers/${user_name}/update`);
                if (!response.ok) {
                    throw new Error(`Error fetching update status: ${response.statusText}`);
                }
                const data: StatusResponse = await response.json();
                setStatus(data.status);
            }
            catch (err: unknown) {
                setError((err as Error).message);
            }
            finally {
                setLoading(false);
            }
        };
        fetchStatus();
    }, [user_name]);

    return { status, loading, error };
}