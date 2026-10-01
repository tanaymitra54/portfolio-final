export type Project = {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string | null;
  demoUrl: string | null;
  githubUrl: string | null;
  technologies: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
};

export type BlogPost = {
  id: number;
  title: string;
  content: string;
  excerpt: string | null;
  slug: string;
  published: boolean;
  featuredImageUrl: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

const BASE = '/api';

function withAuth(init?: RequestInit): RequestInit {
  const password = typeof window !== 'undefined' ? localStorage.getItem('admin_password') : null;
  const headers = new Headers(init?.headers || {});
  if (password) headers.set('X-Admin-Password', password);
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  return { ...init, headers };
}

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, withAuth(init));
  if (!res.ok) throw new Error(await res.text());
  if (res.status === 204) return undefined as unknown as T;
  return (await res.json()) as T;
}

// Transformers from snake_case API to camelCase UI types
function mapProject(p: any): Project {
  return {
    id: p.id,
    title: p.title,
    description: p.description ?? null,
    imageUrl: p.image_url ?? null,
    demoUrl: p.demo_url ?? null,
    githubUrl: p.github_url ?? null,
    technologies: p.technologies ?? [],
    featured: !!p.featured,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  };
}

function mapBlogPost(p: any): BlogPost {
  return {
    id: p.id,
    title: p.title,
    content: p.content,
    excerpt: p.excerpt ?? null,
    slug: p.slug,
    published: !!p.published,
    featuredImageUrl: p.featured_image_url ?? null,
    tags: p.tags ?? [],
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  };
}

type Skill = { id: number; name: string; category: string; proficiency: number; iconName?: string };

const portfolio = {
  adminLogin: (body: { email: string; password: string }) => http<{ ok: boolean }>(`/admin/login`, { method: 'POST', body: JSON.stringify(body) }),
  // Projects
  listProjects: async () => {
    const data = await http<{ projects: any[] }>(`/projects`, { method: 'GET' });
    return { projects: data.projects.map(mapProject) } as { projects: Project[] };
  },
  createProject: async (body: any) => {
    const data = await http<any>(`/projects`, { method: 'POST', body: JSON.stringify(body) });
    return mapProject(data);
  },
  updateProject: async (body: any & { id: number }) => {
    const data = await http<any>(`/projects/${body.id}`, { method: 'PUT', body: JSON.stringify(body) });
    return mapProject(data);
  },
  deleteProject: (params: { id: number }) => http<void>(`/projects/${params.id}`, { method: 'DELETE' }),
  // Blog
  listBlogPosts: async () => {
    const data = await http<{ posts: any[] }>(`/blog`, { method: 'GET' });
    return { posts: data.posts.map(mapBlogPost) } as { posts: BlogPost[] };
  },
  getBlogPost: async (params: { slug: string }) => {
    const data = await http<{ post: any }>(`/blog/${params.slug}`, { method: 'GET' });
    return mapBlogPost(data.post);
  },
  createBlogPost: async (body: { title: string; content: string; excerpt?: string; slug: string; published?: boolean; featuredImageUrl?: string; tags?: string[] }) => {
    const payload = {
      title: body.title,
      content: body.content,
      excerpt: body.excerpt ?? null,
      slug: body.slug,
      published: !!body.published,
      featured_image_url: body.featuredImageUrl ?? null,
      tags: body.tags ?? [],
    };
    const data = await http<any>(`/blog`, { method: 'POST', body: JSON.stringify(payload) });
    return mapBlogPost(data);
  },
  updateBlogPost: async (body: { id: number; title?: string; content?: string; excerpt?: string; slug?: string; published?: boolean; featuredImageUrl?: string; tags?: string[] }) => {
    const payload = {
      title: body.title,
      content: body.content,
      excerpt: body.excerpt,
      slug: body.slug,
      published: body.published,
      featured_image_url: body.featuredImageUrl,
      tags: body.tags,
    };
    const data = await http<any>(`/blog/${body.id}`, { method: 'PUT', body: JSON.stringify(payload) });
    return mapBlogPost(data);
  },
  deleteBlogPost: (params: { id: number }) => http<void>(`/blog/${params.id}`, { method: 'DELETE' }),
  // Skills
  listSkills: async () => {
    const data = await http<{ skills: any[] }>(`/skills`, { method: 'GET' });
    return {
      skills: data.skills.map((s) => ({
        id: s.id,
        name: s.name,
        category: s.category ?? '',
        proficiency: typeof s.level === 'number' ? s.level : 1,
        iconName: s.icon_name ?? undefined,
      })),
    } as { skills: Skill[] };
  },
  createSkill: async (body: { name: string; category: string; proficiency: number; iconName?: string }) => {
    const payload = { name: body.name, category: body.category, level: body.proficiency };
    const data = await http<any>(`/skills`, { method: 'POST', body: JSON.stringify(payload) });
    return { id: data.id, name: data.name, category: data.category ?? '', proficiency: data.level ?? 1, iconName: data.icon_name ?? undefined } as Skill;
  },
  // Settings
  getSiteSettings: () => http<any>(`/settings`, { method: 'GET' }),
  updateSiteSettings: (body: any) => http<any>(`/settings`, { method: 'PUT', body: JSON.stringify(body) }),
  // Contact
  submitContact: (body: { name: string; email: string; message: string }) => http<{ ok: boolean }>(`/contact`, { method: 'POST', body: JSON.stringify(body) }),
};

const api = { portfolio };
export default api;
