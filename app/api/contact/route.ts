import { handleJsonForm } from "@/lib/server/forms";
import { contactSchema } from "@/lib/validation/forms";

export function POST(req: Request) {
  return handleJsonForm(req, "contact", contactSchema);
}
