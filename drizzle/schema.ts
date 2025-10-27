import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Tabela de Parâmetros do Usuário (Configurações Financeiras)
export const userParams = mysqlTable("user_params", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  caixa: int("caixa").default(0).notNull(), // Saldo em caixa (centavos)
  nomeUsuario: varchar("nomeUsuario", { length: 255 }),
  mesesReserva: int("mesesReserva").default(3).notNull(), // Meses de reserva de emergência
  metaPatrimonio: int("metaPatrimonio").default(0).notNull(), // Meta de patrimônio (centavos)
  taxaRetorno: int("taxaRetorno").default(0).notNull(), // Taxa de retorno esperada (em basis points, ex: 1000 = 10%)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserParams = typeof userParams.$inferSelect;
export type InsertUserParams = typeof userParams.$inferInsert;

// Tabela de Transações
export const transactions = mysqlTable("transactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  amount: int("amount").notNull(), // Valor em centavos
  type: mysqlEnum("type", ["income", "expense"]).notNull(),
  category: varchar("category", { length: 100 }).notNull(), // ex: "Alimentação", "Transporte", "Salário"
  date: timestamp("date").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

// Tabela de Investimentos
export const investments = mysqlTable("investments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  amount: int("amount").notNull(), // Valor investido (centavos)
  type: varchar("type", { length: 100 }).notNull(), // ex: "Ações", "Renda Fixa", "Criptomoedas"
  returnRate: int("returnRate").default(0).notNull(), // Taxa de retorno (em basis points)
  currentValue: int("currentValue").notNull(), // Valor atual (centavos)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Investment = typeof investments.$inferSelect;
export type InsertInvestment = typeof investments.$inferInsert;

// Tabela de Dívidas
export const debts = mysqlTable("debts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  amount: int("amount").notNull(), // Valor da dívida (centavos)
  interestRate: int("interestRate").default(0).notNull(), // Taxa de juros (em basis points)
  minPayment: int("minPayment").default(0).notNull(), // Pagamento mínimo (centavos)
  dueDate: timestamp("dueDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Debt = typeof debts.$inferSelect;
export type InsertDebt = typeof debts.$inferInsert;

// Tabela de Metas Financeiras
export const goals = mysqlTable("goals", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  targetAmount: int("targetAmount").notNull(), // Valor alvo (centavos)
  currentAmount: int("currentAmount").default(0).notNull(), // Valor atual (centavos)
  deadline: timestamp("deadline"),
  category: varchar("category", { length: 100 }), // ex: "Viagem", "Casa", "Carro"
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Goal = typeof goals.$inferSelect;
export type InsertGoal = typeof goals.$inferInsert;