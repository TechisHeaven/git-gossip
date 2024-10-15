import { jwtDecode } from "jwt-decode";

export function getCurrentUserToken() {
  return localStorage.getItem("authToken");
}

export function getGithubUserToken() {
  const token = localStorage.getItem("authToken");
  if (!token) {
    return { message: "Token not Exists", status: 404 };
  }

  const decoded = jwtDecode(token) as {
    accessToken: string;
  };
  return decoded.accessToken;
}
