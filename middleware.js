import { updateSession } from "@/utils/supabase/middleware";
// The middleware is used to refresh the user's session before loading Server Component routes
export async function middleware(request) {
  return await updateSession(request);
}
