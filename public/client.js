document.addEventListener('DOMContentLoaded', () => {
  // Initialize xterm.js terminal
  const terminal = new Terminal({
    cursorBlink: true,
    theme: {
      background: '#1e1e1e',
      foreground: '#f0f0f0'
    }
  });
  
  // Create fit addon to make terminal responsive
  const fitAddon = new FitAddon.FitAddon();
  terminal.loadAddon(fitAddon);
  
  // Open terminal in the container
  terminal.open(document.getElementById('terminal'));
  fitAddon.fit();
  
  // Connect to server with Socket.IO
  const socket = io();
  const statusElement = document.getElementById('status');
  
  // Handle connection status
  socket.on('connection', (data) => {
    if (data.status === 'connected') {
      statusElement.textContent = 'Connected to SSH server';
      statusElement.className = 'connected';
    } else if (data.status === 'closed') {
      statusElement.textContent = 'Connection closed';
      statusElement.className = 'error';
    }
  });
  
  // Handle data from server
  socket.on('data', (data) => {
    terminal.write(data);
  });
  
  // Handle errors
  socket.on('error', (data) => {
    statusElement.textContent = data.message;
    statusElement.className = 'error';
    terminal.write(`\r\n\x1b[31m${data.message}\x1b[0m\r\n`);
  });
  
  // Send terminal input to server
  terminal.onData((data) => {
    socket.emit('data', data);
  });
  
  // Handle terminal resize
  terminal.onResize((size) => {
    socket.emit('resize', {
      cols: size.cols,
      rows: size.rows
    });
  });
  
  // Handle window resize
  window.addEventListener('resize', () => {
    fitAddon.fit();
  });
  
  // Focus terminal on click
  document.getElementById('terminal').addEventListener('click', () => {
    terminal.focus();
  });
});