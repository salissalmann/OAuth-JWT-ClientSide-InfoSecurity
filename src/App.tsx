import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppRoutes from './route/AppRoutes';
import Dashboard from './layout/Dashboard';
import { Login } from './pages/Auth';
import AuthProvider from './context/AuthProvider';
import Registeration from './pages/Auth/Registeration';
import SignUp from './pages/Auth/SignUp';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />


          <Route path="/users"
            element={
              <Dashboard>
                <Registeration/>
              </Dashboard>
            }
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
