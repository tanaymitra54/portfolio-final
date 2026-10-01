import { Header, Cookie, APIError, Gateway } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import { secret } from "encore.dev/config";

const adminPassword = secret("AdminPassword");
const adminEmail = secret("AdminEmail");

// Auth params: only headers/cookies allowed.
interface AuthParams {
  // Custom header used by the frontend to pass the admin password.
  adminPasswordHeader?: Header<"X-Admin-Password">;
  // Optional cookie with the same password.
  adminPasswordCookie?: Cookie<"admin_password">;
}

export interface AuthData {
  userID: string;
  imageUrl: string;
  email: string | null;
}

// Simple auth handler that validates the admin password.
const auth = authHandler<AuthParams, AuthData>(async (params) => {
  const providedPassword = params.adminPasswordHeader ?? params.adminPasswordCookie?.value ?? "";
  const correctPassword = adminPassword();
  
  if (!providedPassword || !correctPassword) {
    throw APIError.unauthenticated("missing admin password");
  }
  
  if (providedPassword !== correctPassword) {
    throw APIError.unauthenticated("invalid admin password");
  }
  
  return {
    userID: "admin",
    email: (adminEmail() || null),
    imageUrl: "",
  };
});

// Configure the API gateway to use the auth handler.
export const gw = new Gateway({ authHandler: auth });
