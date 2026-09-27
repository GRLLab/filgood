import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { createWorkshopReservation, getWorkshopReservationTotals } from "./db";
import { WORKSHOP_SESSIONS } from "../shared/const";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  workshops: router({
    availability: publicProcedure.query(async () => {
      const totals = await getWorkshopReservationTotals();
      const reservedByWorkshop = new Map(
        totals.map((item) => [item.workshopId, Number(item.reservedPlaces ?? 0)]),
      );
      return WORKSHOP_SESSIONS.map((session) => {
        const reservedPlaces = reservedByWorkshop.get(session.id) ?? 0;
        return {
          id: session.id,
          capacity: session.capacity,
          reservedPlaces,
          remainingPlaces: Math.max(0, session.capacity - reservedPlaces),
        };
      });
    }),
    reserve: publicProcedure
      .input(
        z.object({
          workshopId: z.string().min(1),
          name: z.string().trim().min(2, "Indiquez votre nom").max(120),
          email: z.string().trim().email("Indiquez une adresse e-mail valide").max(320),
          places: z.number().int().min(1).max(4),
        }),
      )
      .mutation(async ({ input }) => {
        try {
          return await createWorkshopReservation(input);
        } catch (error) {
          const code = error instanceof Error ? error.message : "UNKNOWN";
          if (code === "WORKSHOP_NOT_FOUND") {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Cet atelier n’existe plus." });
          }
          if (code === "WORKSHOP_FULL") {
            throw new TRPCError({ code: "CONFLICT", message: "Cet atelier est complet." });
          }
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "La réservation n’a pas pu être enregistrée." });
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
