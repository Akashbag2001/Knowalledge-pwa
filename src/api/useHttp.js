import { useState } from "react";

const BASE_URL = "http://localhost:8080/api/v1";

export default function useHttp() {
  const [loading, setLoading] = useState(false);

  const sendRequest = async (
    endpoint,
    method = "GET",
    body = null,
    headers = {},
    queryParams = {}
  ) => {
    setLoading(true);
    try {
      let url = `${BASE_URL}${endpoint}`;

      // ✅ Append query params for GET requests
      if (method.toUpperCase() === "GET" && Object.keys(queryParams).length) {
        const queryString = new URLSearchParams(queryParams).toString();
        url += `?${queryString}`;
      }

      // ✅ Detect if body is FormData
      const isFormData = body instanceof FormData;

      const response = await fetch(url, {
        method,
        headers: isFormData
          ? headers // Let browser set Content-Type (with boundary)
          : {
              "Content-Type": "application/json",
              ...headers,
            },
        body:
          method === "GET" || method === "HEAD"
            ? null
            : isFormData
            ? body // Send FormData as-is
            : JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong!");
      }

      return data;
    } catch (err) {
      console.error("HTTP Error:", err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { sendRequest, loading };
}
