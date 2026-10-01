import { PropsWithChildren, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function AdminRoute({ children }: PropsWithChildren) {
  const [storedPassword, setStoredPassword] = useState<string | null>(null);
  const [verified, setVerified] = useState<boolean>(false);

  useEffect(() => {
    const password = typeof window !== "undefined" ? localStorage.getItem("admin_password") : null;
    const v = typeof window !== "undefined" ? localStorage.getItem("admin_verified") === "true" : false;
    setStoredPassword(password);
    setVerified(v);
  }, []);

  const allowed = !!storedPassword && verified;

  if (!allowed) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-xl mx-auto text-center space-y-6">
          <h1 className="text-4xl font-bold text-primary">Admin Access Required</h1>
          <p className="text-muted-foreground">
            To access the admin dashboard, please log in using the admin password.
          </p>
          <div>
            <Link to="/admin-login">
              <Button className="btn-primary glow-green">Go to Admin Login</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
