import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Leagues from './pages/Leagues';
import Matches from './pages/Matches';
import GoalKings from './pages/GoalKings';
import Login from './pages/Login';

function PrivateRoute({ children }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <>
                  <Navbar />
                  <main className="container mx-auto px-4 py-8">
                    <Home />
                  </main>
                </>
              </PrivateRoute>
            }
          />
          <Route
            path="/leagues"
            element={
              <PrivateRoute>
                <>
                  <Navbar />
                  <main className="container mx-auto px-4 py-8">
                    <Leagues />
                  </main>
                </>
              </PrivateRoute>
            }
          />
          <Route
            path="/matches"
            element={
              <PrivateRoute>
                <>
                  <Navbar />
                  <main className="container mx-auto px-4 py-8">
                    <Matches />
                  </main>
                </>
              </PrivateRoute>
            }
          />
          <Route
            path="/goal-kings"
            element={
              <PrivateRoute>
                <>
                  <Navbar />
                  <main className="container mx-auto px-4 py-8">
                    <GoalKings />
                  </main>
                </>
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 