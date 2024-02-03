import 'express-async-errors';
import express, { Application, NextFunction, Response, Request } from 'express';
import { getEnv } from "./lib/utils";
import router from './api/routes';

const app: Application = express();
const port = getEnv('PORT');

app.use(router);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack)
    return res.status(500).send({ message: 'Internal Server Error' })
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});