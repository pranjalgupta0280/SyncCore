import { io } from 'socket.io-client';

let socket = null;

export const connectSocket = (token) => {
  if (!socket) {
    socket = io('/', {
      auth: { token },
      autoConnect: true,
    });

    socket.on('connect', () => {
      console.log('[Socket.io] Connected to server. Socket ID:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('[Socket.io] Disconnected from server');
    });
  }
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
