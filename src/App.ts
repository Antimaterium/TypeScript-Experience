import express, { NextFunction, Request, Response } from "express";
import Youch from "youch";
import HttpException from "./exceptions/HttpException";

class App {
  public server: express.Application;

  constructor() {
    this.server = express();
    this.middlewares();
    this.exceptionHandler();
  }

  private middlewares() {
    this.server.use(express.json());
  }

  private exceptionHandler() {
    this.server.use(
      async (
        err: HttpException,
        req: Request,
        res: Response,
        next: NextFunction
      ) => {
        const env = process.env.NODE_ENV;
        if (err && (env === "development" || env === "test")) {
          console.log(err);
          const errors = await new Youch(err, req).toJSON();
          return res.status(500).json(errors);
        }

        return res.status(500).json({ error: "Internal Server Error" });
      }
    );
  }
}

export default new App().server;
