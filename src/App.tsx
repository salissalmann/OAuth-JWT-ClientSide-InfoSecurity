import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppRoutes from './route/AppRoutes';
import Dashboard from './layout/Dashboard';
import ManageDeckGroups from './pages/DeckGroups/ManageDeckGroups';
import CreateDeck from './pages/Decks/CreateDeck';
import ManageTopic from './pages/Topics/ManageTopic';
import ManageSubTopics from './pages/SubTopics/ManageSubTopics';
import TopicsDashboard from './pages/Topics/Topics_Dashboard';
import ManageDiscipline from './pages/Discipline/ManageDiscipline';
import ManageUniversities from './pages/Universities/UniversitiesDashboard';
import ManageModule from './pages/Module/ManageModule';
import { Login } from './pages/Auth';
import UniversityManager from './pages/Universities/UniversityManager';
import AuthProvider from './context/AuthProvider';
import PreQuestionScreen from './pages/Questions/PreQuestionScreen';
import PageNotFound from './pages/NotFound/PageNotFound';
import QuestionScreen from './pages/Questions/QuestionScreen';
import Registeration from './pages/Auth/Registeration';
// import Editor from "./components/Editor/Editor";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppRoutes />} />
          <Route
            path="/deckgroups/:deckGroupId"
            element={
              <Dashboard>
                <ManageDeckGroups />
              </Dashboard>
            }
          />

          <Route
            path="/decks/:deckId"
            element={
              <Dashboard>
                <CreateDeck />
              </Dashboard>
            }
          />

          <Route
            path="/topic"
            element={
              <Dashboard>
                <TopicsDashboard />
              </Dashboard>
            }
          />

          <Route
            path="/topic/:topicId"
            element={
              <Dashboard>
                <ManageTopic />
              </Dashboard>
            }
          />

          <Route
            path="/subtopic"
            element={
              <Dashboard>
                <ManageSubTopics />
              </Dashboard>
            }
          />

          <Route
            path="/discipline"
            element={
              <Dashboard>
                <ManageDiscipline />
              </Dashboard>
            }
          />

          <Route
            path="/universities"
            element={
              <Dashboard>
                <ManageUniversities />
              </Dashboard>
            }
          />

          <Route
            path="/university/:id"
            element={
              <Dashboard>
                <UniversityManager />
              </Dashboard>
            }
          />
          <Route path="/login" element={<Login />} />

          <Route
            path="/questions"
            element={
              <Dashboard>
                <PreQuestionScreen />
              </Dashboard>
            }
          />

          <Route
            path="/questions/editor"
            element={
              <Dashboard>
                <QuestionScreen />
              </Dashboard>
            }
          />
          <Route
            path="/questions/editor/:questionId"
            element={
              <Dashboard>
                <QuestionScreen />
              </Dashboard>
            }
          />
          <Route
            path="/module"
            element={
              <Dashboard>
                <ManageModule />
              </Dashboard>
            }
          />

          <Route path="/users"
            element={
              <Dashboard>
                <Registeration />
              </Dashboard>
            }
          />

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
