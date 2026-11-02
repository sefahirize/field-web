import { createSlice } from '@reduxjs/toolkit';

export const SIDEBAR_STORAGE_KEY = 'joinfield-sidebar'; // like the theme: signing out must not reset it

const readCollapsed = () => {
  try {
    return localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'collapsed';
  } catch {
    return false;
  }
};

const initialState = {
  isOpenSidebar: false, // the drawer, on tablet and below
  isSidebarCollapsed: readCollapsed(), // the icon-only rail, on desktop
  isLoading: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: state => {
      state.isOpenSidebar = !state.isOpenSidebar;
    },
    closeSidebar: state => {
      state.isOpenSidebar = false;
    },
    toggleSidebarCollapsed: state => {
      state.isSidebarCollapsed = !state.isSidebarCollapsed;
    },
    toggleLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { toggleSidebar, closeSidebar, toggleSidebarCollapsed, toggleLoading } = uiSlice.actions;

export default uiSlice.reducer;
