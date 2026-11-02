import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { profileApi } from './profileApi';
import { toApiError } from '@dashboard/libs/apiError';
import { fetchSession } from '@dashboard/features/auth/authAction';

export const fetchProfile = createAsyncThunk('profile/fetch', async (_, { rejectWithValue }) => {
  try {
    return await profileApi.get();
  } catch (error) {
    return rejectWithValue(toApiError(error));
  }
});

export const updateAvatar = createAsyncThunk('profile/updateAvatar', async ({ base64 }, { dispatch, rejectWithValue }) => {
  try {
    const result = await profileApi.updateAvatar({ base64 });
    // The response carries the new path, but the user record is what the app
    // renders from — read it back rather than patching two places.
    await dispatch(fetchSession());
    return result;
  } catch (error) {
    return rejectWithValue(toApiError(error));
  }
});

export const updateProfile = createAsyncThunk('profile/update', async (body, { dispatch, rejectWithValue }) => {
  try {
    const result = await profileApi.update(body);
    // PUT /profile answers with a message, not the updated user, so the only
    // way to reflect the change is to read it back. Waited for, so a screen that
    // moves on after saving shows the new details, not the old ones.
    await dispatch(fetchSession());
    return result;
  } catch (error) {
    return rejectWithValue(toApiError(error));
  }
});

export const changePassword = createAsyncThunk('profile/changePassword', async (values, { rejectWithValue }) => {
  try {
    return await profileApi.changePassword(values);
  } catch (error) {
    return rejectWithValue(toApiError(error));
  }
});

const initialState = {
  data: null,
  status: 'idle',
  error: null,
  message: null,
  // Kept apart from the details form so one form's message never shows under the other.
  password: { status: 'idle', error: null, message: null },
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfileFeedback: state => {
      state.error = null;
      state.message = null;
      state.password = initialState.password;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProfile.fulfilled, (state, { payload }) => {
        state.data = payload;
        state.status = 'ready';
      })
      .addCase(fetchProfile.rejected, (state, { payload }) => {
        state.status = 'error';
        state.error = payload?.message ?? null;
      })
      .addCase(updateProfile.pending, state => {
        state.status = 'saving';
        state.error = null;
        state.message = null;
      })
      .addCase(updateProfile.fulfilled, (state, { payload }) => {
        state.status = 'ready';
        state.message = 'Profile saved.';
        if (payload) state.data = payload;
      })
      .addCase(updateProfile.rejected, (state, { payload }) => {
        state.status = 'error';
        state.error = payload?.message ?? 'Could not save your profile.';
      })
      .addCase(updateAvatar.pending, state => {
        state.status = 'uploading';
        state.error = null;
        state.message = null;
      })
      .addCase(updateAvatar.fulfilled, state => {
        state.status = 'ready';
        state.message = 'Photo updated.';
      })
      .addCase(updateAvatar.rejected, (state, { payload }) => {
        state.status = 'error';
        state.error = payload?.message ?? 'Could not upload that photo.';
      })
      .addCase(changePassword.pending, state => {
        state.password = { status: 'saving', error: null, message: null };
      })
      .addCase(changePassword.fulfilled, (state, { payload }) => {
        state.password = { status: 'ready', error: null, message: payload?.message ?? 'Password changed.' };
      })
      .addCase(changePassword.rejected, (state, { payload }) => {
        state.password = {
          status: 'error',
          error: payload?.message ?? 'Could not change your password.',
          message: null,
        };
      });
  },
});

export const { clearProfileFeedback } = profileSlice.actions;

export default profileSlice.reducer;
