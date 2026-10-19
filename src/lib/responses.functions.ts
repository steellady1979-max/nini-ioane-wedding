import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const name = z.string().trim().min(1).max(100);
const schema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("rsvp"), firstName: name, lastName: name, attending: z.enum(["yes", "no"]) }),
  z.object({ type: z.literal("wish"), firstName: name, lastName: name, message: z.string().trim().min(1).max(1000) }),
]);

export const submitResponse = createServerFn({ method: "POST" })
  .inputValidator(schema)
  .handler(async ({ data }) => {
    const url = process.env.GOOGLE_APPS_SCRIPT_URL;
    const secret = process.env.RSVP_SECRET;
    if (!url || !secret || !/^https:\/\/script.google.com\/macros\/s\/[^/]+\/exec$/.test(url)) {
      throw new Error("პასუხების მიღება ჯერ არ არის გამართული.");
    }
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, secret }),
        signal: AbortSignal.timeout(20000),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) throw new Error("Save failed");
      return { ok: true };
    } catch {
      throw new Error("ვერ გაიგზავნა. გთხოვთ, სცადოთ ხელახლა.");
    }
  });
