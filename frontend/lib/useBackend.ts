import api from "@/api";

// Returns a backend client that includes the admin password header if present.
// Store the admin password in localStorage under "admin_password" to enable authenticated admin calls.
export function useBackend() {
  return api;
}
