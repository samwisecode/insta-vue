import {supabase} from '../../supabase'

export const fetchUserByEmail = async (email) => {
  const { data: authUser } = await supabase
    .from("users")
    .select()
    .eq("email", email)
    .single();

  return authUser
}