import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { StudioPage } from "./pages/StudioPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { BlogPage } from "./pages/BlogPage";
import { BlogPostPage } from "./pages/BlogPostPage";
import { ContactPage } from "./pages/ContactPage";
import { AdminPage } from "./pages/AdminPage";
import { AdminRoute } from "./components/AdminRoute";
import { AdminLoginPage } from "./pages/AdminLoginPage";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppInner />
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

function AppInner() {
  const studio = useLocation().pathname === "/";
  return (
    <div className={studio ? "" : "min-h-screen bg-background flex flex-col"}>
      {!studio && <Header />}
      <main className={studio ? "" : "flex-1"}>
        <Routes>
          <Route path="/" element={<StudioPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />
        </Routes>
      </main>
      {!studio && <Footer />}
    </div>
  );
}
