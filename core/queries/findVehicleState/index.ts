import { FindVehicleStateQuery } from '../../types';
import { findStateById } from '../../repositories/vehicles';
import NodeCache from 'node-cache';
import { getEnv } from '../../../lib/utils';

const cache = new NodeCache({ stdTTL: parseInt(getEnv('CACHE_TTL')) });

export async function findVehicleState(queryInput: FindVehicleStateQuery) {
  const cacheKey = `${queryInput.vehicleId}/${queryInput.timestamp}`;
  const cacheFound = cache.get(cacheKey);
  if (cacheFound) {
    return cacheFound;
  }
  const foundVehicleStats = await findStateById(
    parseInt(queryInput.vehicleId),
    queryInput.timestamp,
  );
  cache.set(cacheKey, foundVehicleStats);
  return foundVehicleStats;
}
