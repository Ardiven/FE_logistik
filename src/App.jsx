import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import FastBookForm from './components/FastBookForm';
import LogisticsMatrixGrid from './components/LogisticsMatrixGrid';
import Login from './pages/Login';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tps-orange"></div></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <div className="text-center mt-20 text-xl font-bold">Akses Ditolak. Anda tidak memiliki izin untuk halaman ini.</div>;
  }
  
  return children;
};

const Navigation = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  if (location.pathname === '/login') return null;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 flex items-center font-bold text-xl text-tps-orange tracking-tight">
              <span className="bg-tps-orange text-white p-2 rounded-lg mr-2">TPS</span>
              Ruang KTB
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {user?.role === 'ASTOR' && (
                <Link to="/" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-tps-orange text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                  Form Peminjaman
                </Link>
              )}
              {user?.role === 'LOGISTIK' && (
                <Link to="/logistics" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-tps-orange text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                  Dashboard Logistik
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-600 font-medium">Hi, {user.name}</span>
                <button 
                  onClick={logout}
                  className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="text-sm font-medium text-tps-orange hover:text-orange-700 transition-colors bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-lg">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col font-sans text-tps-dark bg-tps-cream">
          <Navigation />
          <main className="flex-grow w-full max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<PrivateRoute allowedRoles={['ASTOR']}><FastBookForm /></PrivateRoute>} />
              <Route path="/logistics" element={<PrivateRoute allowedRoles={['LOGISTIK']}><LogisticsMatrixGrid /></PrivateRoute>} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
