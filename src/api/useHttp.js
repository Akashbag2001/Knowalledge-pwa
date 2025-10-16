import { useState } from "react";

// const BASE_URL = "http://localhost:8080/api/v1";
const BASE_URL ="http://192.168.1.214:8080/api/v1";
// const hosted_URL ="http://knowalledgebackendnew-env.eba-f2pvuxsc.ap-south-1.elasticbeanstalk.com/api/v1";

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

      // Add query params for GET
      if (method.toUpperCase() === "GET" && Object.keys(queryParams).length) {
        const queryString = new URLSearchParams(queryParams).toString();
        url += `?${queryString}`;
      }

      // 🧠 Detect if body is FormData
      const isFormData = body instanceof FormData;

      const response = await fetch(url, {
        method,
        headers: {
          ...(isFormData ? {} : { "Content-Type": "application/json" }),
          ...headers,
        },
        body: body ? (isFormData ? body : JSON.stringify(body)) : null,
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
