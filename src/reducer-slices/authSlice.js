import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loggedIn: false,
  loading: true,
  user: null,
}

export const authSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    authSetUser: (state, { payload }) => {
      state.user = payload
      state.loggedIn = true
      state.loading = false
    },
    authSetLoading: (state, { payload }) => {
      state.loading = payload
    },
    authLogout: (state) => {
      sessionStorage.clear()
      state.loggedIn = false
      state.user = null
    },
  },
})

export const { authSetUser, authSetLoading, authLogout } = authSlice.actions

export default authSlice.reducer
