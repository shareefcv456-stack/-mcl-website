import { handleJsonForm } from "@/lib/server/forms";
import { newsletterSchema } from "@/lib/validation/forms";

export function POST(req: Request) {
  return handleJsonForm(req, "newsletter", newsletterSchema, 2 * 1024);
}
