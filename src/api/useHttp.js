import { useState } from "react";

// ✅ set your API base URL here
const BASE_URL = "http://localhost:8080/api/v1";

export default function useHttp() {
  const [loading, setLoading] = useState(false);

  /**
   * sendRequest - Generic function to call API
   * @param {string} endpoint - API endpoint (e.g., "/school/getSchool")
   * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
   * @param {object|null} body - Request body for POST/PUT
   * @param {object} headers - Additional headers
   * @param {object} queryParams - Optional query params for GET requests
   */
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

      // Append query params for GET requests
      if (method.toUpperCase() === "GET" && Object.keys(queryParams).length) {
        const queryString = new URLSearchParams(queryParams).toString();
        url += `?${queryString}`;
      }

      const response = await fetch(url, {
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
