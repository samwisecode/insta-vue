import { ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '../supabase'

export const useUsersStore = defineStore('users', () => {

  const user = ref(null) // declare initial state
  const errorMessage = ref('')
  const loading = ref(false)
  const loadingUser = ref(false)

  const validateEmail = email => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleLogin = async credentials => {
    const { email, password } = credentials

    loading.value = false
    errorMessage.value = ''
    
    if (!validateEmail(email)) {
      errorMessage.value = 'Invalid email address'
      return
    }

    if (!password.length) {
      errorMessage.value = 'Password is required'
      return
    }

    loading.value = true

    const { error } = await supabase.auth.signInWithPassword({
      email, 
      password
    })

    if (error) {
      loading.value = false
      return errorMessage.value = error.message
    }

    const {data: existingUser} = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single()

    user.value = {
      email: existingUser.email,
      username: existingUser.username,
      id: existingUser.id
    }

    loading.value = false
    errorMessage.value = ''

  }

  const handleSignup = async credentials => {
    const { email, password, username } = credentials

    loading.value = false
    errorMessage.value = ''

    if (password.length < 6) {
      errorMessage.value = 'Password must be at least 6 characters'
      return
    }

    if (username.length < 4) {
      errorMessage.value = 'Username must be at least 4 characters'
      return
    }

    if (!validateEmail(email)) {
      errorMessage.value = 'Invalid email address'
      return
    }

    loading.value = true

    // verify email does not exist already
    const { data: userWithUsername } = await supabase
      .from('users')
      .select('username')
      .eq('username', username)
      .single()

    if (userWithUsername) {
      loading.value = false
      return errorMessage.value = 'Username already registered'
    }

    errorMessage.value = ''

    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      loading.value = false
      errorMessage.value = error.message
      return
    }

    await supabase.from('users').insert({ email, username })

    loading.value = false

    const { data: newUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single()

    user.value = {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username
    }
  }
  
  const handleLogout = async () => {
    await supabase.auth.signOut()
    return user.value = null
  }
  
  const getUser = async () => {
    loadingUser.value = true
    const { data } = await supabase.auth.getUser()

    if (!data.user) {
      loadingUser.value = false
      return user.value = null
    }

    const { data: userWithEmail } = await supabase
      .from('users')
      .select()
      .eq('email', data.user.email)
      .single()
    
      user.value = {
        username: userWithEmail.username,
        email: userWithEmail.email,
        id: userWithEmail.id
      }

    loadingUser.value = false
  }

  const clearErrorMessage = () => {
    return errorMessage.value = ''
  }

  // export the state and the functions that you want to use in other components
  return { user, loading, loadingUser, errorMessage, handleLogin, handleSignup, handleLogout, getUser, clearErrorMessage  }

})
