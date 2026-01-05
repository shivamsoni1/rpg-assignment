import { createRouter, createWebHistory } from 'vue-router'
import { getToken } from '../composables/useAuth'

const routes = [
  {
    path: '/',
    redirect: '/register', // landing page
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/Login.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../pages/Register.vue'),
  },
  {
    path: '/posts',
    name: 'Posts',
    component: () => import('../pages/Posts.vue'),
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// simple navigation guard: redirect to /login if route requires auth and no token
router.beforeEach((to) => {
  if ((to.meta as Record<string, unknown>)?.requiresAuth && !getToken()) {
    return { path: '/login' }
  }
})

export default router
