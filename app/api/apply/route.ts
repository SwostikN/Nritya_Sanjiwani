import { makeHandler } from "@/lib/api";
export const POST = makeHandler(
  "apply",
  ["name", "age", "contact", "community", "experience", "access", "why", "consentData", "consentMedia"],
  ["name", "age", "contact", "consentData"]
);
