// useBaseUrl.ts
import { useState, useEffect } from 'react';

export const useBaseUrl = () => {
  const [baseUrl, setBaseUrl] = useState(process.env.API_URL);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { protocol, host } = window.location;
      setBaseUrl(`${protocol}//${host}`);
    }
  }, []); // Removed router dependency

  return baseUrl;
};

export const defaultPageSize = 25;