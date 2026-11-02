import axios from 'axios';
import { unwrap } from '@dashboard/libs/apiError';

export const profileApi = {
  /** GET /profile -> the user plus a per-product credit ledger. */
  async get() {
    const { data } = await axios.get('profile');
    return unwrap(data, null);
  },

  /**
   * PUT /profile. The API field is `lastname`; the app says `surname`.
   * Verified: answers {"message":"User updated successfully","success":true} —
   * note it returns no user object, so callers must refetch to see the change.
   */
  async update({ name, surname, email }) {
    const { data } = await axios.put('profile', { name, lastname: surname, email });
    return { message: data?.message ?? 'Profile saved.' };
  },

  /**
   * PUT /profile/avatar with a BARE base64 string under `profile` — no
   * "data:image/jpeg;base64," prefix; the API rejects that.
   *
   * Verified: answers
   *   { avatar: "/uploads/avatars/<uuid>.jpg", extension, file_uuid,
   *     mime_type, size, success }
   * and GET /profile's `profile` field then holds that same relative path —
   * not base64. Render it through libs/assetUrl.
   */
  async updateAvatar({ base64 }) {
    const { data } = await axios.put('profile/avatar', { profile: base64 });
    return { path: data?.avatar ?? null, mimeType: data?.mime_type, size: data?.size };
  },

  /**
   * PUT /profile/password { password, password_confirm }
   *
   * Takes NO current password — the dashboard collection's body, and what the
   * server validates ("Password failed on required", "… failed on min"). The
   * master collection's `current_password` / `new_password` names are not
   * what the live server reads. The success response has not been observed;
   * only the validation errors have.
   */
  async changePassword({ password, passwordConfirm }) {
    const { data } = await axios.put('profile/password', { password, password_confirm: passwordConfirm });
    return { message: data?.message ?? 'Password changed.' };
  },
};
