import { findVehicleState } from './index';

import { findStateById } from '../../repositories/vehicles';
import { getEnv } from '../../../lib/utils';

jest.mock('../../repositories/vehicles');
jest.mock('../../../lib/utils');

describe('Find Vehicle State Query', () => {
  it('caches results', async () => {
    const mockGetEnv = jest.mocked(getEnv);
    mockGetEnv.mockReturnValueOnce('60').mockReturnValue('postgresql://localhost:5432');
    const mockedFindStateById = jest.mocked(findStateById);
    mockedFindStateById.mockResolvedValueOnce({ id: 2 });
    await findVehicleState({
      vehicleId: '3',
      timestamp: 'MOCK',
    });
    await findVehicleState({
      vehicleId: '3',
      timestamp: 'MOCK',
    });
    expect(mockedFindStateById.mock.calls.length).toEqual(1);
  });
});
