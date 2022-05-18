import { useState, createContext, useContext } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  User,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { Link } from 'react-router-dom';
import Button from '../components/button';
import TextInput from '../components/textInput';
import { auth } from '../firebaseConfig';
import UserContext from '../UserContext';

const Register = () => {
  // @ts-ignore
  const { currentUser, setCurrentUserUser } = useContext(UserContext);
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // const [currentUser, setCurrentUserUser] = useState<User | null>();
  console.log(currentUser);
  onAuthStateChanged(auth, (registeredUser) => {
    setCurrentUserUser(registeredUser);
  });

  const register = async () => {
    setLoading(true);
    try {
      const user = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
      console.log(user);
    } catch (error: any) {
      console.log(error.message);
    }
    setLoading(false);
  };

  const login = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const forgotPassword = async () => {
    sendPasswordResetEmail(auth, registerEmail);
  };

  return (
    <div>
      <Link to="/"> Link </Link>
      <span>
        User:
        {' '}
        {currentUser?.email}
      </span>
      <span>Register</span>
      <TextInput placeholder="E-mail" value={registerEmail} label="E-mail: " textChangeHandler={(e) => setRegisterEmail(e.target.value)} />
      <TextInput placeholder="Password" value={registerPassword} label="Password: " textChangeHandler={(e) => setRegisterPassword(e.target.value)} />
      <Button disabled={loading} mainStyle name="Create user" clickHandler={() => register()} />
      <Button mainStyle name="Login" clickHandler={() => login()} />
      <Button mainStyle name="logout" clickHandler={() => logout()} />
      <Button mainStyle name="Forgot password" clickHandler={() => forgotPassword()} />

      <span>Login</span>
      <TextInput placeholder="Email" value={loginEmail} label="E-mail: " textChangeHandler={(e) => setLoginEmail(e.target.value)} />
      <TextInput placeholder="Password" value={loginPassword} label="Password: " textChangeHandler={(e) => setLoginPassword(e.target.value)} />

    </div>
  );
};
export default Register;
