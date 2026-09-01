import { makeHandler } from "@/lib/api";
export const POST = makeHandler("newsletter", ["email"], ["email"]);
