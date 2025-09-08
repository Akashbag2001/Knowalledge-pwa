import { useState } from "react";

// ✅ set your API base URL here
const BASE_URL = "http://localhost:8080/api/v1";

export default function useHttp() {
  const [loading, setLoading] = useState(false);

  const sendRequest = async (endpoint, method = "GET", body = null, headers = {}) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: body ? JSON.stringify(body) : null,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong!");
      }

      return data;
    } finally {
      setLoading(false);
    }
  };

  return { sendRequest, loading };
}
