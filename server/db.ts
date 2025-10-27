import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, transactions, investments, debts, goals, userParams, InsertTransaction, InsertInvestment, InsertDebt, InsertGoal, InsertUserParams } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Funcoes para Transacoes
export async function getTransactionsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(transactions).where(eq(transactions.userId, userId)).orderBy(transactions.date);
}

export async function createTransaction(data: InsertTransaction) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(transactions).values(data);
  return result;
}

export async function updateTransaction(id: number, data: Partial<InsertTransaction>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(transactions).set(data).where(eq(transactions.id, id));
}

export async function deleteTransaction(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(transactions).where(eq(transactions.id, id));
}

// Funcoes para Investimentos
export async function getInvestmentsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(investments).where(eq(investments.userId, userId));
}

export async function createInvestment(data: InsertInvestment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(investments).values(data);
}

export async function updateInvestment(id: number, data: Partial<InsertInvestment>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(investments).set(data).where(eq(investments.id, id));
}

export async function deleteInvestment(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(investments).where(eq(investments.id, id));
}

// Funcoes para Dividas
export async function getDebtsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(debts).where(eq(debts.userId, userId));
}

export async function createDebt(data: InsertDebt) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(debts).values(data);
}

export async function updateDebt(id: number, data: Partial<InsertDebt>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(debts).set(data).where(eq(debts.id, id));
}

export async function deleteDebt(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(debts).where(eq(debts.id, id));
}

// Funcoes para Metas
export async function getGoalsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(goals).where(eq(goals.userId, userId));
}

export async function createGoal(data: InsertGoal) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(goals).values(data);
}

export async function updateGoal(id: number, data: Partial<InsertGoal>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(goals).set(data).where(eq(goals.id, id));
}

export async function deleteGoal(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(goals).where(eq(goals.id, id));
}

// Funcoes para Parametros do Usuario
export async function getUserParams(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(userParams).where(eq(userParams.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createOrUpdateUserParams(data: InsertUserParams) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await getUserParams(data.userId);
  if (existing) {
    return db.update(userParams).set(data).where(eq(userParams.userId, data.userId));
  } else {
    return db.insert(userParams).values(data);
  }
}

