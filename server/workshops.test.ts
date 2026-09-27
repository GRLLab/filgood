import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("workshops", () => {
  it("returns the three public workshop sessions with availability", async () => {
    const caller = appRouter.createCaller(createContext());
    const result = await caller.workshops.availability();

    expect(result).toHaveLength(3);
    expect(result.map((session) => session.id)).toEqual(["decouvrir", "fabriquer", "transmettre"]);
    expect(result.every((session) => session.remainingPlaces >= 0)).toBe(true);
  });

  it("rejects invalid reservation details before touching the database", async () => {
    const caller = appRouter.createCaller(createContext());

    await expect(
      caller.workshops.reserve({
        workshopId: "decouvrir",
        name: "A",
        email: "pas-un-email",
        places: 0,
      }),
    ).rejects.toThrow();
  });
});
