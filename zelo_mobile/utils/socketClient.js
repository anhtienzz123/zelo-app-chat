import io from 'socket.io-client';
import {REACT_APP_SOCKET_URL} from '../constants';

export let socket;

export function init() {
  if (!socket) {
    socket = io(REACT_APP_SOCKET_URL, {
      transports: ['websocket'],
    });
  }
}

export function disconnect() {
  if (socket) {
    socket.disconnect();
    socket.close();
  }
  socket = null;
}
