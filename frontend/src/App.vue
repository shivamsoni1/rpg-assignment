<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="site-header">
    <div class="container">
      <div class="brand">
        <img alt="logo" src="@/assets/logo.svg" class="logo" />
        <h1 class="title">My Blog</h1>
      </div>

      <nav class="nav">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/register">Register</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
      </nav>
    </div>
  </header>

  <main class="hero container">
    <div class="hero-content">
      <h2>Write. Share. Discuss.</h2>
      <p>Publish short posts, follow authors and get real-time updates.</p>
      <RouterLink class="cta" to="/register">Get started — Register</RouterLink>
    </div>
    <div class="hero-illustration">
      <img src="@/assets/hero.svg" alt="blog illustration" />
    </div>
  </main>

  <section class="content container">
    <RouterView />
  </section>
</template>

<style scoped>
.container {
  max-width: 1024px;
  margin: 0 auto;
  padding: 0 16px;
}
.site-header {
  border-bottom: 1px solid #eee;
  padding: 16px 0;
}
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}
.logo {
  width: 56px;
  height: 56px;
}
.title {
  font-size: 1.25rem;
  margin: 0;
}
.nav {
  margin-top: 12px;
  display: flex;
  gap: 12px;
}
.hero {
  display: flex;
  gap: 32px;
  align-items: center;
  padding: 48px 0;
}
.hero-content h2 {
  margin: 0 0 8px;
  font-size: 2rem;
}
.hero-content p {
  margin: 0 0 16px;
  color: #555;
}
.cta {
  display: inline-block;
  background: #2b6cb0;
  color: #fff;
  padding: 10px 16px;
  border-radius: 6px;
  text-decoration: none;
}
.content {
  padding-bottom: 48px;
}
@media (max-width: 700px) {
  .hero {
    flex-direction: column;
    text-align: center;
  }
  .hero-illustration {
    display: none;
  }
}
</style>
