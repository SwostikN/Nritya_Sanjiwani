import { makeHandler } from "@/lib/api";
export const POST = makeHandler(
  "partner",
  ["name", "org", "email", "phone", "interest", "message"],
  ["name", "email"]
);
