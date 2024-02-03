import 'express-async-errors';
import express, { Application, NextFunction, Response, Request } from 'express';
import { getEnv } from './lib/utils';
import router from './api/routes';
import { pgp } from './core/repositories/vehicles';

const app: Application = express();
const port = getEnv('PORT');

app.use(router);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  return res.status(500).send({ message: 'Internal Server Error' });
});

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

process.on('SIGTERM', () => {
  console.log('Handle termination signal');
  server.close(() => {
    pgp.end();
  });
});
