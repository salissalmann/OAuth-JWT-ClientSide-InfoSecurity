// ProtectedRoutes.tsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from '../layout/Dashboard';
import ReuseableComponents from '../pages/ReuseableComponents';
const ProtectedRoutes: React.FC = () => {
   return (
      <Routes>
         <Route
            path="/mcqs/manage"
            element={
               <Dashboard>
                  <ReuseableComponents />
               </Dashboard>
            }
         />
      </Routes>
   );
};

export default ProtectedRoutes;
