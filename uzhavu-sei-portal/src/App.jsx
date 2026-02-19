import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import FarmerDashboard from './pages/Farmer/Dashboard';
import AddCrop from './pages/Farmer/AddCrop';
import AddMachinery from './pages/Farmer/AddMachinery';
import ClusterOverview from './pages/Farmer/ClusterOverview';
import Booking from './pages/Farmer/Booking';
import MyCrops from './pages/Farmer/MyCrops';
import Profile from './pages/Farmer/Profile';
import BuyerDashboard from './pages/Buyer/Dashboard';
import Layout from './components/Layout';
import { useAuth } from './context/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their own dashboard if authorized but wrong role
    return <Navigate to={user.role === 'farmer' ? '/farmer/dashboard' : '/buyer/dashboard'} replace />;
  }

  return children;
};

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Main Layout Wrapper */}
      <Route path="/" element={<Layout />}>
        {/* Redirect root to appropriate dashboard or login */}
        <Route index element={<Navigate to="/login" replace />} />

        {/* Farmer Routes */}
        <Route
          path="farmer/*"
          element={
            <ProtectedRoute allowedRoles={['farmer']}>
              <Routes>
                <Route path="dashboard" element={<FarmerDashboard />} />
                <Route path="add-crop" element={<AddCrop />} />
                <Route path="add-machinery" element={<AddMachinery />} />
                <Route path="cluster" element={<ClusterOverview />} />
                <Route path="booking" element={<Booking />} />
                <Route path="my-crops" element={<MyCrops />} />
                <Route path="profile" element={<Profile />} />
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* Buyer Routes */}
        <Route
          path="buyer/*"
          element={
            <ProtectedRoute allowedRoles={['buyer']}>
              <Routes>
                <Route path="dashboard" element={<BuyerDashboard />} />
                <Route path="profile" element={<Profile />} />
                {/* Add other buyer routes here */}
              </Routes>
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Fallback for unknown routes */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
