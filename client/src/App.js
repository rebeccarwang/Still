import {BrowserRouter, Routes, Route, useLocation} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MoodCheckInPage from './pages/MoodCheckInPage';
import PreferenceSetupPage from './pages/PreferenceSetupPage';
import PreferenceUpdatePage from './pages/PreferenceUpdatePage';
import SignupPage from './pages/SignupPage';
import {AuthProvider} from './hooks/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import JournalEntryPage from './pages/JournalEntryPage';
import MoodTagsPage from './pages/MoodTagsPage';
import UserPreferenceViewer from './pages/UserPreferenceViewer';
import HomePage from './pages/HomePage';
import OptionsPage from './pages/OptionsPage';
import EntriesPage from './pages/EntriesPage';
import IndividualEntryPage from './pages/IndividualEntryPage';
import TrendsPage from './pages/TrendsPage';
import NavBar from './components/NavBar';

function App() {

  function AppRoutes() {
    const location = useLocation();
    const hideNavBar = ['/', '/signup'].includes(location.pathname);

    return (
      <>
      {!hideNavBar && <NavBar />}
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/check-in' element={<ProtectedRoute><MoodCheckInPage /></ProtectedRoute>} />
        <Route path='/setup/preferences' element={<ProtectedRoute><PreferenceSetupPage /></ProtectedRoute>} />
        <Route path='/preferences' element={<ProtectedRoute><PreferenceUpdatePage/></ProtectedRoute>} />
        <Route path='/journal' element={<ProtectedRoute><JournalEntryPage /></ProtectedRoute>} />
        <Route path='/options' element={<ProtectedRoute><OptionsPage /></ProtectedRoute>} />
        <Route path='/options/preference' element={<ProtectedRoute><UserPreferenceViewer /></ProtectedRoute>} />
        <Route path='/tags' element={<ProtectedRoute><MoodTagsPage /></ProtectedRoute>} />
        <Route path='/home' element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path='/entries' element={<ProtectedRoute><EntriesPage /></ProtectedRoute>} />
        <Route path='/entries/:id' element={<ProtectedRoute><IndividualEntryPage /></ProtectedRoute>} />
        <Route path='/trends' element={<ProtectedRoute><TrendsPage /></ProtectedRoute>} />
      </Routes>
      </>
    )
  }

  return (
    <AuthProvider>
      <BrowserRouter>
      <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;
