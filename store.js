(() => {
  const prefix = "enqu-made-";
  const localHostname = ["localhost", "127.0.0.1"].includes(window.location.hostname);
  const localApiHost = window.location.hostname === "localhost" ? "localhost" : "127.0.0.1";
  const apiBase = window.location.protocol === "file:" || localHostname
    ? `http://${localApiHost}:8000/api`
    : "/api";
  window.ENQUStore = {
    read(key, fallback) {
      try {
        const value = localStorage.getItem(`${prefix}${key}`);
        return value === null ? fallback : JSON.parse(value);
      } catch {
        return fallback;
      }
    },
    write(key, value) {
      localStorage.setItem(`${prefix}${key}`, JSON.stringify(value));
    },
    id(prefixName) {
      return `${prefixName}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
    },
  };
  window.ENQUApi = {
    async request(path, options = {}) {
      let response;
      try {
        response = await fetch(`${apiBase}${path}`, {
          credentials: "include",
          ...options,
          headers: options.body instanceof FormData
            ? options.headers
            : { "Content-Type": "application/json", ...(options.headers || {}) },
        });
      } catch {
        throw new Error(localHostname || window.location.protocol === "file:"
          ? `Cannot reach the local backend at ${apiBase}. Start it with: py -m uvicorn app:app --reload`
          : "The marketplace backend is unavailable. Deploy the FastAPI app and configure its database before signing in.");
      }
      const body = await response.json().catch(() => ({}));
      if (response.status === 404) {
        throw new Error("The backend API is not running at this address. Start it with: py -m uvicorn app:app --reload");
      }
      if (!response.ok) {
        const error = new Error(body.detail || `Request failed (${response.status}).`);
        error.status = response.status;
        throw error;
      }
      return body;
    },
  };
})();
