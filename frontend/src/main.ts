import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { apolloClient } from './apollo'
import router from './router'

const app = createApp(App)

// provide Apollo client for composition API
app.provide(DefaultApolloClient, apolloClient)

app.use(router)

app.mount('#app')
