import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const USE_SUPABASE = !!(supabaseUrl && supabaseAnonKey);

const supabase = USE_SUPABASE ? createClient(supabaseUrl!, supabaseAnonKey!) : null;

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

// Convert snake_case from Supabase to camelCase
function toCamelUser(row: any): StoredUser {
  if (!row) return null as any;
  return {
    id: row.id,
    email: row.email,
    password: row.password,
    name: row.name,
    credits: row.credits,
    plan: row.plan,
    sessionToken: row.session_token,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toCamelGeneration(row: any): StoredGeneration {
  if (!row) return null as any;
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type,
    topic: row.topic,
    tone: row.tone,
    length: row.length,
    output: row.output,
    language: row.language || "en",
    createdAt: row.created_at,
  };
}

function toCamelCalendarEvent(row: any): StoredCalendarEvent {
  if (!row) return null as any;
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    date: row.date,
    platform: row.platform,
    status: row.status,
    contentId: row.content_id,
    createdAt: row.created_at,
  };
}

function toCamelBrandVoice(row: any): StoredBrandVoice {
  if (!row) return null as any;
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    tone: row.tone,
    style: row.style,
    audience: row.audience,
    keywords: row.keywords || [],
    createdAt: row.created_at,
  };
}

function toCamelTeamMember(row: any): StoredTeamMember {
  if (!row) return null as any;
  return {
    id: row.id,
    userId: row.user_id,
    email: row.email,
    name: row.name,
    role: row.role,
    invitedAt: row.invited_at,
    acceptedAt: row.accepted_at,
  };
}

function toCamelReferral(row: any): StoredReferral {
  if (!row) return null as any;
  return {
    id: row.id,
    referrerId: row.referrer_id,
    code: row.code,
    clicks: row.clicks,
    signups: row.signups,
    credits: row.credits,
  };
}

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

// ============================================================
// In-memory fallback store (used when Supabase is not configured)
// ============================================================
const memUsers = new Map<string, StoredUser>();
const memGenerations = new Map<string, StoredGeneration>();
const memCalendarEvents = new Map<string, StoredCalendarEvent>();
const memBrandVoices = new Map<string, StoredBrandVoice>();
const memTeamMembers = new Map<string, StoredTeamMember>();
const memReferrals = new Map<string, StoredReferral>();
const memEmailIndex = new Map<string, string>();
const memSessionIndex = new Map<string, string>();

// ============================================================
// Supabase-backed db operations
// ============================================================
const dbSupabase = {
  user: {
    findUnique: async ({ where }: { where: { email?: string; sessionToken?: string; id?: string } }) => {
      if (!supabase) return null;
      if (where.id) {
        const { data, error } = await supabase.from("users").select("*").eq("id", where.id).single();
        if (error) return null;
        return toCamelUser(data);
      }
      if (where.email) {
        const { data, error } = await supabase.from("users").select("*").eq("email", where.email).single();
        if (error) return null;
        return toCamelUser(data);
      }
      if (where.sessionToken) {
        const { data, error } = await supabase.from("users").select("*").eq("session_token", where.sessionToken).single();
        if (error) return null;
        return toCamelUser(data);
      }
      return null;
    },
    create: async ({ data }: { data: { email: string; password: string; name?: string; sessionToken?: string; credits?: number; plan?: string; referralCode?: string } }) => {
      if (!supabase) throw new Error("No database");
      const id = genId();
      const insertData: any = {
        id,
        email: data.email,
        password: data.password,
        name: data.name || data.email.split("@")[0],
        credits: data.credits ?? 10,
        plan: data.plan || "free",
        session_token: data.sessionToken || null,
      };
      const { data: row, error } = await supabase.from("users").insert(insertData).select().single();
      if (error) throw new Error(error.message);
      const user = toCamelUser(row);
      if (data.referralCode) {
        const { data: refs } = await supabase.from("referrals").select("*").eq("code", data.referralCode);
        if (refs && refs.length > 0) {
          const ref = refs[0];
          await supabase.from("referrals").update({ signups: ref.signups + 1 }).eq("id", ref.id);
          await supabase.from("users").update({ credits: ref.credits + 50 }).eq("id", ref.referrer_id);
        }
      }
      return user;
    },
    update: async ({ where, data }: { where: { id: string }; data: Partial<StoredUser> }) => {
      if (!supabase) throw new Error("No database");
      const updateData: any = { updated_at: now() };
      if (data.sessionToken !== undefined) updateData.session_token = data.sessionToken;
      if (data.credits !== undefined) updateData.credits = data.credits;
      if (data.name !== undefined) updateData.name = data.name;
      if (data.plan !== undefined) updateData.plan = data.plan;
      const { data: row, error } = await supabase.from("users").update(updateData).eq("id", where.id).select().single();
      if (error) throw new Error(error.message);
      return toCamelUser(row);
    },
    updateMany: async ({ where, data }: { where: { sessionToken?: string }; data: Partial<StoredUser> }) => {
      if (!supabase) throw new Error("No database");
      if (where.sessionToken) {
        const updateData: any = { updated_at: now() };
        if (data.sessionToken !== undefined) updateData.session_token = data.sessionToken;
        await supabase.from("users").update(updateData).eq("session_token", where.sessionToken);
      }
      return { count: 1 };
    },
  },
  generation: {
    create: async ({ data }: { data: any }) => {
      if (!supabase) throw new Error("No database");
      const id = genId();
      const insertData = {
        id,
        user_id: data.userId,
        type: data.type,
        topic: data.topic,
        tone: data.tone || "professional",
        length: data.length || "medium",
        output: data.output,
      };
      const { data: row, error } = await supabase.from("generations").insert(insertData).select().single();
      if (error) throw new Error(error.message);
      return toCamelGeneration(row);
    },
    findMany: async ({ where, orderBy, take }: { where?: { userId: string }; orderBy?: { createdAt: string }; take?: number }) => {
      if (!supabase) return [];
      let query = supabase.from("generations").select("*");
      if (where?.userId) query = query.eq("user_id", where.userId);
      if (orderBy?.createdAt === "desc") query = query.order("created_at", { ascending: false });
      else query = query.order("created_at", { ascending: true });
      if (take) query = query.limit(take);
      const { data, error } = await query;
      if (error) return [];
      return (data || []).map(toCamelGeneration);
    },
    findFirst: async ({ where }: { where: { id: string; userId: string } }) => {
      if (!supabase) return null;
      const { data, error } = await supabase.from("generations").select("*").eq("id", where.id).eq("user_id", where.userId).single();
      if (error) return null;
      return toCamelGeneration(data);
    },
    delete: async ({ where }: { where: { id: string } }) => {
      if (!supabase) return;
      await supabase.from("generations").delete().eq("id", where.id);
    },
    count: async ({ where }: { where?: { userId: string } }) => {
      if (!supabase) return 0;
      let query = supabase.from("generations").select("*", { count: "exact", head: true });
      if (where?.userId) query = query.eq("user_id", where.userId);
      const { count, error } = await query;
      if (error) return 0;
      return count || 0;
    },
  },
  calendarEvent: {
    create: async ({ data }: { data: any }) => {
      if (!supabase) throw new Error("No database");
      const id = genId();
      const insertData = {
        id,
        user_id: data.userId,
        title: data.title,
        date: data.date,
        platform: data.platform || "Instagram",
        status: data.status || "scheduled",
        content_id: data.contentId || null,
      };
      const { data: row, error } = await supabase.from("calendar_events").insert(insertData).select().single();
      if (error) throw new Error(error.message);
      return toCamelCalendarEvent(row);
    },
    findMany: async ({ where, orderBy }: { where?: { userId: string; date?: { gte?: string; lte?: string } }; orderBy?: { date: string } }) => {
      if (!supabase) return [];
      let query = supabase.from("calendar_events").select("*");
      if (where?.userId) query = query.eq("user_id", where.userId);
      if (where?.date?.gte) query = query.gte("date", where.date.gte);
      if (where?.date?.lte) query = query.lte("date", where.date.lte);
      if (orderBy?.date === "asc") query = query.order("date", { ascending: true });
      else query = query.order("date", { ascending: false });
      const { data, error } = await query;
      if (error) return [];
      return (data || []).map(toCamelCalendarEvent);
    },
    delete: async ({ where }: { where: { id: string } }) => {
      if (!supabase) return;
      await supabase.from("calendar_events").delete().eq("id", where.id);
    },
  },
  brandVoice: {
    create: async ({ data }: { data: any }) => {
      if (!supabase) throw new Error("No database");
      const id = genId();
      const insertData = {
        id,
        user_id: data.userId,
        name: data.name,
        tone: data.tone || "",
        style: data.style || "",
        audience: data.audience || "",
        keywords: data.keywords || [],
      };
      const { data: row, error } = await supabase.from("brand_voices").insert(insertData).select().single();
      if (error) throw new Error(error.message);
      return toCamelBrandVoice(row);
    },
    findMany: async ({ where }: { where?: { userId: string } }) => {
      if (!supabase) return [];
      let query = supabase.from("brand_voices").select("*");
      if (where?.userId) query = query.eq("user_id", where.userId);
      const { data, error } = await query;
      if (error) return [];
      return (data || []).map(toCamelBrandVoice);
    },
    findFirst: async ({ where }: { where: { id: string; userId: string } }) => {
      if (!supabase) return null;
      const { data, error } = await supabase.from("brand_voices").select("*").eq("id", where.id).eq("user_id", where.userId).single();
      if (error) return null;
      return toCamelBrandVoice(data);
    },
    delete: async ({ where }: { where: { id: string } }) => {
      if (!supabase) return;
      await supabase.from("brand_voices").delete().eq("id", where.id);
    },
  },
  template: {
    findMany: async ({ where }: { where?: { category?: string; isPremium?: boolean } }) => {
      let results = [...templates];
      if (where?.category) results = results.filter(t => t.category === where.category);
      if (where?.isPremium !== undefined) results = results.filter(t => t.isPremium === where.isPremium);
      return results;
    },
    findFirst: async ({ where }: { where: { id: string } }) => {
      return templates.find(t => t.id === where.id) || null;
    },
  },
  teamMember: {
    create: async ({ data }: { data: any }) => {
      if (!supabase) throw new Error("No database");
      const id = genId();
      const insertData = {
        id,
        user_id: data.userId,
        email: data.email,
        name: data.name,
        role: data.role || "member",
        accepted_at: null,
      };
      const { data: row, error } = await supabase.from("team_members").insert(insertData).select().single();
      if (error) throw new Error(error.message);
      return toCamelTeamMember(row);
    },
    findMany: async ({ where }: { where?: { userId: string } }) => {
      if (!supabase) return [];
      let query = supabase.from("team_members").select("*");
      if (where?.userId) query = query.eq("user_id", where.userId);
      const { data, error } = await query;
      if (error) return [];
      return (data || []).map(toCamelTeamMember);
    },
    delete: async ({ where }: { where: { id: string } }) => {
      if (!supabase) return;
      await supabase.from("team_members").delete().eq("id", where.id);
    },
  },
  referral: {
    create: async ({ data }: { data: { referrerId: string } }) => {
      if (!supabase) throw new Error("No database");
      const code = genId().substring(0, 8).toUpperCase();
      const id = genId();
      const insertData = {
        id,
        referrer_id: data.referrerId,
        code,
        clicks: 0,
        signups: 0,
        credits: 0,
      };
      const { data: row, error } = await supabase.from("referrals").insert(insertData).select().single();
      if (error) throw new Error(error.message);
      return toCamelReferral(row);
    },
    findFirst: async ({ where }: any) => {
      if (!supabase) return null;
      if (where.referrerId) {
        const { data, error } = await supabase.from("referrals").select("*").eq("referrer_id", where.referrerId).single();
        if (error) return null;
        return toCamelReferral(data);
      }
      if (where.code) {
        const { data, error } = await supabase.from("referrals").select("*").eq("code", where.code).single();
        if (error) return null;
        return toCamelReferral(data);
      }
      return null;
    },
    incrementClicks: async ({ where }: { where: { code: string } }) => {
      if (!supabase) return null;
      const { data, error } = await supabase.from("referrals").select("*").eq("code", where.code).single();
      if (error) return null;
      const { data: row } = await supabase.from("referrals").update({ clicks: data.clicks + 1 }).eq("code", where.code).select().single();
      return toCamelReferral(row);
    },
  },
  stats: {
    getUserStats: async (userId: string) => {
      if (!supabase) return { total: 0, byType: {}, byDay: {}, calendarEvents: 0 };
      const { data: gens } = await supabase.from("generations").select("*").eq("user_id", userId);
      const userGens = (gens || []).map(toCamelGeneration);
      const typeCounts: Record<string, number> = {};
      userGens.forEach(g => { typeCounts[g.type] = (typeCounts[g.type] || 0) + 1; });
      const byDay: Record<string, number> = {};
      userGens.forEach(g => { const day = g.createdAt.split("T")[0]; byDay[day] = (byDay[day] || 0) + 1; });
      let calendarEvents = 0;
      try {
        const { count: calCount } = await supabase.from("calendar_events").select("*", { count: "exact", head: true }).eq("user_id", userId);
        calendarEvents = calCount || 0;
      } catch { /* table may not exist */ }
      return { total: userGens.length, byType: typeCounts, byDay, calendarEvents };
    },
  },
  trackerCategory: { findMany: async () => [], count: async () => 0 },
  trackerEntry: { findMany: async () => [], count: async () => 0, aggregate: async () => ({ _sum: { value: 0 }, _avg: { value: 0 }, _max: { value: 0 }, _min: { value: 0 } }) },
};

// ============================================================
// In-memory fallback db operations
// ============================================================
const dbMemory = {
  user: {
    findUnique: async ({ where }: { where: { email?: string; sessionToken?: string; id?: string } }) => {
      if (where.email) { const id = memEmailIndex.get(where.email); return id ? (memUsers.get(id) || null) : null; }
      if (where.sessionToken) { const id = memSessionIndex.get(where.sessionToken); return id ? (memUsers.get(id) || null) : null; }
      if (where.id) return memUsers.get(where.id) || null;
      return null;
    },
    create: async ({ data }: { data: { email: string; password: string; name?: string; sessionToken?: string; credits?: number; plan?: string; referralCode?: string } }) => {
      const id = genId();
      const user: StoredUser = { id, email: data.email, password: data.password, name: data.name || data.email.split("@")[0], credits: data.credits ?? 10, plan: data.plan || "free", sessionToken: data.sessionToken || null, createdAt: now(), updatedAt: now() };
      memUsers.set(id, user);
      memEmailIndex.set(data.email, id);
      if (data.sessionToken) memSessionIndex.set(data.sessionToken, id);
      return user;
    },
    update: async ({ where, data }: { where: { id: string }; data: Partial<StoredUser> }) => {
      const user = memUsers.get(where.id);
      if (!user) throw new Error("User not found");
      const updated = { ...user, ...data, updatedAt: now() };
      memUsers.set(where.id, updated);
      if (data.sessionToken !== undefined) { if (user.sessionToken) memSessionIndex.delete(user.sessionToken); if (data.sessionToken) memSessionIndex.set(data.sessionToken, where.id); }
      return updated;
    },
    updateMany: async ({ where, data }: { where: { sessionToken?: string }; data: Partial<StoredUser> }) => {
      if (where.sessionToken) {
        const userId = memSessionIndex.get(where.sessionToken);
        if (userId) { const user = memUsers.get(userId); if (user) { memSessionIndex.delete(where.sessionToken); memUsers.set(userId, { ...user, ...data, updatedAt: now() }); } }
      }
      return { count: 1 };
    },
  },
  generation: {
    create: async ({ data }: { data: any }) => {
      const id = genId();
      const gen: StoredGeneration = { id, userId: data.userId, type: data.type, topic: data.topic, tone: data.tone || "professional", length: data.length || "medium", output: data.output, language: data.language || "en", createdAt: now() };
      memGenerations.set(id, gen);
      return gen;
    },
    findMany: async ({ where, orderBy, take }: { where?: { userId: string }; orderBy?: { createdAt: string }; take?: number }) => {
      let results = Array.from(memGenerations.values());
      if (where?.userId) results = results.filter(g => g.userId === where.userId);
      if (orderBy?.createdAt === "desc") results = results.reverse();
      if (take) results = results.slice(0, take);
      return results;
    },
    findFirst: async ({ where }: { where: { id: string; userId: string } }) => {
      const gen = memGenerations.get(where.id);
      return gen && gen.userId === where.userId ? gen : null;
    },
    delete: async ({ where }: { where: { id: string } }) => { memGenerations.delete(where.id); },
    count: async ({ where }: { where?: { userId: string } }) => {
      if (where?.userId) return Array.from(memGenerations.values()).filter(g => g.userId === where.userId).length;
      return memGenerations.size;
    },
  },
  calendarEvent: {
    create: async ({ data }: { data: any }) => {
      const id = genId();
      const evt: StoredCalendarEvent = { id, userId: data.userId, title: data.title, date: data.date, platform: data.platform || "Instagram", status: data.status || "scheduled", contentId: data.contentId, createdAt: now() };
      memCalendarEvents.set(id, evt);
      return evt;
    },
    findMany: async ({ where, orderBy }: { where?: { userId: string; date?: { gte?: string; lte?: string } }; orderBy?: { date: string } }) => {
      let results = Array.from(memCalendarEvents.values());
      if (where?.userId) results = results.filter(e => e.userId === where.userId);
      if (where?.date?.gte) results = results.filter(e => e.date >= where.date!.gte!);
      if (where?.date?.lte) results = results.filter(e => e.date <= where.date!.lte!);
      if (orderBy?.date === "asc") results.sort((a, b) => a.date.localeCompare(b.date));
      else results.sort((a, b) => b.date.localeCompare(a.date));
      return results;
    },
    delete: async ({ where }: { where: { id: string } }) => { memCalendarEvents.delete(where.id); },
  },
  brandVoice: {
    create: async ({ data }: { data: any }) => {
      const id = genId();
      const bv: StoredBrandVoice = { id, userId: data.userId, name: data.name, tone: data.tone || "", style: data.style || "", audience: data.audience || "", keywords: data.keywords || [], createdAt: now() };
      memBrandVoices.set(id, bv);
      return bv;
    },
    findMany: async ({ where }: { where?: { userId: string } }) => {
      let results = Array.from(memBrandVoices.values());
      if (where?.userId) results = results.filter(v => v.userId === where.userId);
      return results;
    },
    findFirst: async ({ where }: { where: { id: string; userId: string } }) => {
      const bv = memBrandVoices.get(where.id);
      return bv && bv.userId === where.userId ? bv : null;
    },
    delete: async ({ where }: { where: { id: string } }) => { memBrandVoices.delete(where.id); },
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
    create: async ({ data }: { data: any }) => {
      const id = genId();
      const tm: StoredTeamMember = { id, userId: data.userId, email: data.email, name: data.name, role: data.role || "member", invitedAt: now(), acceptedAt: null };
      memTeamMembers.set(id, tm);
      return tm;
    },
    findMany: async ({ where }: { where?: { userId: string } }) => {
      let results = Array.from(memTeamMembers.values());
      if (where?.userId) results = results.filter(m => m.userId === where.userId);
      return results;
    },
    delete: async ({ where }: { where: { id: string } }) => { memTeamMembers.delete(where.id); },
  },
  referral: {
    create: async ({ data }: { data: { referrerId: string } }) => {
      const code = genId().substring(0, 8).toUpperCase();
      const id = genId();
      const ref: StoredReferral = { id, referrerId: data.referrerId, code, clicks: 0, signups: 0, credits: 0 };
      memReferrals.set(id, ref);
      return ref;
    },
    findFirst: async ({ where }: any) => {
      for (const ref of memReferrals.values()) {
        if ("referrerId" in where && ref.referrerId === where.referrerId) return ref;
        if ("code" in where && ref.code === where.code) return ref;
      }
      return null;
    },
    incrementClicks: async ({ where }: { where: { code: string } }) => {
      for (const ref of memReferrals.values()) {
        if (ref.code === where.code) { ref.clicks += 1; return ref; }
      }
      return null;
    },
  },
  stats: {
    getUserStats: async (userId: string) => {
      const userGens = Array.from(memGenerations.values()).filter(g => g.userId === userId);
      const typeCounts: Record<string, number> = {};
      userGens.forEach(g => { typeCounts[g.type] = (typeCounts[g.type] || 0) + 1; });
      const byDay: Record<string, number> = {};
      userGens.forEach(g => { const day = g.createdAt.split("T")[0]; byDay[day] = (byDay[day] || 0) + 1; });
      return { total: userGens.length, byType: typeCounts, byDay, calendarEvents: Array.from(memCalendarEvents.values()).filter(e => e.userId === userId).length };
    },
  },
  trackerCategory: { findMany: async () => [], count: async () => 0 },
  trackerEntry: { findMany: async () => [], count: async () => 0, aggregate: async () => ({ _sum: { value: 0 }, _avg: { value: 0 }, _max: { value: 0 }, _min: { value: 0 } }) },
};

// Export the right db based on whether Supabase is configured
export const db = USE_SUPABASE ? dbSupabase : dbMemory;
