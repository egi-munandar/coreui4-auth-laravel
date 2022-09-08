import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './reducer-slices/themeSlice'
import authReducer from './reducer-slices/authSlice'

const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
  },
})

// import { createStore } from 'redux'

// const initialState = {
//   sidebarShow: true,
// }

// const changeState = (state = initialState, { type, ...rest }) => {
//   switch (type) {
//     case 'set':
//       return { ...state, ...rest }
//     default:
//       return state
//   }
// }

// const store = createStore(changeState)
export default store
