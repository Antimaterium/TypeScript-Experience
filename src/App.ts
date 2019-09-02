import express from 'express';

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
    this.server.use(async (err, req, res, next) => {
      const env = process.env.NODE_ENV;
      if (err && (env === 'development' || env === 'test')) {
        console.log(err);
        return res.status(500).json(err);
      }

      return res.status(500).json({ error: 'Internal Server Error' });
    });
  }
}

export default new App().server;
