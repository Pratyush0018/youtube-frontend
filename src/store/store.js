import { configureStore } from '@reduxjs/toolkit'
import authSliceReducer from "./Slices/authSlice";

export const store = configureStore({
  reducer: {
   auth: authSliceReducer,
  
     

  }
})