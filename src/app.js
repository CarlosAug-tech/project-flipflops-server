import 'dotenv/config';
import express from 'express';
import path from 'path';
import cors from 'cors';

import './database';
import Routes from './routes';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(
      cors({
        exposedHeaders: ['x-total-count'],
        origin: '*',
      })
    );

    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(Routes);
  }
}

export default new App().server;
