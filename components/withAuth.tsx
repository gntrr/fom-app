import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import LoadingScreen from './LoadingScreen';

const withAuth = (WrappedComponent) => {
  const Wrapper = (props) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(null); // Track authentication status

    useEffect(() => {
      const checkAuth = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
          // If no token is found, redirect to login
          router.replace('/login');
        } else {
          try {
            const response = await fetch('/api/user/profile', {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });

            if (response.status === 401) {
              // If the response status is 401, reset the token and redirect to login
              localStorage.removeItem('token');
              router.replace('/login');
            } else if (response.ok) {
              // If the response is ok, set authenticated to true
              setIsAuthenticated(true);
            } else {
              // Handle other response statuses if needed
              console.error('Failed to verify authentication');
            }
          } catch (error) {
            console.error('Error checking authentication:', error);
          }
        }
      };

      checkAuth();
    }, [router]);

    if (isAuthenticated === null) {
      // While checking for authentication, render a loading screen or return null
      return <LoadingScreen />;
    }

    // Render the wrapped component once authentication is verified
    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;