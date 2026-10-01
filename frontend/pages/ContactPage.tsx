import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Mail, MapPin, Phone, User, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import backend from "~backend/client";

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const { data: settingsData } = useQuery({
    queryKey: ["site-settings"],
    queryFn: () => backend.portfolio.getSiteSettings(),
  });
  const settings = settingsData?.settings || {};
  const ownerName = settings.owner_name || "Tanay Mitra";
  const contactPhone = settings.contact_phone || "8761985584";
  const contactEmail = settings.contact_email || "tanaymitra9@gmail.com";

  const { toast } = useToast();

  const submitMutation = useMutation({
    mutationFn: (data: typeof formData) => backend.portfolio.submitContact(data),
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "Thank you for your message. I'll get back to you soon.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    },
    onError: (error) => {
      console.error("Failed to send message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 text-primary">Get In Touch</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Ready to start a conversation? Reach out to {ownerName} and let's discuss your next project or collaboration.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="card">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Send a Message</CardTitle>
              <CardDescription className="text-base">
                Fill out the form below and I'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-sm font-semibold">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="mt-2"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="subject" className="text-sm font-semibold">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="text-sm font-semibold">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="mt-2 resize-none"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full btn-primary font-semibold py-3 glow-green"
                  disabled={submitMutation.isPending}
                >
                  {submitMutation.isPending ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="card">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">Contact Information</CardTitle>
                <CardDescription className="text-base">
                  Prefer reaching out directly? Use any of these channels.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/20 rounded-full">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Name</p>
                    <p className="text-muted-foreground">{ownerName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/20 rounded-full">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Email</p>
                    <a 
                      href={`mailto:${contactEmail}`} 
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {contactEmail}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/20 rounded-full">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Phone</p>
                    <a 
                      href={`tel:${contactPhone}`} 
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {contactPhone}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/20 rounded-full">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Location</p>
                    <p className="text-muted-foreground">India</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">Let's Connect</CardTitle>
                <CardDescription className="text-base">
                  I'm always interested in new opportunities and collaborations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Whether you have a project in mind, want to discuss potential opportunities, 
                  or just want to say hello, I'd love to hear from you. I believe great things 
                  happen when creative minds collaborate.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
