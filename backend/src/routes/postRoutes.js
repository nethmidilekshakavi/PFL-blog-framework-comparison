import { Router } from "express";

export function createPostRoutes(controller) {
  const router = Router();
  router.get("/", controller.list);
  router.post("/", controller.create);
  router.get("/:id", controller.get);
  router.patch("/:id", controller.update);
  router.put("/:id", controller.update);
  router.delete("/:id", controller.remove);
  return router;
}
