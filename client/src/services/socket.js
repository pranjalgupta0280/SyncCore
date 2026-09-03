import { io } from 'socket.io-client';

let socket = null;
const FALLBACK_SOCKET_URL = 'https://synccore-cgqc.onrender.com';

export const connectSocket = (token) => {
  if (!socket) {
    const targetUrl =
      import.meta.env.VITE_SOCKET_URL ||
      import.meta.env.VITE_API_URL ||
      (import.meta.env.PROD ? FALLBACK_SOCKET_URL : window.location.origin);

    socket = io(targetUrl, {
      auth: { token },
      autoConnect: true,
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('[Socket.io] Connected to server at', targetUrl, 'Socket ID:', socket.id);
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
