<template>
  <div class="posts-page">
    <header class="topbar">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/register">Register</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
      </nav>
    </header>

    <main>
      <section class="create">
        <form @submit.prevent="onCreate">
          <input v-model="content" placeholder="Write something..." />
          <button type="submit" :disabled="creating">{{ creating ? 'Posting...' : 'Post' }}</button>
        </form>
      </section>

      <section class="list">
        <div v-if="loading">Loading posts…</div>
        <div v-if="loadError" class="error">{{ loadError.message }}</div>

        <ul>
          <li v-for="p in posts" :key="p.id">
            <strong>{{ p.author.username }}</strong
            >: {{ p.content }}
            <div class="meta">{{ new Date(p.createdAt).toLocaleString() }}</div>
          </li>
        </ul>
      </section>
    </main>
  </div>
</template>

<script lang="ts" setup>
defineOptions({ name: 'PostsPage' })

import { ref, watchEffect } from 'vue'
import { useQuery, useMutation, useSubscription } from '@vue/apollo-composable'
import { GET_POSTS, CREATE_POST, POST_ADDED } from '../graphql/ops'
import { useRouter, RouterLink } from 'vue-router'
import { isLoggedIn } from '../composables/useAuth'

interface User {
  id: number
  username: string
}
interface Post {
  id: number
  content: string
  createdAt: string
  author: User
}
interface GetPostsRes {
  posts: Post[]
}
interface CreatePostRes {
  createPost: Post
}
interface PostAddedRes {
  postAdded: Post
}

const router = useRouter()
const content = ref('')
const posts = ref<Post[]>([])
const creating = ref(false)

// load initial posts
const { result, loading, error: loadError } = useQuery<GetPostsRes>(GET_POSTS)

watchEffect(() => {
  if (result.value?.posts) {
    posts.value = [...result.value.posts].sort(
      (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
    )
  }
})

// --- Subscription: use onResult (not onNext) or watch the returned result ref ---
const { result: subResult, onError: subOnError } = useSubscription<PostAddedRes>(POST_ADDED)

// debug: log that subscription hook registered
console.log('Subscription hook registered (frontend)')

// react to subscription results
watchEffect(() => {
  const r = subResult.value
  if (!r) return
  // subResult value shape from useSubscription is the GraphQL result
  console.log('SUB onResult (frontend):', r)
  const newPost = (r as any)?.postAdded ?? (r as any)?.data?.postAdded
  if (newPost) {
    if (!posts.value.find((p) => p.id === newPost.id)) posts.value.unshift(newPost)
  }
})

// handle subscription errors
subOnError((err: any) => {
  console.error('Subscription error (frontend):', err)
})

// create post mutation
const {
  mutate: createMut,
  onDone,
  loading: mutLoading,
  onError,
} = useMutation<CreatePostRes>(CREATE_POST)

// reflect creating state
watchEffect(() => {
  creating.value = !!mutLoading.value
})

// update list after mutation
onDone((payload) => {
  const created = payload.data?.createPost
  if (created) {
    posts.value.unshift(created)
    content.value = ''
  }
})

// handle errors (optional)
onError((err) => {
  alert(err.message || 'Create post failed')
})

async function onCreate() {
  if (!isLoggedIn()) {
    router.push('/login')
    return
  }
  if (!content.value.trim()) return
  await createMut({ content: content.value })
}
</script>

<style scoped>
.posts-page {
  max-width: 800px;
  margin: 24px auto;
  padding: 0 16px;
}
.topbar nav {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 16px;
}
.create form {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
.create input {
  flex: 1;
  padding: 8px;
}
button {
  padding: 8px 12px;
}
.list ul {
  list-style: none;
  padding: 0;
}
.list li {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}
.meta {
  font-size: 12px;
  color: #666;
}
.error {
  color: #b00020;
}
</style>
