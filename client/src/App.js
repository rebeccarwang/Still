import {BrowserRouter, Routes, Route} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MoodCheckInPage from './pages/MoodCheckInPage';
import PreferenceSetupPage from './pages/PreferenceSetupPage';
import SignupPage from './pages/SignupPage';
import {AuthProvider} from './hooks/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import JournalEntryPage from './pages/JournalEntryPage';
import UserPreferenceViewer from './pages/UserPreferenceViewer';
import OptionsPage from './pages/OptionsPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/check-in' element={<ProtectedRoute><MoodCheckInPage /></ProtectedRoute>} />
          <Route path='/setup/preferences' element={<ProtectedRoute><PreferenceSetupPage /></ProtectedRoute>} />
          <Route path='/journal' element={<ProtectedRoute><JournalEntryPage /></ProtectedRoute>} />
          <Route path='/options' element={<ProtectedRoute><OptionsPage /></ProtectedRoute>} />
          <Route path='/options/preference' element={<ProtectedRoute><UserPreferenceViewer /></ProtectedRoute>} />
          <Route path='/signup' element={<SignupPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;
