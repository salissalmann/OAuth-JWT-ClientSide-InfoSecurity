// ProtectedRoutes.tsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from '../layout/Dashboard';
import ReuseableComponents from '../pages/ReuseableComponents';
import ManageDeckGroups from '../pages/DeckGroups/ManageDeckGroups';

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
         <Route
            path="/deckgroups/manage"
            element={
               <Dashboard>
                  <ManageDeckGroups />
               </Dashboard>
            }
         />
      </Routes>
   );
};

export default ProtectedRoutes;
