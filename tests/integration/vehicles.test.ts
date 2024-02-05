import { startServer, closeServer } from '../../index';
import { getEnv } from '../../lib/utils';

function getUrl(vehicleId: string, timestamp: string) {
  return `http://localhost:${getEnv('PORT')}/vehicles/${vehicleId}/${timestamp}`;
}

async function fetchStatusForTimestamp(timestamp: string): Promise<string> {
  const response = await fetch(getUrl('3', timestamp));
  const jsonBody = await response.json();
  return jsonBody.state;
}

describe('vehicles end-point', () => {
  beforeAll(async () => {
    await startServer();
  });
  it('responds with 404 if vehicle not found', async () => {
    const response = await fetch(getUrl('5', '2022-09-11 09:11:45+00'));
    expect(response.status).toBe(404);
  });
  it('responds with 404 if vehicle found, but timestamp out of range', async () => {
    const response = await fetch(getUrl('3', '2020-09-11 09:11:45+00'));
    expect(response.status).toBe(404);
  });
  it('returns the closest record where timestamp is older', async () => {
    expect(await fetchStatusForTimestamp('2022-09-11 09:11:45+00')).toBe('quoted');
    expect(await fetchStatusForTimestamp('2022-09-11 23:21:38+00')).toBe('selling');
    expect(await fetchStatusForTimestamp('2022-09-12 12:41:41+00')).toBe('sold');
  });
  afterAll(async () => {
    await closeServer();
  });
});
