const API_BASE = "http://localhost:3000";

export interface DiscoverProfile {
  id: string;
  full_name: string;
  current_role: string;
  city: string;
  main_image_url: string;
  is_match_preview: boolean;
}

export interface InteractResult {
  status: "liked" | "skipped" | "match";
  matchId?: string;
}

export interface MatchListItem {
  matchId: string;
  partnerId: string;
  partnerType: "talent" | "company";
  name: string;
  image: string;
  location: string;
  matchedAt: string;
}

export interface FullProfile {
  // ── Talent ──────────────────────────────────────────────
  name?: string;
  age?: string;
  location?: string;
  position?: string;
  specialty?: string;
  about?: string;
  profileImage?: string;
  portfolioItems?: Array<{
    id: string;
    preview: string;
    category: string;
    caption: string;
    projectLink: string;
  }>;
  education?: {
    degree?: string;
    institution?: string;
    customDegree?: string;
  };
  skills?: string[];
  experiences?: Array<{
    id: string;
    title: string;
    company: string;
    period: string;
    years: string;
    level: string;
    description: string;
  }>;
  otherExperiences?: unknown[];
  languages?: Array<{ language: string; level: string }>;
  recognitions?: Array<{ id: string; award: string; year: string }>;
  jobPreferences?: {
    workModel?: string[];
    availableFrom?: string;
    employmentType?: string[];
    otherPositions?: string[];
    preferredLocation?: string;
    employmentDuration?: string;
  };
  cvFile?: { name: string } | null;
  socialLinks?: Array<{ id: string; platform: string; url: string }>;
  // ── Company ─────────────────────────────────────────────
  companyName?: string;
  claim?: string;
  description?: string;
  industry?: string;
  companySize?: string;
  companyLogo?: string;
  galleryImages?: Array<{ url: string; caption: string }>;
  cultureValues?: string[];
  benefits?: Record<string, string[]>;
  jobTitle?: string;
  jobLocation?: string;
  workModel?: string[];
  startDate?: string;
  jobDescription?: string;
  salary?: string;
  contactPerson?: {
    name: string;
    role: string;
    email: string;
    phone?: string;
    website?: string;
    message: string;
    photo: string;
  };
}

export const discoverService = {
  async getFeed(authFetch: typeof fetch): Promise<DiscoverProfile[]> {
    const res = await authFetch(`${API_BASE}/discover`);
    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { detail?: string };
      throw new Error(err.detail ?? `Feed error ${res.status}`);
    }
    const data = (await res.json()) as { profiles: DiscoverProfile[] };
    return data.profiles ?? [];
  },

  async search(
    query: string,
    city: string,
    authFetch: typeof fetch,
  ): Promise<DiscoverProfile[]> {
    const params = new URLSearchParams();
    if (query) params.set("search", query);
    if (city) params.set("city", city);
    const res = await authFetch(`${API_BASE}/discover?${params.toString()}`);
    if (!res.ok) throw new Error(`Search error ${res.status}`);
    const data = (await res.json()) as { profiles: DiscoverProfile[] };
    return data.profiles ?? [];
  },

  async getProfile(
    id: string,
    authFetch: typeof fetch,
  ): Promise<{ profile: FullProfile; type: "talent" | "company" }> {
    const res = await authFetch(`${API_BASE}/discover/${id}`);
    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { detail?: string };
      throw new Error(err.detail ?? `Profile error ${res.status}`);
    }
    return res.json();
  },

  async getPublicProfile(
    id: string,
  ): Promise<{ profile: FullProfile; type: "talent" | "company" }> {
    const res = await fetch(`${API_BASE}/discover/public/${id}`);
    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { detail?: string };
      throw new Error(err.detail ?? `Profile error ${res.status}`);
    }
    return res.json();
  },

  async interact(
    targetId: string,
    action: "like" | "skip",
    authFetch: typeof fetch,
  ): Promise<InteractResult> {
    const res = await authFetch(`${API_BASE}/discover/interact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetId, action }),
    });
    if (!res.ok) throw new Error(`Interact error ${res.status}`);
    return res.json();
  },

  async getMatches(authFetch: typeof fetch): Promise<MatchListItem[]> {
    const res = await authFetch(`${API_BASE}/discover/matches`);
    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { detail?: string };
      throw new Error(err.detail ?? `Matches error ${res.status}`);
    }
    const data = (await res.json()) as { matches: MatchListItem[] };
    return data.matches ?? [];
  },
};
