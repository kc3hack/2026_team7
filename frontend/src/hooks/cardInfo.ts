import { useEffect,useState } from "react";
import type { CardInfo } from "../types/card";

export const useCardInfo = (user_name: string) => {

    const [cardInfo, setCardInfo] = useState<CardInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCardInfo = async () => {
            try {
                const response = await fetch(`/api/v1/engineers/${user_name}/card`);
                if (!response.ok) {
                    throw new Error(`Error fetching card info: ${response.statusText}`);
                }
                const data = await response.json();
                setCardInfo(data.card_info);
            } catch (err: unknown) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchCardInfo();
    }, [user_name]);

    return { cardInfo, loading, error };
};