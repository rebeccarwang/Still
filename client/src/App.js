import {BrowserRouter, Routes, Route} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MoodCheckInPage from './pages/MoodCheckInPage';
import PreferenceSetupPage from './pages/PreferenceSetupPage';
import SignupPage from './pages/SignupPage';
import {AuthProvider} from './hooks/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/check-in' element={<ProtectedRoute><MoodCheckInPage /></ProtectedRoute>} />
          <Route path='/setup/preferences' element={<ProtectedRoute><PreferenceSetupPage /></ProtectedRoute>} />
          <Route path='/signup' element={<SignupPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;
