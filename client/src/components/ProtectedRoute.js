import {Navigate} from 'react-router-dom';
import {useAuth} from '../hooks/AuthContext';

const ProtectedRoute = ({children}) => {
  const {user, loading} = useAuth();
  if (loading) {
    return (<>
    <div className='bg-white bg-opacity-70 flex items-center justify-center'>
    <div className='absolute p-8 lg:p-12 text-med-orange text-lg lg:text-2xl italic whitespace-nowrap'>Loading...</div>
    </div>
    </>)
  }
  if (!user) {
    return <Navigate to='/' />;
  }

  return children;
}

export default ProtectedRoute;