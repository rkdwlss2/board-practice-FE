import { API_URL } from "../config.js";

const AUTH_STORAGE_KEYS = [
  "accessToken",
  "refreshToken",
  "token",
  "jwt",
  "user",
  "loginUser",
  "isLoggedIn",
];

export class ApiError extends Error {
  constructor(message, status, details = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export function clearClientAuthState() {
  AUTH_STORAGE_KEYS.forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
}

export function redirectToLogin() {
  if (!window.location.pathname.endsWith("/index.html")) {
    window.location.href = "/index.html";
  }
}

export async function apiRequest(path, options = {}) {
  const {
    redirectOnUnauthorized = true,
    unauthorizedMessage = "로그인이 필요합니다.",
    ...fetchOptions
  } = options;

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      credentials: "include",
      ...fetchOptions,
      headers: {
        ...(fetchOptions.body ? { "Content-Type": "application/json" } : {}),
        ...fetchOptions.headers,
      },
    });
  } catch {
    throw new ApiError("서버와 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.", 0);
  }

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json().catch(() => ({}))
    : null;

  if (!response.ok) {
    if (response.status === 401 && redirectOnUnauthorized) {
      clearClientAuthState();
      window.alert(data?.message || unauthorizedMessage);
      redirectToLogin();
    }

    throw new ApiError(data?.message || `요청에 실패했습니다. (${response.status})`, response.status, data);
  }

  return data;
}
