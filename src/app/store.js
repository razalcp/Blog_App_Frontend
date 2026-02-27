import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../store/authSlice';
import blogReducer from '../store/blogSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    blogs: blogReducer,
  },
});
