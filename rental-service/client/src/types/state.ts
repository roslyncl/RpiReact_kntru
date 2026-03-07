import { store } from '../store/index';

export type State = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type User = {
  email: string;
  avatar: string | null;  
  token?: string;
  username?: string;
};