import { configureStore } from '@reduxjs/toolkit';
import mallSlice from './MallSlice';

export default configureStore({
  reducer: {
    malls: mallSlice,
  },
});
