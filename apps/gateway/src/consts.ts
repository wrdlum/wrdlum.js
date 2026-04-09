/**
 * The port number the API Gateway will listen on.
 * Defaults to 3000 if the environment variable is missing or invalid.
 */
const rawPort = process.env.WRDLUM_PORT;
const parsedPort = Number.parseInt(rawPort || '', 10);

export const PORT = Number.isNaN(parsedPort) ? 3000 : parsedPort;

/**
 * List of allowed hosts for the API Gateway.
 * Can be a single string '*' or an array of domains.
 */
const rawHosts = process.env.WRDLUM_ALLOWED_HOSTS;

export const ALLOWED_HOSTS =
  !rawHosts || rawHosts === '*'
    ? '*'
    : rawHosts
        .split(',')
        .map((h) => h.trim())
        .filter(Boolean);
