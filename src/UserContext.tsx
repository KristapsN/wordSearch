import { User } from 'firebase/auth';
import { createContext } from 'react';

const UserContext = createContext<User | {} >({});

export default UserContext;
