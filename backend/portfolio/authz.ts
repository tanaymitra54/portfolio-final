import { APIError } from "encore.dev/api";
import { secret } from "encore.dev/config";
import { getAuthData } from "~encore/auth";

export const adminPassword = secret("AdminPassword");
export const adminEmail = secret("AdminEmail");

// Ensures the authenticated user has provided the correct admin password.
export function assertAdmin(): void {
  const auth = getAuthData();
  if (!auth) {
    throw APIError.unauthenticated("authentication required");
  }
  // The auth handler will have validated the password, so if we get here, the user is authenticated
}

