import { useQuery } from "@tanstack/react-query";
import { Mail, Calendar, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import backend from "~backend/client";

export function ContactAdmin() {
  // Note: This would require a backend endpoint to list contact messages
  // For now, we'll show a placeholder

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Contact Messages</h2>
        <p className="text-muted-foreground">View and manage contact form submissions</p>
      </div>

      <Card>
        <CardContent className="text-center py-8">
          <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Contact message management would be implemented here.
            This would require additional backend endpoints to list and manage contact messages.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
