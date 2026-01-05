import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client/core'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { setContext } from '@apollo/client/link/context'
import { getMainDefinition } from '@apollo/client/utilities'

const httpUri = import.meta.env.VITE_GRAPHQL_HTTP ?? 'http://localhost:3200/graphql'
const wsUri = import.meta.env.VITE_GRAPHQL_WS ?? 'ws://localhost:3200/graphql'

const httpLink = new HttpLink({ uri: httpUri })

// graphql-ws client for browser
const wsClient = createClient({
  url: wsUri,
  connectionParams: () => {
    const token = localStorage.getItem('token')
    // debug: expose token so you can inspect in console if needed
    ;(window as any).__GQL_WS_TOKEN__ = token
    return token ? { Authorization: `Bearer ${token}` } : {}
  },
})

// ws link for Apollo
const wsLink = new GraphQLWsLink(wsClient)

// route subscriptions -> ws, others -> http
const splitLink = split(
  ({ query }) => {
    const def = getMainDefinition(query)
    return def.kind === 'OperationDefinition' && def.operation === 'subscription'
  },
  wsLink,
  httpLink,
)

// attach Authorization header for HTTP
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  }
})

export const apolloClient = new ApolloClient({
  link: authLink.concat(splitLink),
  cache: new InMemoryCache(),
})

// debug helper
// in browser console you can inspect: window.__GQL_WS_TOKEN__ and apolloClient

console.info('Apollo client initialized', { httpUri, wsUri })
