// In-memory store for Vercel serverless (survives while function is warm)
// For production, replace with Turso/PlanetScale/Supabase

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
  createdAt: string;
}

// In-memory stores
const users = new Map<string, StoredUser>();
const generations = new Map<string, StoredGeneration>();
const emailIndex = new Map<string, string>(); // email -> userId
const sessionIndex = new Map<string, string>(); // token -> userId

function genId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function now(): string {
  return new Date().toISOString();
}

// User operations
export const db = {
  user: {
    findUnique: async ({ where }: { where: { email?: string; sessionToken?: string; id?: string } }) => {
      if (where.email) {
        const userId = emailIndex.get(where.email);
        if (!userId) return null;
        return users.get(userId) || null;
      }
      if (where.sessionToken) {
        const userId = sessionIndex.get(where.sessionToken);
        if (!userId) return null;
        return users.get(userId) || null;
      }
      if (where.id) {
        return users.get(where.id) || null;
      }
      return null;
    },
    create: async ({ data }: { data: { email: string; password: string; name?: string; sessionToken?: string; credits?: number; plan?: string } }) => {
      const id = genId();
      const user: StoredUser = {
        id,
        email: data.email,
        password: data.password,
        name: data.name || data.email.split("@")[0],
        credits: data.credits ?? 10,
        plan: data.plan || "free",
        sessionToken: data.sessionToken || null,
        createdAt: now(),
        updatedAt: now(),
      };
      users.set(id, user);
      emailIndex.set(data.email, id);
      if (data.sessionToken) sessionIndex.set(data.sessionToken, id);
      return user;
    },
    update: async ({ where, data }: { where: { id: string }; data: Partial<StoredUser> }) => {
      const user = users.get(where.id);
      if (!user) throw new Error("User not found");
      const updated = { ...user, ...data, updatedAt: now() };
      users.set(where.id, updated);
      if (data.sessionToken !== undefined) {
        // Update session index
        if (user.sessionToken) sessionIndex.delete(user.sessionToken);
        if (data.sessionToken) sessionIndex.set(data.sessionToken, where.id);
      }
      return updated;
    },
    updateMany: async ({ where, data }: { where: { sessionToken?: string }; data: Partial<StoredUser> }) => {
      if (where.sessionToken) {
        const userId = sessionIndex.get(where.sessionToken);
        if (userId) {
          const user = users.get(userId);
          if (user) {
            sessionIndex.delete(where.sessionToken);
            const updated = { ...user, ...data, updatedAt: now() };
            users.set(userId, updated);
          }
        }
      }
      return { count: 1 };
    },
  },
  generation: {
    create: async ({ data }: { data: { userId: string; type: string; topic: string; tone: string; length: string; output: string } }) => {
      const id = genId();
      const gen: StoredGeneration = {
        id,
        userId: data.userId,
        type: data.type,
        topic: data.topic,
        tone: data.tone,
        length: data.length,
        output: data.output,
        createdAt: now(),
      };
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
      if (gen && gen.userId === where.userId) return gen;
      return null;
    },
    delete: async ({ where }: { where: { id: string } }) => {
      generations.delete(where.id);
    },
  },
  // Tracker categories (for stats API)
  trackerCategory: {
    findMany: async () => [],
    count: async () => 0,
  },
  trackerEntry: {
    findMany: async () => [],
    count: async () => 0,
    aggregate: async () => ({ _sum: { value: 0 }, _avg: { value: 0 }, _max: { value: 0 }, _min: { value: 0 } }),
  },
};
