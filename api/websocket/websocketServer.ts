import { WebSocketServer } from 'ws';
import { handleConnection } from './connectionManager';
import http from 'http';

export const initServer = (
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>,
) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', handleConnection);

};