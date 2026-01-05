import { createClient } from 'graphql-ws';
import ws from 'ws';

const TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiYUBhLmNvbSIsImlhdCI6MTc2NzU1ODQ2NywiZXhwIjoxNzY3NTYyMDY3fQ.DQ6PZbTt4hq7Vp1TwWE8nDwMCIEyhjvQAZMrmKxZrMs'; // replace with your JWT

const client = createClient({
  url: 'ws://localhost:3200/graphql',
  webSocketImpl: ws,
  connectionParams: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

const query = `subscription {
  postAdded {
    id
    content
    createdAt
    author { id username email }
  }
}`;

const dispose = client.subscribe(
  { query },
  {
    next: (data) => {
      console.log('subscription data:', JSON.stringify(data, null, 2));
    },
    error: (err) => {
      console.error('subscription error:', err);
    },
    complete: () => {
      console.log('subscription complete');
    },
  },
);

// keep process alive (Ctrl+C to stop)
process.on('SIGINT', () => {
  dispose();
  process.exit();
});
