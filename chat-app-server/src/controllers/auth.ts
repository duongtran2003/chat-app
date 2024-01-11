import { Response, Request } from "express";

class AuthController {
  register(req: Request, res: Response) {
    return res.json({
      "message": "todo",
    });
  }

  login(req: Request, res: Response) {
    return res.json({
      "message": "todo",
    })
  }
}

module.exports = new AuthController();