import { useState, useMemo } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import { User } from 'firebase/auth';
import Register from './pages/register';

import Home from './pages/home';
import UserContext from './UserContext';

const Router = () => {
  const [currentUser, setCurrentUserUser] = useState<User | {}>();
  // const providerValue = useMemo(() => ({ currentUser, setCurrentUserUser }), [currentUser, setCurrentUserUser]);
  return (
    <UserContext.Provider value={{ currentUser, setCurrentUserUser }}>
      <BrowserRouter>
        {/* @ts-ignore */}
        {/* <UserContext.Provider value={{ currentUser, setCurrentUserUser }}> */}
        <Routes>
          <Route index element={<Home />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        {/* </UserContext.Provider> */}
      </BrowserRouter>
    </UserContext.Provider>
  );
};
export default Router;
