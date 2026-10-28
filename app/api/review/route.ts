import { handleJsonForm } from "@/lib/server/forms";
import { reviewSchema } from "@/lib/validation/forms";

export function POST(req: Request) {
  return handleJsonForm(req, "review", reviewSchema);
}
