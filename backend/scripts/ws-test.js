const WebSocket = require('ws');
const { createClient } = require('graphql-ws');

const client = createClient({
  url: 'ws://localhost:3200/graphql',
  webSocketImpl: WebSocket, // <- provide ws implementation for Node
  connectionParams: {
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImVtYWlsIjoic2hpdmFtQGdtYWlsLmNvbSIsImlhdCI6MTc2NzU2NTY5OSwiZXhwIjoxNzY3NTY5Mjk5fQ.vTVzjozcYSuI8JbqGIWriYYrun82n2gUyrss4j1ceME',
  },
});

const onNext = (data) => {
  console.log('SUB NEXT', data);
};

const dispose = client.subscribe(
  {
    query:
      'subscription { postAdded { id content createdAt author { id username } } }',
  },
  {
    next: onNext,
    error: (err) => console.error('SUB ERR', err),
    complete: () => console.log('SUB complete'),
  },
);

// keep alive for testing
setTimeout(() => {
  dispose(); // stop after 2 minutes
  console.log('disposed');
  process.exit(0);
}, 120000);
