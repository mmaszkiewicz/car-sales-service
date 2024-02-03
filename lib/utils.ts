export function getEnv(name: string): string {
    const value = process.env[name];
    if (value !== undefined && value !== '') {
        return value;
    }
    throw new Error(`Env var ${name} not available`);
}