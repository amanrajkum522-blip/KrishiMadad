// // src/App.jsx
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import Landing from './pages/Landing';
// import Register from './pages/Register';
// import Login from './pages/Login';
// import FarmerDashboard from './pages/FarmerDashboard';
// import VendorDashboard from './pages/VendorDashboard';

// // Guard: redirects to login if not logged in
// function PrivateRoute({ children, role }) {
//   const { user } = useAuth();
//   if (!user) return <Navigate to="/login" />;
//   if (role && user.Role !== role) return <Navigate to="/" />;
//   return children;
// }

// export default function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<Landing />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/farmer" element={
//             <PrivateRoute role="farmer"><FarmerDashboard /></PrivateRoute>
//           } />
//           <Route path="/vendor" element={
//             <PrivateRoute role="vendor"><VendorDashboard /></PrivateRoute>
//           } />
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }


import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import FarmerDashboard from './pages/FarmerDashboard';
import VendorDashboard from './pages/VendorDashboard';

function PrivateRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.Role !== role) return <Navigate to="/" />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/farmer"
          element={
            <PrivateRoute role="farmer">
              <FarmerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/vendor"
          element={
            <PrivateRoute role="vendor">
              <VendorDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}