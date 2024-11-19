import { atom } from 'recoil';

// Define the username atom
export const tokenState = atom({
  key: 'tokenState', 
  default: '',
});
