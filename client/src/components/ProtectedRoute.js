import {Navigate} from 'react-router-dom';
import {useAuth} from '../hooks/AuthContext';

const ProtectedRoute = ({children}) => {
  const {user, loading} = useAuth();
  if (loading) {
    return null;
  }
  if (!user) {
    return <Navigate to='/' />;
  }

  return children;
}

export default ProtectedRoute;