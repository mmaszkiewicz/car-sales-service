import 'express-async-errors';
import express, { Application, NextFunction, Response, Request } from 'express';
import { getEnv } from './lib/utils';
import router from './api/routes';
import { pgp } from './core/repositories/vehicles';
import http from 'http';

const app: Application = express();
const port = getEnv('PORT');

app.use(router);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  return res.status(500).send({ message: 'Internal Server Error' });
});

let server: http.Server | null = null;

export async function startServer(): Promise<http.Server | null> {
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
      resolve(server);
    });
  });
}

export async function closeServer() {
  console.log('shutting the server down');
  server?.close(() => {
    pgp.end();
  });
}

if (require.main === module) {
  startServer().catch((error) => console.error(error));

  // Handle SIGTERM issued by Docker
  process.on('SIGTERM', async () => {
    console.log('Handle termination signal');
    await closeServer();
  });
}
