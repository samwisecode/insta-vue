const minLength = 6
const maxLength = 50

export const isPasswordValid = (password) => {
  return password.length > minLength && password.length < maxLength
}

export const getPasswordError = (password) => {
  if (password.length < minLength) {
    return 'Password too short'
  }
  if (password.length > maxLength) {
    return 'Password too long'
  }
  return ''
}