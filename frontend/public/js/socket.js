const socket = io();

socket.on('connect', () => {
  console.log('Socket connected ✅');
});

socket.on('new-post-status', (data) => {
  console.log('Update:', data);
  // Optionally update the UI
});
// TODO: Connect to socket.io and listen for updates