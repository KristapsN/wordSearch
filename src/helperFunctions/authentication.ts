import { Dispatch, SetStateAction } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '../firebaseConfig';

export const login = async (
  loginEmail: string,
  loginPassword: string,
  setLoginEmail: Dispatch<SetStateAction<string>>,
  setLoginPassword: Dispatch<SetStateAction<string>>,
  setLoginError: Dispatch<SetStateAction<string>>,
) => {
  try {
    await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    setLoginEmail('');
    setLoginPassword('');
  } catch (error: any) {
    setLoginError(error.message);
  }
};

export const register = async (
  comparePassword: string,
  loginPassword: string,
  loginEmail: string,
  setLoginEmail: Dispatch<SetStateAction<string>>,
  setLoginPassword: Dispatch<SetStateAction<string>>,
  setLoginError: Dispatch<SetStateAction<string>>,
  setComparePassword: Dispatch<SetStateAction<string>>,
// eslint-disable-next-line consistent-return
) => {
  try {
    if (comparePassword === loginPassword && comparePassword.length > 0) {
      await createUserWithEmailAndPassword(auth, loginEmail, loginPassword);
      setComparePassword('');
      login(loginEmail, loginPassword, setLoginEmail, setLoginPassword, setLoginError);
    }
    setLoginError('Provided passwords does not mach');
    return false;
  } catch (error: any) {
    setLoginError(error.message);
  }
};

export const logout = async () => {
  await signOut(auth);
};

export const resetPassword = async (loginEmail: string, setLoginError: Dispatch<SetStateAction<string>>) => {
  try {
    await sendPasswordResetEmail(auth, loginEmail);
  } catch (error: any) {
    setLoginError(error);
  }
};
