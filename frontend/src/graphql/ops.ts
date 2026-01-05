import { gql } from 'graphql-tag'

export const REGISTER = gql`
  mutation Register($input: CreateUserInput!) {
    register(input: $input) {
      id
      username
      email
      createdAt
    }
  }
`

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      user {
        id
        username
        email
      }
    }
  }
`

/* optional ops for posts (used later) */
export const GET_POSTS = gql`
  query GetPosts {
    posts {
      id
      content
      createdAt
      author {
        id
        username
      }
    }
  }
`

export const CREATE_POST = gql`
  mutation CreatePost($content: String!) {
    createPost(content: $content) {
      id
      content
      createdAt
      author {
        id
        username
      }
    }
  }
`

export const POST_ADDED = gql`
  subscription {
    postAdded {
      id
      content
      createdAt
      author {
        id
        username
      }
    }
  }
`
