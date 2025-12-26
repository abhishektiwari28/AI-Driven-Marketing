import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard/Dashboard';
import Campaigns from './pages/Campaigns/Campaigns';
import Analytics from './pages/Analytics/Analytics';
import AIAssistant from './pages/AIAssistant/AIAssistant';
import AIMarketing from './pages/AIMarketing/AIMarketing';
import Workfront from './pages/Workfront/Workfront';
import { AuthProvider } from './context/AuthContext';
import { FilterProvider } from './context/FilterContext';
import { NotificationProvider } from './context/NotificationContext';
import { ProtectedRoute, PublicRoute } from './components/AuthRoutes';

function App() {
  return (
    <AuthProvider>
      <FilterProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              <Route path="/signup" element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              } />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<DashboardLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="campaigns" element={<Campaigns />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="ai-assistant" element={<AIAssistant />} />
                  <Route path="ai-marketing" element={<AIMarketing />} />
                  <Route path="workfront" element={<Workfront />} />
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </NotificationProvider>
      </FilterProvider>
    </AuthProvider>
  );
}

export default App;
