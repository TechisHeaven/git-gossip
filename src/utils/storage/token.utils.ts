export function getCurrentUserToken() {
  return localStorage.getItem("authToken");
}
