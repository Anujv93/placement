"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(formData) {
  const supabase = createClient();
  const data = {
    email: formData.email,
    password: formData.password,
  };
  const { error } = await supabase.auth.signInWithPassword(data);
  if (error) {
    console.log(error.message);
    return error.message;
  }
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(formData) {
  const supabase = createClient();
  const data = {
    email: formData.email,
    password: formData.password,
  };

  const { error } = await supabase.auth.signUp(data);
  if (error) {
    return error.message;
  }
  revalidatePath("/", "layout");
  redirect("/dashboard");
}
