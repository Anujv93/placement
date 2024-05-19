export const login = async (formData) => {
  const supabase = createClient();
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const { error } = await supabase.auth.signIn(data);

  if (error) {
    console.error(error.message);
    setErrorMessage(error.message);
  } else {
    redirect("/dashboard"); // Redirect to dashboard on successful login
  }
};
