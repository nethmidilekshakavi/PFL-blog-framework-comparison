import express from "express";
import cors from "cors";
import { createPostController } from "./controllers/postController.js";
import { createPostRoutes } from "./routes/postRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

/**
 * App factory: everything the app needs is passed in (dependency injection),
 * so tests can build an app around an in-memory repository or a :memory: SQLite DB.
 */
export function createApp({ postService, corsOrigins = [] }) {
  const app = express();

  app.use(cors(corsOrigins.length ? { origin: corsOrigins } : undefined));
  app.use(express.json({ limit: "1mb" }));

  app.get("/health", (req, res) => res.json({ status: "ok" }));
  app.use("/posts", createPostRoutes(createPostController(postService)));

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
