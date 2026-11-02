import axios from 'axios';

/**
 * POST /process — the endpoint API consumers call with a key from the API keys
 * page, not with the dashboard session:
 *
 *   X-API-Key: <secret>
 *   { product_key, file_name, data: <bare base64> }
 *
 * Verified 2026-10-08 that it is live and checks the key: no header answers
 * 401 `missing_api_key`, a wrong one 401 `invalid_api_key` ("Invalid or
 * inactive API Key."). The success shape is the master collection's —
 * `{ success, data: { id, uuid, … }, is_cached }` — and is NOT verified, so
 * the raw response is returned for the page to show. Each call spends credits,
 * like an upload.
 *
 * It goes through a bare axios instance on purpose. The shared one adds the
 * dashboard's bearer token, and treats any 401 as an expired session: it would
 * refresh, retry, and on the second 401 sign the user out — over a mistyped key.
 */
export const processApi = {
  async run({ apiKey, productKey, fileName, data }) {
    const client = axios.create({ baseURL: axios.defaults.baseURL });
    const response = await client.post(
      'process',
      { product_key: productKey, file_name: fileName, data },
      // `false` drops a header outright — including one a default might add —
      // so the key is the only credential on the request.
      { headers: { 'Content-Type': 'application/json', 'X-API-Key': apiKey, Authorization: false } },
    );
    return { status: response.status, body: response.data };
  },
};
