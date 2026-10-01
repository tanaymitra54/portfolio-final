import { api, APIError, Cookie } from "encore.dev/api";
import { adminPassword, adminEmail } from "./authz";

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  ok: boolean;
  adminPasswordCookie: Cookie<"admin_password">;
}

// Verifies the admin password and returns a cookie to authenticate subsequent requests.
export const adminLogin = api<AdminLoginRequest, AdminLoginResponse>(
  { expose: true, method: "POST", path: "/admin/login" },
  async (req) => {
    const correctPassword = adminPassword();
    const allowedEmail = (adminEmail() || "").trim().toLowerCase();
    const providedPassword = (req.password || "").trim();
    const providedEmail = (req.email || "").trim().toLowerCase();

    if (!providedEmail) throw APIError.invalidArgument("email is required");
    if (!providedPassword) throw APIError.invalidArgument("password is required");
    
    if (!correctPassword) throw APIError.internal("admin password not configured");
    if (!allowedEmail) throw APIError.internal("admin email not configured");
    
    if (providedEmail !== allowedEmail) throw APIError.unauthenticated("invalid email");
    if (providedPassword !== correctPassword) throw APIError.unauthenticated("invalid password");

    // Set a cookie that the auth handler accepts for subsequent authenticated requests.
    const cookie: Cookie<"admin_password"> = {
      value: correctPassword,
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
      // 7 day expiration
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      path: "/",
    };

    return {
      ok: true,
      adminPasswordCookie: cookie,
    };
  }
);
