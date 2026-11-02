import axios from 'axios';
import { unwrap } from '@dashboard/libs/apiError';

/** The only environments the collection names. */
export const API_ENVIRONMENTS = ['test', 'production'];

/**
 * The secret is only ever shown once, on create and regenerate. The master
 * collection's test scripts read it as `data.raw_key` (and the id as
 * `data.id`); no key has been created against the live API from here, so the
 * other likely names stay as fallbacks and the raw response is kept alongside.
 */
const toSecret = payload => {
  const d = payload?.data ?? payload;
  return d?.raw_key ?? d?.api_key ?? d?.key ?? d?.secret ?? d?.token ?? d?.plain_key ?? d?.client_secret ?? null;
};

/** The collection's body. `scopes` is only ever "*"; `expires_days` 0 means never. */
const toBody = ({ name, environment, expiresDays }) => ({
  name,
  environment,
  scopes: '*',
  expires_days: Number(expiresDays) || 0,
});

export const apiCredentialsApi = {
  /**
   * GET /api-credentials -> { data: [], success }
   * Verified 2026-09-14 on an account with no keys; the row shape is unseen.
   */
  async list() {
    const { data } = await axios.get('api-credentials');
    return unwrap(data, []);
  },

  /**
   * GET /api-credentials/:id -> { data: {row} }. Verified only that an unknown
   * id answers 404 `api_key_not_found`.
   */
  async get(id) {
    const { data } = await axios.get(`api-credentials/${id}`);
    return unwrap(data, null);
  },

  /** POST /api-credentials -> 201. Response shape unverified — see `toSecret`. */
  async create(values) {
    const { data } = await axios.post('api-credentials', toBody(values));
    return { secret: toSecret(data), raw: data };
  },

  /**
   * PUT /api-credentials/:id. Verified only that an unknown id answers
   * 404 `{ error: "api_key_not_found", message: "API key not found" }`.
   */
  async update(id, values) {
    const { data } = await axios.put(`api-credentials/${id}`, toBody(values));
    return data;
  },

  /**
   * POST /api-credentials/:id/regenerate. The collection sends the create body
   * here too; it is sent unchanged in case the endpoint validates it.
   */
  async regenerate(id, values) {
    const { data } = await axios.post(`api-credentials/${id}/regenerate`, toBody(values));
    return { secret: toSecret(data), raw: data };
  },

  /** DELETE /api-credentials/:id */
  async remove(id) {
    const { data } = await axios.delete(`api-credentials/${id}`);
    return data;
  },
};
