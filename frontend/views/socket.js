
const socket = io();

socket.on('connect', () => {
  console.log('✅ Connected to WebSocket');
});

// Example real-time update for scheduled posts
socket.on('postStatusUpdate', (data) => {
  console.log('🆕 Post update:', data);
  // Optional: Add UI update logic
});
