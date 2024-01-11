import { Router, Request, Response } from "express";


let router = Router();

router.get("/testtest", (req: Request, res: Response) => {
  res.json({
    "message": "success"
  });
});

export {
  router
}