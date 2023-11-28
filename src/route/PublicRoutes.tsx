// PublicRoutes.tsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from '../layout/Dashboard';
import { Login } from '../pages/Auth';
import ReuseableComponents from '../pages/ReuseableComponents';

const PublicRoutes: React.FC = () => {
   return (
      <Routes>
         <Route
            path="/login"
            element={
               <Dashboard>
                  <Login />
               </Dashboard>
            }
         />
         <Route
            path="/"
            element={
               <Dashboard>
                  <ReuseableComponents />
               </Dashboard>
            }
         />
      </Routes>
   );
};

export default PublicRoutes;
