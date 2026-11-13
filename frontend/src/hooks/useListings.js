import { useState, useEffect } from "react";
import { getListings } from "../services/listingService";

export function useListings(initialParams = {}) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const fetch = async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await getListings(params);
      setListings(data.listings || data.data || []);
      setTotalPages(data.totalPages || data.pages || 1);
    } catch {
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  return { listings, loading, totalPages, fetch };
}
