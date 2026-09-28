
const origins = (process.env.CORS_ORIGINS ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

export const config = {
  port: Number(process.env.PORT ?? 3001),
  dbFile: process.env.DB_FILE ?? "./data/blog.db",
  // empty list = allow any origin (fine for local development / coursework)
  corsOrigins: origins,
};
