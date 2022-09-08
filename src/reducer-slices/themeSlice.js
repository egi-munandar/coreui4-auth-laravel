import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sidebarShow: true,
  toast: 0,
}

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleSidebar: (state, value) => {
      state.sidebarShow = value.payload
    },
    thToast: (state, { payload }) => {
      state.toast = payload
    },
  },
})

export const { toggleSidebar, thToast } = themeSlice.actions

export default themeSlice.reducer
