export const logout = () => {
  localStorage.clear()
}

export const isLogin = () => {
  const token = localStorage.getItem('token')
  return token !== null && token !== ''
}