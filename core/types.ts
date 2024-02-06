import * as t from 'io-ts';

export const FindVehicleStateQuery = t.type({
  vehicleId: t.string, // all query parameters are received as strings
  timestamp: t.string,
});

export type FindVehicleStateQuery = t.TypeOf<typeof FindVehicleStateQuery>;
