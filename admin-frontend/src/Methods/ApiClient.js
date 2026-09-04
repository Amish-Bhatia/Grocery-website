const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const request = async (path, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = new Headers(options.headers || {});

  if (!(options.body instanceof FormData) && options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";

  const data = contentType.includes("application/json") ? await response.json() : await response.text();

  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("adminName");

    if (window.location.pathname !== "/") {
      window.location.href = "/";
    }
  }

  if (!response.ok) {
    const error = new Error(data?.message || "Request failed");

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
};

const apimethods = {
  getApi: (path) => request(path),

  postApi: (path, body) => request(path, {
    method: "POST",
    body: body instanceof FormData ? body : JSON.stringify(body),
  }),

  putApi: (path, body) => request(path, {
    method: "PUT",
    body: body instanceof FormData ? body : JSON.stringify(body),
  }),

  deleteApi: (path) => request(path, {
    method: "DELETE",
  }),
};

export { API_BASE_URL };

export default apimethods;