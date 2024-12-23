// src/App.jsx
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import { NotificationsProvider } from './contexts/NotificationsContext';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { FamilyProvider } from './contexts/FamilyContext';
import { ShoppingProvider } from './contexts/ShoppingContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import Notifications from './components/Notifications';

// Auth Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import JoinFamily from './pages/JoinFamily';

// Protected Pages
import ShoppingList from './components/shopping/ShoppingList';
import Settings from './pages/Settings';
import Family from './pages/Family';

function App() {
  return (
    <Router>
      <NotificationsProvider>
        <AuthProvider>
          <UserProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/signup" element={<Signup />} />
              <Route path="/join/:inviteCode" element={<JoinFamily />} />
              <Route path="/login" element={<Login />} />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <FamilyProvider>
                      <ShoppingProvider>
                        <AppLayout>
                          <Routes>
                            <Route index element={<ShoppingList />} />
                            <Route path="settings" element={<Settings />} />
                            <Route path="family" element={<Family />} />
                          </Routes>
                        </AppLayout>
                      </ShoppingProvider>
                    </FamilyProvider>
                  </ProtectedRoute>
                }
              >
                {/* This allows nested routes to work correctly */}
                <Route index element={<ShoppingList />} />
                <Route path="settings" element={<Settings />} />
                <Route path="family" element={<Family />} />
              </Route>

              {/* Remove or modify the catch-all route */}
              {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
            </Routes>
            <Notifications />
          </UserProvider>
        </AuthProvider>
      </NotificationsProvider>
    </Router>
  );
}

export default App;