import Router, { Request, Response } from 'express';
import { Errors } from 'io-ts';
import { FindVehicleStateQuery } from '../core/types';
import { findStateById } from '../core/repositories/vehicles';
import { pipe } from 'fp-ts/function';
import { match } from 'fp-ts/Either';
import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK } from '../lib/http';
import { findVehicleState } from '../core/queries/findVehicleState';

const router = Router();

router.get('/vehicles/:vehicleId/:timestamp', async (req: Request, res: Response) => {
  async function onValidationFailed(errors: Errors) {
    return res.status(HTTP_STATUS_BAD_REQUEST).send(errors);
  }

  async function onValidationSuccess(queryInput: FindVehicleStateQuery) {
    const foundVehicleStats = await findVehicleState(queryInput);
    if (foundVehicleStats) {
      return res.status(HTTP_STATUS_OK).send(foundVehicleStats);
    }
    return res.status(HTTP_STATUS_NOT_FOUND).send();
  }

  await pipe(
    FindVehicleStateQuery.decode(req.params),
    match(onValidationFailed, onValidationSuccess),
  );
});

export default router;
