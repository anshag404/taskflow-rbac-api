import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar" id="main-navbar">
      <Link to="/" className="navbar-brand">
        <span className="logo-icon">⚡</span>
        TaskFlow
      </Link>

      <div className="navbar-links">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className={isActive('/dashboard')}>
              Dashboard
            </Link>
            <div className="nav-user">
              <div className="nav-user-info">
                <div className="nav-user-name">{user?.name}</div>
                <div className="nav-user-role">{user?.role}</div>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={handleLogout}
                id="logout-btn"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className={isActive('/login')}>
              Login
            </Link>
            <Link to="/register" className={isActive('/register')}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
