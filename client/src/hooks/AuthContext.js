import {createContext, useContext, useState, useEffect} from 'react';
import BASE_URL from '../config';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (userData) => {
    setUser(userData);
  }

  const logout = () => {
    setUser(null);
  }

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/auth/session`, {
          credentials: 'include',
        });

        if (res.ok) {
          const resJson = await res.json();
          // console.log(resJson);
          setUser({
            firstName: resJson.firstName,
            userId: resJson.userId,
            isLoggedIn: resJson.isLoggedIn,
          });
        } else {
          setUser(null);
        }
      } catch (err) {
        console.log('Error:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);


  return (
    <AuthContext.Provider value = {{user, login, logout, loading}}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext);
}