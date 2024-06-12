import { Hono } from "hono";
import { cors } from 'hono/cors'
import { trimTrailingSlash } from 'hono/trailing-slash'
import { prettyJSON } from 'hono/pretty-json'
import { logger } from 'hono/logger'

import extractController from "./controllers/extract";
import searchController from "./controllers/search";
import answerController from "./controllers/answer";

// API Server Middleware

const app = new Hono();
app.use(trimTrailingSlash())
app.use(prettyJSON()) // With options: prettyJSON({ space: 4 })
app.use(logger())

  

app.use('/api/*', cors())

//routing

// app.get("/api/docs", swaggerUI({ url: "/api/docs" }));

app.get("/api/extract", extractController);
app.get("/api/search", searchController);
app.get("/api/answer", answerController);

export default app;
