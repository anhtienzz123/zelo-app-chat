import {configureStore} from '@reduxjs/toolkit';
import friend from './friendSlice';
import global from './globalSlice';
import me from './meSlice';
import message from './messageSlice';
import pin from './pinSlice';

const rootReducer = {
  global,
  me,
  friend,
  message,
  pin,
};

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({serializableCheck: false}),
});

export default store;
