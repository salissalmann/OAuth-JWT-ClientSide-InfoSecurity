// AppRoutes.tsx
import React from 'react';
import PublicRoutes from './PublicRoutes';
import ProtectedRoutes from './ProtectedRoutes';
import { Route, Routes } from 'react-router-dom';

const AppRoutes: React.FC = () => {
   return (
      <Routes>
         <Route path="/" element={<PublicRoutes />} />
         <Route path="/" element={<ProtectedRoutes />} />
      </Routes>
   );
};

export default AppRoutes;
