import { supabase } from "../../supabase";
import { slugify } from "../../helpers/strings/slugify";

export const createUser = async ({ email, username }) => {
  const sluggedUsername = slugify(username)
  createdUser = await supabase
    .from("users")
    .insert({ email, sluggedUsername });
  console.log(createdUser)
  return createdUser
}