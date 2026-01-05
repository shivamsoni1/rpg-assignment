import { ref } from 'vue'

const currentUser = ref<{ id: number; username: string; email?: string } | null>(null)

export function setToken(token: string | null) {
  if (token) {
    localStorage.setItem('token', token)
  } else {
    localStorage.removeItem('token')
  }
}

export function getToken(): string | null {
  return localStorage.getItem('token')
}

export function isLoggedIn(): boolean {
  return !!getToken()
}

export function setUser(user: { id: number; username: string; email?: string } | null) {
  currentUser.value = user
}

export function useCurrentUser() {
  return currentUser
}

export function logout() {
  setToken(null)
  setUser(null)
}
