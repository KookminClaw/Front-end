const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export class ApiError extends Error {
  constructor(message, { status, code, data } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.data = data;
  }
}

async function parseResponse(response) {
  if (response.status === 204) return null;

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return response.text();
  }

  return response.json();
}

export async function apiClient(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new ApiError(data?.message || "API 요청에 실패했습니다.", {
      status: response.status,
      code: data?.code,
      data,
    });
  }

  return data;
}
