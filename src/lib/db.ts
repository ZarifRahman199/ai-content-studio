// Supabase-backed persistent store

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// ── Interfaces (same as before) ──

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

// ── Helpers ──

function fromRow(row: any): any {
  if (!row) return null;
  const obj: any = { ...row };
  // Convert snake_case to camelCase
  if (obj.session_token !== undefined) { obj.sessionToken = obj.session_token; delete obj.session_token; }
  if (obj.referral_code !== undefined) { obj.referralCode = obj.referral_code; delete obj.referral_code; }
  if (obj.user_id !== undefined) { obj.userId = obj.user_id; delete obj.user_id; }
  if (obj.created_at !== undefined) { obj.createdAt = obj.created_at; delete obj.created_at; }
  if (obj.updated_at !== undefined) { obj.updatedAt = obj.updated_at; delete obj.updated_at; }
  if (obj.is_premium !== undefined) { obj.isPremium = obj.is_premium; delete obj.is_premium; }
  if (obj.invited_at !== undefined) { obj.invitedAt = obj.invited_at; delete obj.invited_at; }
  if (obj.accepted_at !== undefined) { obj.acceptedAt = obj.accepted_at; delete obj.accepted_at; }
  if (obj.referrer_id !== undefined) { obj.referrerId = obj.referrer_id; delete obj.referrer_id; }
  // Parse keywords from JSON string if needed
  if (typeof obj.keywords === "string") {
    try { obj.keywords = JSON.parse(obj.keywords); } catch { obj.keywords = []; }
  }
  return obj;
}

function toRow(obj: any): any {
  const row: any = { ...obj };
  if (row.sessionToken !== undefined) { row.session_token = row.sessionToken; delete row.sessionToken; }
  if (row.referralCode !== undefined) { row.referral_code = row.referralCode; delete row.referralCode; }
  if (row.userId !== undefined) { row.user_id = row.userId; delete row.userId; }
  if (row.createdAt !== undefined) { row.created_at = row.createdAt; delete row.createdAt; }
  if (row.updatedAt !== undefined) { row.updated_at = row.updatedAt; delete row.updatedAt; }
  if (row.isPremium !== undefined) { row.is_premium = row.isPremium; delete row.isPremium; }
  if (row.invitedAt !== undefined) { row.invited_at = row.invitedAt; delete row.invitedAt; }
  if (row.acceptedAt !== undefined) { row.accepted_at = row.acceptedAt; delete row.acceptedAt; }
  if (row.referrerId !== undefined) { row.referrer_id = row.referrerId; delete row.referrerId; }
  // Stringify keywords array
  if (Array.isArray(row.keywords)) { row.keywords = JSON.stringify(row.keywords); }
  return row;
}

function stripId(obj: any): any {
  const { id, ...rest } = obj;
  return rest;
}

// ── Database Client ──

export const db = {
  user: {
    findUnique: async ({ where }: { where: { email?: string; sessionToken?: string; id?: string } }) => {
      if (where.email) {
        const { data, error } = await supabase.from("users").select("*").eq("email", where.email).single();
        if (error || !data) return null;
        return fromRow(data) as StoredUser;
      }
      if (where.sessionToken) {
        const { data, error } = await supabase.from("users").select("*").eq("session_token", where.sessionToken).single();
        if (error || !data) return null;
        return fromRow(data) as StoredUser;
      }
      if (where.id) {
        const { data, error } = await supabase.from("users").select("*").eq("id", where.id).single();
        if (error || !data) return null;
        return fromRow(data) as StoredUser;
      }
      return null;
    },
    create: async ({ data }: { data: { email: string; password: string; name?: string; sessionToken?: string; credits?: number; plan?: string; referralCode?: string } }) => {
      const row = toRow({ ...data, updatedAt: new Date().toISOString() });
      const { data: newUserData, error } = await supabase.from("users").insert(row).select().single();
      if (error) throw new Error(error.message);
      // Handle referral if referralCode provided
      if (data.referralCode) {
        const { data: refData } = await supabase.from("referrals").select("*").eq("code", data.referralCode).single();
        if (refData) {
          await supabase.from("referrals").update({ signups: refData.signups + 1 }).eq("id", refData.id);
          await supabase.from("users").update({ credits: newUserData.credits + 50 }).eq("id", refData.referrer_id);
          newUserData.credits += 50;
        }
      }
      return fromRow(newUserData) as StoredUser;
    },
    update: async ({ where, data }: { where: { id: string }; data: Partial<StoredUser> }) => {
      const updateData: any = { updated_at: new Date().toISOString() };
      // Handle increment/decrement for credits
      if (typeof data.credits === "object" && data.credits !== null) {
        const { data: currentUser } = await supabase.from("users").select("credits").eq("id", where.id).single();
        const currentCredits = currentUser?.credits || 0;
        if ("increment" in data.credits) {
          updateData.credits = currentCredits + (data.credits as any).increment;
        } else if ("decrement" in data.credits) {
          updateData.credits = Math.max(0, currentCredits - (data.credits as any).decrement);
        }
      } else {
        // Direct value update (e.g., sessionToken)
        Object.assign(updateData, toRow(data));
      }
      const { data: updatedUser, error } = await supabase.from("users").update(updateData).eq("id", where.id).select().single();
      if (error) throw new Error(error.message);
      return fromRow(updatedUser) as StoredUser;
    },
    updateMany: async ({ where, data }: { where: { sessionToken?: string }; data: Partial<StoredUser> }) => {
      if (where.sessionToken) {
        const updateData: any = { ...toRow(data), updated_at: new Date().toISOString() };
        await supabase.from("users").update(updateData).eq("session_token", where.sessionToken);
      }
      return { count: 1 };
    },
  },
  generation: {
    create: async ({ data }: { data: Omit<StoredGeneration, "id" | "createdAt"> }) => {
      const row = toRow(data);
      const { data: newGen, error } = await supabase.from("generations").insert(row).select().single();
      if (error) throw new Error(error.message);
      return fromRow(newGen) as StoredGeneration;
    },
    findMany: async ({ where, orderBy, take }: { where?: { userId: string }; orderBy?: { createdAt: string }; take?: number }) => {
      let query = supabase.from("generations").select("*");
      if (where?.userId) query = query.eq("user_id", where.userId);
      if (orderBy?.createdAt === "desc") query = query.order("created_at", { ascending: false });
      else if (orderBy) query = query.order("created_at", { ascending: true });
      else query = query.order("created_at", { ascending: false });
      if (take) query = query.limit(take);
      const { data } = await query;
      return (data || []).map(fromRow) as StoredGeneration[];
    },
    findFirst: async ({ where }: { where: { id: string; userId: string } }) => {
      const { data } = await supabase.from("generations").select("*").eq("id", where.id).eq("user_id", where.userId).single();
      return data ? fromRow(data) as StoredGeneration : null;
    },
    delete: async ({ where }: { where: { id: string } }) => {
      await supabase.from("generations").delete().eq("id", where.id);
    },
    count: async ({ where }: { where?: { userId: string } }) => {
      let query = supabase.from("generations").select("*", { count: "exact", head: true });
      if (where?.userId) query = query.eq("user_id", where.userId);
      const { count } = await query;
      return count || 0;
    },
  },
  calendarEvent: {
    create: async ({ data }: { data: Omit<StoredCalendarEvent, "id" | "createdAt"> }) => {
      const row = toRow(data);
      const { data: newEvt, error } = await supabase.from("calendar_events").insert(row).select().single();
      if (error) throw new Error(error.message);
      return fromRow(newEvt) as StoredCalendarEvent;
    },
    findMany: async ({ where, orderBy }: { where?: { userId: string; date?: { gte?: string; lte?: string } }; orderBy?: { date: string } }) => {
      let query = supabase.from("calendar_events").select("*");
      if (where?.userId) query = query.eq("user_id", where.userId);
      if (where?.date?.gte) query = query.gte("date", where.date.gte);
      if (where?.date?.lte) query = query.lte("date", where.date.lte);
      if (orderBy?.date === "asc") query = query.order("date", { ascending: true });
      else query = query.order("date", { ascending: false });
      const { data } = await query;
      return (data || []).map(fromRow) as StoredCalendarEvent[];
    },
    delete: async ({ where }: { where: { id: string } }) => {
      await supabase.from("calendar_events").delete().eq("id", where.id);
    },
  },
  brandVoice: {
    create: async ({ data }: { data: Omit<StoredBrandVoice, "id" | "createdAt"> }) => {
      const row = toRow(data);
      const { data: newBV, error } = await supabase.from("brand_voices").insert(row).select().single();
      if (error) throw new Error(error.message);
      return fromRow(newBV) as StoredBrandVoice;
    },
    findMany: async ({ where }: { where?: { userId: string } }) => {
      let query = supabase.from("brand_voices").select("*");
      if (where?.userId) query = query.eq("user_id", where.userId);
      const { data } = await query;
      return (data || []).map(fromRow) as StoredBrandVoice[];
    },
    findFirst: async ({ where }: { where: { id: string; userId: string } }) => {
      const { data } = await supabase.from("brand_voices").select("*").eq("id", where.id).eq("user_id", where.userId).single();
      return data ? fromRow(data) as StoredBrandVoice : null;
    },
    delete: async ({ where }: { where: { id: string } }) => {
      await supabase.from("brand_voices").delete().eq("id", where.id);
    },
  },
  template: {
    findMany: async ({ where }: { where?: { category?: string; isPremium?: boolean } }) => {
      let query = supabase.from("templates").select("*");
      if (where?.category && where.category !== "all") query = query.eq("category", where.category);
      if (where?.isPremium !== undefined) query = query.eq("is_premium", where.isPremium);
      const { data } = await query;
      return (data || []).map(fromRow) as StoredTemplate[];
    },
    findFirst: async ({ where }: { where: { id: string } }) => {
      const { data } = await supabase.from("templates").select("*").eq("id", where.id).single();
      return data ? fromRow(data) as StoredTemplate : null;
    },
  },
  teamMember: {
    create: async ({ data }: { data: Omit<StoredTeamMember, "id" | "invitedAt" | "acceptedAt"> }) => {
      const row = toRow(data);
      const { data: newTM, error } = await supabase.from("team_members").insert(row).select().single();
      if (error) throw new Error(error.message);
      return fromRow(newTM) as StoredTeamMember;
    },
    findMany: async ({ where }: { where?: { userId: string } }) => {
      let query = supabase.from("team_members").select("*");
      if (where?.userId) query = query.eq("user_id", where.userId);
      const { data } = await query;
      return (data || []).map(fromRow) as StoredTeamMember[];
    },
    delete: async ({ where }: { where: { id: string } }) => {
      await supabase.from("team_members").delete().eq("id", where.id);
    },
  },
  referral: {
    create: async ({ data }: { data: { referrerId: string } }) => {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      const row = toRow({ referrerId: data.referrerId, code, clicks: 0, signups: 0, credits: 0 });
      const { data: newRef, error } = await supabase.from("referrals").insert(row).select().single();
      if (error) throw new Error(error.message);
      return fromRow(newRef) as StoredReferral;
    },
    findFirst: async ({ where }: { where: { referrerId: string } | { code: string } }) => {
      if ("referrerId" in where) {
        const { data } = await supabase.from("referrals").select("*").eq("referrer_id", where.referrerId).single();
        return data ? fromRow(data) as StoredReferral : null;
      }
      if ("code" in where) {
        const { data } = await supabase.from("referrals").select("*").eq("code", where.code).single();
        return data ? fromRow(data) as StoredReferral : null;
      }
      return null;
    },
    incrementClicks: async ({ where }: { where: { code: string } }) => {
      const { data: refData } = await supabase.from("referrals").select("*").eq("code", where.code).single();
      if (!refData) return null;
      const { data: updated } = await supabase.from("referrals").update({ clicks: refData.clicks + 1 }).eq("code", where.code).select().single();
      return updated ? fromRow(updated) as StoredReferral : null;
    },
  },
  stats: {
    getUserStats: async (userId: string) => {
      const { data: gens } = await supabase.from("generations").select("*").eq("user_id", userId);
      const typeCounts: Record<string, number> = {};
      const byDay: Record<string, number> = {};
      (gens || []).forEach((g: any) => {
        typeCounts[g.type] = (typeCounts[g.type] || 0) + 1;
        const day = (g.created_at || "").split("T")[0];
        if (day) byDay[day] = (byDay[day] || 0) + 1;
      });
      const { count: calCount } = await supabase.from("calendar_events").select("*", { count: "exact", head: true }).eq("user_id", userId);
      return { total: gens?.length || 0, byType: typeCounts, byDay, calendarEvents: calCount || 0 };
    },
  },
  // Legacy compat
  trackerCategory: { findMany: async () => [], count: async () => 0 },
  trackerEntry: { findMany: async () => [], count: async () => 0, aggregate: async () => ({ _sum: { value: 0 }, _avg: { value: 0 }, _max: { value: 0 }, _min: { value: 0 } }) },
};
