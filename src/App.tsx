import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './lib/store/authStore';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import GroupPage from './pages/GroupPage';
import RecipePage from './pages/RecipePage';
import NotificationsPage from './pages/NotificationsPage';
import { useEffect } from 'react';
import AOS from 'aos';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

function App() {
  const { loadUser, isLoading } = useAuthStore();

  useEffect(() => {
    AOS.init({
      duration: 600,
      once: true,
      easing: 'ease-out',
    });
    
    loadUser();
  }, [loadUser]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/" element={<DashboardPage />} />
          <Route path="/group/:id" element={<GroupPage />} />
          <Route path="/recipe/:id" element={<RecipePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<div className="p-6">Profile Page (TODO)</div>} />
          <Route path="/settings" element={<div className="p-6">Settings Page (TODO)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
