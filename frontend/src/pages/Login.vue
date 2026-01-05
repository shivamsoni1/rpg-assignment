<template>
  <div class="auth-page">
    <h2>Login</h2>
    <form @submit.prevent="onLogin">
      <label>
        Email
        <input v-model="email" type="email" required />
      </label>

      <label>
        Password
        <input v-model="password" type="password" required />
      </label>

      <button :disabled="loading">{{ loading ? 'Logging in...' : 'Login' }}</button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script lang="ts" setup>
// give the component a multi-word name
defineOptions({ name: 'LoginPage' })

import { ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { LOGIN } from '../graphql/ops'
import { useRouter } from 'vue-router'
import { setToken, setUser } from '../composables/useAuth'

interface LoginUser {
  id: number
  username: string
  email?: string
}
interface LoginPayload {
  accessToken: string
  user: LoginUser
}
interface LoginResponse {
  login: LoginPayload | null
}

const email = ref('')
const password = ref('')
const error = ref<string | null>(null)

const router = useRouter()

const { mutate: loginMutate, onDone, loading, onError } = useMutation<LoginResponse>(LOGIN)

onDone((res) => {
  const data = (res.data as LoginResponse)?.login
  if (data?.accessToken) {
    setToken(data.accessToken)
    setUser(data.user || null)
    // redirect to posts page after successful login
    router.push('/posts')
  } else {
    error.value = 'Login failed'
  }
})

onError((err) => {
  error.value = err.message || 'Login error'
})

async function onLogin() {
  error.value = null
  await loginMutate({ input: { email: email.value, password: password.value } })
}
</script>

<style scoped>
.auth-page {
  max-width: 420px;
  margin: 24px auto;
}
label {
  display: block;
  margin-bottom: 12px;
}
input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
button {
  padding: 8px 12px;
}
.error {
  color: #b00020;
  margin-top: 12px;
}
</style>
