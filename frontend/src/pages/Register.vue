<template>
  <div class="auth-page">
    <h2>Register</h2>
    <form @submit.prevent="onRegister">
      <label>
        Username
        <input v-model="username" required />
      </label>

      <label>
        Email
        <input v-model="email" type="email" required />
      </label>

      <label>
        Password
        <input v-model="password" type="password" required />
      </label>

      <button :disabled="loading">{{ loading ? 'Registering...' : 'Register' }}</button>
    </form>

    <p v-if="success" class="success">Registration successful. You can now login.</p>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script lang="ts" setup>
// give the component a multi-word name to satisfy ESLint rule
// (requires Vue SFC macros support)
defineOptions({ name: 'RegisterPage' })

import { ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { REGISTER } from '../graphql/ops'
import { useRouter } from 'vue-router'

const username = ref('')
const email = ref('')
const password = ref('')
const error = ref<string | null>(null)
const success = ref(false)

const router = useRouter()

const { mutate: registerMutate, onDone, loading, onError } = useMutation(REGISTER)

onDone(() => {
  success.value = true
  // optional: navigate to login automatically
  setTimeout(() => router.push('/login'), 800)
})

onError((err) => {
  error.value = err.message || 'Registration error'
})

async function onRegister() {
  error.value = null
  success.value = false
  await registerMutate({
    input: { username: username.value, email: email.value, password: password.value },
  })
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
.success {
  color: #006400;
  margin-top: 12px;
}
.error {
  color: #b00020;
  margin-top: 12px;
}
</style>
