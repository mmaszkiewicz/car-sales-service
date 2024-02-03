import pgPromise from 'pg-promise';
import {getEnv} from "../../../lib/utils";

const pgp = pgPromise({});
// Connection is being managed internally by the lib through pulling
const db = pgp(getEnv('DB_URL'));

export async function findStateById(vehicleId: number, timestamp: string) {
    // Query selects the state entry that is closest in the past to the timestamp
    const query: string = `
    SELECT
        v.id,
        v.make,
        v.model,
        sl.state
    FROM
        "stateLogs" sl
    JOIN
        "vehicles" v ON (sl."vehicleId" = v.id)        
    WHERE
        "vehicleId" = $1
    AND
        timestamp <= $2
    ORDER BY
        timestamp DESC
    LIMIT
        1`
    return db.oneOrNone(query, [vehicleId, timestamp]);
}