import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

// Components
import NavBar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MenuPage from './pages/MenuPage';
import BookingsPage from './pages/BookingsPage';
import BillsPage from './pages/BillsPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <main className="py-3">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute requireAdmin={false} />}>
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/bookings" element={<BookingsPage />} />
              <Route path="/bills" element={<BillsPage />} />
            </Route>
            
            {/* Admin Routes */}
            <Route element={<ProtectedRoute requireAdmin={true} />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
