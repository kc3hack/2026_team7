import { useEffect, useState } from 'react';
import type { QrResponse } from '../types/qr';

export const useQr = (user_name: string) => {
  const [qrData, setQrData] = useState<QrResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQrData = async () => {
      try {
        const response = await fetch(`/api/v1/cards/${user_name}/qr`);
        if (!response.ok) {
          throw new Error(`Error fetching QR data: ${response.statusText}`);
        }
        const data: QrResponse = await response.json();
        setQrData(data);
      } catch (err: unknown) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchQrData();
  }, [user_name]);

  return { qrData, loading, error };
};
