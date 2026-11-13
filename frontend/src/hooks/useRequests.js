import { useState, useEffect } from "react";
import { getReceivedRequests, getSentRequests } from "../services/requestService";

export function useRequests() {
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    try {
      const [rec, snt] = await Promise.all([getReceivedRequests(), getSentRequests()]);
      setReceived(rec.data.data || rec.data || []);
      setSent(snt.data.data || snt.data || []);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  return { received, sent, loading, refetch: fetch };
}
