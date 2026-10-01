import { useQuery } from "@tanstack/react-query";
import { Github, Linkedin, Twitter, Mail, Phone } from "lucide-react";
import backend from "~backend/client";

export function Footer() {
  const { data: settingsData } = useQuery({
    queryKey: ["site-settings"],
    queryFn: () => backend.portfolio.getSiteSettings(),
  });

  const settings = settingsData?.settings || {};
  const title = settings.site_title || "Tanay Mitra";

  return (
    <footer className="border-t bg-muted/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="text-center md:text-left">
            <h3 className="font-serif text-lg font-semibold text-primary mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {title}. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            {settings.contact_phone && (
              <a
                href={`tel:${settings.contact_phone}`}
                className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/10"
                aria-label="Phone"
              >
                <Phone className="h-5 w-5" />
              </a>
            )}
            {settings.contact_email && (
              <a
                href={`mailto:${settings.contact_email}`}
                className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/10"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            )}
            {settings.github_url && (
              <a
                href={settings.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/10"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            )}
            {settings.linkedin_url && (
              <a
                href={settings.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/10"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            )}
            {settings.twitter_url && (
              <a
                href={settings.twitter_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/10"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
