/** HTTP layer: translates requests into service calls. No business rules here. */
export function createPostController(service) {
  return {
    list: (req, res) => res.json(service.list(req.query)),
    get: (req, res) => res.json(service.get(req.params.id)),
    create: (req, res) => res.status(201).json(service.create(req.body)),
    update: (req, res) => res.json(service.update(req.params.id, req.body)),
    // 200 + deleted post (json-server behaviour). The Vue client always calls res.json(), so 204 would break it.
    remove: (req, res) => res.status(200).json(service.remove(req.params.id)),
  };
}
