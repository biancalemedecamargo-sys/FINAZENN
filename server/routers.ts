import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Procedimentos para Transacoes
  transactions: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getTransactionsByUserId(ctx.user.id);
    }),
    create: protectedProcedure
      .input(z.object({
        description: z.string(),
        amount: z.number().int(),
        type: z.enum(["income", "expense"]),
        category: z.string(),
        date: z.date(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createTransaction({
          userId: ctx.user.id,
          ...input,
        });
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        description: z.string().optional(),
        amount: z.number().int().optional(),
        type: z.enum(["income", "expense"]).optional(),
        category: z.string().optional(),
        date: z.date().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateTransaction(id, data);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return db.deleteTransaction(input.id);
      }),
  }),

  // Procedimentos para Investimentos
  investments: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getInvestmentsByUserId(ctx.user.id);
    }),
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        amount: z.number().int(),
        type: z.string(),
        returnRate: z.number().int().default(0),
        currentValue: z.number().int(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createInvestment({
          userId: ctx.user.id,
          ...input,
        });
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        amount: z.number().int().optional(),
        type: z.string().optional(),
        returnRate: z.number().int().optional(),
        currentValue: z.number().int().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateInvestment(id, data);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return db.deleteInvestment(input.id);
      }),
  }),

  // Procedimentos para Dividas
  debts: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getDebtsByUserId(ctx.user.id);
    }),
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        amount: z.number().int(),
        interestRate: z.number().int().default(0),
        minPayment: z.number().int().default(0),
        dueDate: z.date().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createDebt({
          userId: ctx.user.id,
          ...input,
        });
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        amount: z.number().int().optional(),
        interestRate: z.number().int().optional(),
        minPayment: z.number().int().optional(),
        dueDate: z.date().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateDebt(id, data);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return db.deleteDebt(input.id);
      }),
  }),

  // Procedimentos para Metas
  goals: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getGoalsByUserId(ctx.user.id);
    }),
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        targetAmount: z.number().int(),
        currentAmount: z.number().int().default(0),
        deadline: z.date().optional(),
        category: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createGoal({
          userId: ctx.user.id,
          ...input,
        });
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        targetAmount: z.number().int().optional(),
        currentAmount: z.number().int().optional(),
        deadline: z.date().optional(),
        category: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateGoal(id, data);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return db.deleteGoal(input.id);
      }),
  }),

  // Procedimentos para Parametros do Usuario
  userParams: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserParams(ctx.user.id);
    }),
    update: protectedProcedure
      .input(z.object({
        caixa: z.number().int().optional(),
        nomeUsuario: z.string().optional(),
        mesesReserva: z.number().int().optional(),
        metaPatrimonio: z.number().int().optional(),
        taxaRetorno: z.number().int().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createOrUpdateUserParams({
          userId: ctx.user.id,
          ...input,
        });
      }),
  }),

  // Dashboard Summary (Resumo para o Dashboard)
  dashboard: router({
    summary: protectedProcedure.query(async ({ ctx }) => {
      const userId = ctx.user.id;
      const transactionsList = await db.getTransactionsByUserId(userId);
      const investmentsList = await db.getInvestmentsByUserId(userId);
      const debtsList = await db.getDebtsByUserId(userId);
      const goalsList = await db.getGoalsByUserId(userId);
      const params = await db.getUserParams(userId);

      // Calcular totais
      const totalIncome = transactionsList
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const totalExpense = transactionsList
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const totalDebt = debtsList.reduce((sum, d) => sum + d.amount, 0);
      const totalInvested = investmentsList.reduce((sum, i) => sum + i.amount, 0);
      const totalInvestmentValue = investmentsList.reduce((sum, i) => sum + i.currentValue, 0);
      const totalGoalAmount = goalsList.reduce((sum, g) => sum + g.targetAmount, 0);
      const totalGoalProgress = goalsList.reduce((sum, g) => sum + g.currentAmount, 0);

      const balance = totalIncome - totalExpense;
      const patrimonio = (params?.caixa || 0) + totalInvestmentValue;

      return {
        totalIncome,
        totalExpense,
        balance,
        totalDebt,
        totalInvested,
        totalInvestmentValue,
        patrimonio,
        totalGoalAmount,
        totalGoalProgress,
        recentTransactions: transactionsList.slice(-5),
        params: params || {
          caixa: 0,
          nomeUsuario: '',
          mesesReserva: 3,
          metaPatrimonio: 0,
          taxaRetorno: 0,
        },
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;

