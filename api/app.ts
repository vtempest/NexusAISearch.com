import { startWebSocketServer } from './websocket';

import configRouter from './routes/config';
import imagesRouter from './routes/images';
import videosRouter from './routes/videos';
import modelsRouter from './routes/models';
import suggestionsRouter from './routes/suggestions';


import { Hono } from "hono";
import { cors } from 'hono/cors'
import { trimTrailingSlash } from 'hono/trailing-slash'
import { prettyJSON } from 'hono/pretty-json'
import { logger } from 'hono/logger'
import { upgradeWebSocket } from 'hono/cloudflare-workers'


// middleware
const app = new Hono();
app.use(trimTrailingSlash())
app.use(prettyJSON()) // With options: prettyJSON({ space: 4 })
app.use(logger())

  
app.use('*', cors())

app.get('/', (c) => {
  return c.json({ message: 'Hello, World!' });
})

app.get('/api/config', configRouter);
app.get('/api/images', imagesRouter);
app.get('/api/videos', videosRouter);
app.get('/api/models', modelsRouter);
app.get('/api/suggestions', suggestionsRouter);



app.get(
  '/ws',
  upgradeWebSocket((c) => {
    return {
      onMessage(event, ws) {
        
        
        console.log(`Message from client: ${event.data}`)
        ws.send('Hello from server!')


      },
      onClose: () => {
        console.log('Connection closed')
      },
    }
  })
)


// startWebSocketServer();


export default app;