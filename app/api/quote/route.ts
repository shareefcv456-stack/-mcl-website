import { handleJsonForm } from "@/lib/server/forms";
import { quoteSchema } from "@/lib/validation/forms";

export function POST(req: Request) {
  return handleJsonForm(req, "quote", quoteSchema);
}
