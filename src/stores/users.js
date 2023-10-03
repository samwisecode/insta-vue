import { ref } from "vue";
import { defineStore } from "pinia";
import { supabase } from "../supabase";
import { fetchUserByEmail } from "../requests/users/fetchUserByEmail";

export const useUsersStore = defineStore("users", () => {
  const user = ref(null);
  const errorMessage = ref("");
  const loading = ref(false);
  const loadingUser = ref(false);

  const handleLogin = async (credentials) => {
    const { email, password } = credentials;
    loading.value = true;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log(email, password)

    if (error) {
      loading.value = false;
      return (errorMessage.value = error.message);
    }

    user.value = await fetchUserByEmail(email);
    console.log(user.value)

    loading.value = false;
    errorMessage.value = "";
  };

  const handleSignup = async (credentials) => {
    const { email, password, username } = credentials;

    loading.value = false;
    errorMessage.value = "";

    if (password.length < 6) {
      errorMessage.value = "Password must be at least 6 characters";
      return;
    }

    if (username.length < 4) {
      errorMessage.value = "Username must be at least 4 characters";
      return;
    }

    if (!validateEmail(email)) {
      errorMessage.value = "Invalid email address";
      return;
    }

    loading.value = true;

    // verify email does not exist already
    const { data: userWithUsername } = await supabase
      .from("users")
      .select("username")
      .eq("username", username)
      .single();

    if (userWithUsername) {
      loading.value = false;
      return (errorMessage.value = "Username already registered");
    }

    errorMessage.value = "";

    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      loading.value = false;
      errorMessage.value = error.message;
      return;
    }

    await supabase.from("users").insert({ email, username });
    user.value = fetchUserByEmail(email);

    loading.value = false;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    return (user.value = null);
  };

  const getUser = async () => {
    loadingUser.value = true;
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      loadingUser.value = false;
      return (user.value = null);
    }

    const { data: userWithEmail } = await supabase
      .from("users")
      .select()
      .eq("email", data.user.email)
      .single();

    user.value = {
      username: userWithEmail.username,
      email: userWithEmail.email,
      id: userWithEmail.id,
    };

    loadingUser.value = false;
  };

  const clearErrorMessage = () => {
    return (errorMessage.value = "");
  };

  return {
    user,
    loading,
    loadingUser,
    errorMessage,
    handleLogin,
    handleSignup,
    handleLogout,
    getUser,
    clearErrorMessage,
  };
});
