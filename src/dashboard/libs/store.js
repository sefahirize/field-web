import { configureStore } from '@reduxjs/toolkit';
import analyticsSlice from '@dashboard/features/analytics/analyticsSlice';
import apiCredentialsSlice from '@dashboard/features/apiCredentials/apiCredentialsSlice';
import authSlice from '@dashboard/features/auth/authSlice';
import checkoutSlice from '@dashboard/features/checkout/checkoutSlice';
import creditsSlice from '@dashboard/features/credits/creditsSlice';
import documentsSlice from '@dashboard/features/documents/documentsSlice';
import productsSlice from '@dashboard/features/products/productsSlice';
import profileSlice from '@dashboard/features/profile/profileSlice';
import uiSlice from '@dashboard/features/ui/uiSlice';

const store = configureStore({
  reducer: {
    ui: uiSlice,
    auth: authSlice,
    profile: profileSlice,
    products: productsSlice,
    documents: documentsSlice,
    checkout: checkoutSlice,
    credits: creditsSlice,
    analytics: analyticsSlice,
    apiCredentials: apiCredentialsSlice,
  },
});

export default store;
