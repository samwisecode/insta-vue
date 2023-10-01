import { ref } from "vue";
import { defineStore } from "pinia";
import { supabase } from "../supabase";
import { fetchUserByEmail } from "../requests/users/fetchUserByEmail";
import { createUser } from "../requests/users/createUser";
import { fetchUserByUsername } from "../requests/users/fetchUserByUsername";
import { isPasswordValid } from "../validation/inputs/password";

export const useUsersStore = defineStore("users", () => {
  const user = ref(null); // declare initial state
  const errorMessage = ref("");
  const loading = ref(false);
  const loadingUser = ref(false);

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleLogin = async (credentials) => {
    const { email, password } = credentials;

    loading.value = false;
    errorMessage.value = "";

    if (!validateEmail(email)) {
      errorMessage.value = "Invalid email address";
      return;
    }

    if (!password.length) {
      errorMessage.value = "Password is required";
      return;
    }

    loading.value = true;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      loading.value = false;
      return (errorMessage.value = error.message);
    }

    user.value = await fetchUserByEmail(email);

    loading.value = false;
    errorMessage.value = "";
  };

  const handleSignup = async (credentials) => {
    const { email, password, username } = credentials;
    loading.value = false;

    if (!isPasswordValid) {
      return
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

    const existingUser = await fetchUserByUsername(username);
    if (existingUser != null || existingUser != undefined) {
      loading.value = false;
      return (errorMessage.value = "Username already registered");
    }

    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      loading.value = false;
      errorMessage.value = error.message;
      return;
    }

    const createdUser = await createUser({ email, username });
    console.log(createdUser);
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
