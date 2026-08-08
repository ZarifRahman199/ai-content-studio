// In-memory store for Vercel serverless (survives while function is warm)

export interface StoredUser {
  id: string;
  email: string;
  password: string;
  name: string | null;
  credits: number;
  plan: string;
  sessionToken: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StoredGeneration {
  id: string;
  userId: string;
  type: string;
  topic: string;
  tone: string;
  length: string;
  output: string;
  language: string;
  createdAt: string;
}

export interface StoredCalendarEvent {
  id: string;
  userId: string;
  title: string;
  date: string;
  platform: string;
  status: string;
  contentId?: string;
  createdAt: string;
}

export interface StoredBrandVoice {
  id: string;
  userId: string;
  name: string;
  tone: string;
  style: string;
  audience: string;
  keywords: string[];
  createdAt: string;
}

export interface StoredTemplate {
  id: string;
  category: string;
  type: string;
  title: string;
  prompt: string;
  isPremium: boolean;
}

export interface StoredTeamMember {
  id: string;
  userId: string;
  email: string;
  name: string;
  role: string;
  invitedAt: string;
  acceptedAt: string | null;
}

export interface StoredReferral {
  id: string;
  referrerId: string;
  code: string;
  clicks: number;
  signups: number;
  credits: number;
}

const users = new Map<string, StoredUser>();
const generations = new Map<string, StoredGeneration>();
const calendarEvents = new Map<string, StoredCalendarEvent>();
const brandVoices = new Map<string, StoredBrandVoice>();
const teamMembers = new Map<string, StoredTeamMember>();
const referrals = new Map<string, StoredReferral>();
const emailIndex = new Map<string, string>();
const sessionIndex = new Map<string, string>();

function genId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
function now(): string { return new Date().toISOString(); }

// Templates (static)
const templates: StoredTemplate[] = [
  { id: "t1", category: "social", type: "instagram", title: "Instagram Product Launch", prompt: "Create an engaging Instagram caption for a product launch. Include emojis, hashtags, and a CTA.", isPremium: false },
  { id: "t2", category: "social", type: "twitter", title: "Twitter Thread (5 tweets)", prompt: "Write a viral Twitter thread with 5 tweets about {topic}. Make each tweet impactful.", isPremium: false },
  { id: "t3", category: "social", type: "linkedin", title: "LinkedIn Thought Leadership", prompt: "Write a professional LinkedIn post that positions the author as a thought leader on {topic}.", isPremium: false },
  { id: "t4", category: "blog", type: "howto", title: "How-To Guide", prompt: "Write a comprehensive how-to guide about {topic} with clear steps, tips, and examples.", isPremium: false },
  { id: "t5", category: "blog", type: "listicle", title: "Listicle Article", prompt: "Write an engaging listicle article about {topic} with 10 items, each with a brief explanation.", isPremium: false },
  { id: "t6", category: "email", type: "newsletter", title: "Newsletter Welcome Email", prompt: "Write a warm welcome email for new subscribers. Introduce the brand, set expectations, and include a CTA.", isPremium: false },
  { id: "t7", category: "email", type: "promo", title: "Promotional Email", prompt: "Write a high-converting promotional email for {topic}. Include urgency, benefits, social proof, and a strong CTA.", isPremium: true },
  { id: "t8", category: "ad", type: "facebook", title: "Facebook Ad Copy", prompt: "Write compelling Facebook ad copy for {topic}. Include headline, primary text, description, and CTA.", isPremium: false },
  { id: "t9", category: "ad", type: "google", title: "Google Search Ad", prompt: "Write Google Search ad copy for {topic}. Include 3 headline variations and 2 description variations.", isPremium: true },
  { id: "t10", category: "social", type: "tiktok", title: "TikTok Caption + Hook", prompt: "Write a TikTok caption and hook line for a video about {topic}. Keep it short, trendy, and engaging.", isPremium: false },
  { id: "t11", category: "blog", type: "seo", title: "SEO-Optimized Blog Post", prompt: "Write an SEO-optimized blog post about {topic}. Include meta title, meta description, headers, and keyword-rich content.", isPremium: true },
  { id: "t12", category: "email", type: "sequence", title: "3-Email Drip Sequence", prompt: "Write a 3-email drip sequence for {topic}. Email 1: Welcome. Email 2: Value. Email 3: Conversion.", isPremium: true },
];

export const db = {
  user: {
    findUnique: async ({ where }: { where: { email?: string; sessionToken?: string; id?: string } }) => {
      if (where.email) { const id = emailIndex.get(where.email); return id ? (users.get(id) || null) : null; }
      if (where.sessionToken) { const id = sessionIndex.get(where.sessionToken); return id ? (users.get(id) || null) : null; }
      if (where.id) return users.get(where.id) || null;
      return null;
    },
    create: async ({ data }: { data: { email: string; password: string; name?: string; sessionToken?: string; credits?: number; plan?: string; referralCode?: string } }) => {
      const id = genId();
      const user: StoredUser = { id, email: data.email, password: data.password, name: data.name || data.email.split("@")[0], credits: data.credits ?? 10, plan: data.plan || "free", sessionToken: data.sessionToken || null, createdAt: now(), updatedAt: now() };
      users.set(id, user);
      emailIndex.set(data.email, id);
      if (data.sessionToken) sessionIndex.set(data.sessionToken, id);
      if (data.referralCode) {
        const ref = referrals.get(data.referralCode);
        if (ref) { ref.signups += 1; const referrer = users.get(ref.referrerId); if (referrer) { referrer.credits += 50; } }
      }
      return user;
    },
    update: async ({ where, data }: { where: { id: string }; data: Partial<StoredUser> }) => {
      const user = users.get(where.id);
      if (!user) throw new Error("User not found");
      const updated = { ...user, ...data, updatedAt: now() };
      users.set(where.id, updated);
      if (data.sessionToken !== undefined) { if (user.sessionToken) sessionIndex.delete(user.sessionToken); if (data.sessionToken) sessionIndex.set(data.sessionToken, where.id); }
      return updated;
    },
    updateMany: async ({ where, data }: { where: { sessionToken?: string }; data: Partial<StoredUser> }) => {
      if (where.sessionToken) {
        const userId = sessionIndex.get(where.sessionToken);
        if (userId) { const user = users.get(userId); if (user) { sessionIndex.delete(where.sessionToken); users.set(userId, { ...user, ...data, updatedAt: now() }); } }
      }
      return { count: 1 };
    },
  },
  generation: {
    create: async ({ data }: { data: Omit<StoredGeneration, "id" | "createdAt"> }) => {
      const id = genId();
      const gen: StoredGeneration = { id, ...data, createdAt: now() };
      generations.set(id, gen);
      return gen;
    },
    findMany: async ({ where, orderBy, take }: { where?: { userId: string }; orderBy?: { createdAt: string }; take?: number }) => {
      let results = Array.from(generations.values());
      if (where?.userId) results = results.filter(g => g.userId === where.userId);
      if (orderBy?.createdAt === "desc") results = results.reverse();
      if (take) results = results.slice(0, take);
      return results;
    },
    findFirst: async ({ where }: { where: { id: string; userId: string } }) => {
      const gen = generations.get(where.id);
      return gen && gen.userId === where.userId ? gen : null;
    },
    delete: async ({ where }: { where: { id: string } }) => { generations.delete(where.id); },
    count: async ({ where }: { where?: { userId: string } }) => {
      if (where?.userId) return Array.from(generations.values()).filter(g => g.userId === where.userId).length;
      return generations.size;
    },
  },
  calendarEvent: {
    create: async ({ data }: { data: Omit<StoredCalendarEvent, "id" | "createdAt"> }) => {
      const id = genId();
      const evt: StoredCalendarEvent = { id, ...data, createdAt: now() };
      calendarEvents.set(id, evt);
      return evt;
    },
    findMany: async ({ where, orderBy }: { where?: { userId: string; date?: { gte?: string; lte?: string } }; orderBy?: { date: string } }) => {
      let results = Array.from(calendarEvents.values());
      if (where?.userId) results = results.filter(e => e.userId === where.userId);
      if (where?.date?.gte) results = results.filter(e => e.date >= where.date!.gte!);
      if (where?.date?.lte) results = results.filter(e => e.date <= where.date!.lte!);
      if (orderBy?.date === "asc") results.sort((a, b) => a.date.localeCompare(b.date));
      else results.sort((a, b) => b.date.localeCompare(a.date));
      return results;
    },
    delete: async ({ where }: { where: { id: string } }) => { calendarEvents.delete(where.id); },
  },
  brandVoice: {
    create: async ({ data }: { data: Omit<StoredBrandVoice, "id" | "createdAt"> }) => {
      const id = genId();
      const bv: StoredBrandVoice = { id, ...data, createdAt: now() };
      brandVoices.set(id, bv);
      return bv;
    },
    findMany: async ({ where }: { where?: { userId: string } }) => {
      let results = Array.from(brandVoices.values());
      if (where?.userId) results = results.filter(v => v.userId === where.userId);
      return results;
    },
    findFirst: async ({ where }: { where: { id: string; userId: string } }) => {
      const bv = brandVoices.get(where.id);
      return bv && bv.userId === where.userId ? bv : null;
    },
    delete: async ({ where }: { where: { id: string } }) => { brandVoices.delete(where.id); },
  },
  template: {
    findMany: async ({ where }: { where?: { category?: string; isPremium?: boolean } }) => {
      let results = [...templates];
      if (where?.category) results = results.filter(t => t.category === where.category);
      if (where?.isPremium !== undefined) results = results.filter(t => t.isPremium === where.isPremium);
      return results;
    },
    findFirst: async ({ where }: { where: { id: string } }) => { return templates.find(t => t.id === where.id) || null; },
  },
  teamMember: {
    create: async ({ data }: { data: Omit<StoredTeamMember, "id" | "invitedAt" | "acceptedAt"> }) => {
      const id = genId();
      const tm: StoredTeamMember = { id, ...data, invitedAt: now(), acceptedAt: null };
      teamMembers.set(id, tm);
      return tm;
    },
    findMany: async ({ where }: { where?: { userId: string } }) => {
      let results = Array.from(teamMembers.values());
      if (where?.userId) results = results.filter(m => m.userId === where.userId);
      return results;
    },
    delete: async ({ where }: { where: { id: string } }) => { teamMembers.delete(where.id); },
  },
  referral: {
    create: async ({ data }: { data: { referrerId: string } }) => {
      const code = genId().substring(0, 8).toUpperCase();
      const id = genId();
      const ref: StoredReferral = { id, referrerId: data.referrerId, code, clicks: 0, signups: 0, credits: 0 };
      referrals.set(id, ref);
      return ref;
    },
    findFirst: async ({ where }: { where: { referrerId: string } | { code: string } }) => {
      for (const ref of referrals.values()) {
        if ("referrerId" in where && ref.referrerId === where.referrerId) return ref;
        if ("code" in where && ref.code === where.code) return ref;
      }
      return null;
    },
    incrementClicks: async ({ where }: { where: { code: string } }) => {
      for (const ref of referrals.values()) {
        if (ref.code === where.code) { ref.clicks += 1; return ref; }
      }
      return null;
    },
  },
  // Stats
  stats: {
    getUserStats: async (userId: string) => {
      const userGens = Array.from(generations.values()).filter(g => g.userId === userId);
      const typeCounts: Record<string, number> = {};
      userGens.forEach(g => { typeCounts[g.type] = (typeCounts[g.type] || 0) + 1; });
      const byDay: Record<string, number> = {};
      userGens.forEach(g => { const day = g.createdAt.split("T")[0]; byDay[day] = (byDay[day] || 0) + 1; });
      return { total: userGens.length, byType: typeCounts, byDay, calendarEvents: Array.from(calendarEvents.values()).filter(e => e.userId === userId).length };
    },
  },
  // Legacy compat
  trackerCategory: { findMany: async () => [], count: async () => 0 },
  trackerEntry: { findMany: async () => [], count: async () => 0, aggregate: async () => ({ _sum: { value: 0 }, _avg: { value: 0 }, _max: { value: 0 }, _min: { value: 0 } }) },
};
