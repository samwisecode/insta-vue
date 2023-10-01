import { slugify } from "../../helpers/strings/slugify";
import { supabase } from "../../supabase";

export const fetchUserByUsername = async (username) => {
  const sluggedUsername = slugify(username)
  const { data } = await supabase
    .from("users")
    .select("username")
    .eq("username", sluggedUsername)
    .single();
  console.log(['fetched user', data])
  return data
}