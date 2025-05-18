import {useAuth} from '../hooks/AuthContext';

export default function HomePage() {
  const {user} = useAuth();

  return (
    <>
    <h1>Welcome, {user.firstName}!</h1>
    </>
  );
}