import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Target, 
  ShieldAlert, 
  Briefcase, 
  LogOut, 
  User as UserIcon,
  Search
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const SidebarLink = ({ to, icon: Icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' 
        : 'hover:bg-slate-100'
    }`}
    style={!active ? { color: 'var(--text-secondary)' } : {}}
  >
    <Icon size={18} />
    <span className="text-sm font-medium">{label}</span>
  </Link>
);

const Layout = ({ user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen transition-colors duration-300" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Sidebar */}
      <aside 
        className="w-60 flex flex-col p-5 sticky top-0 h-screen transition-colors duration-300 border-r"
        style={{ backgroundColor: 'var(--sidebar-bg)', borderColor: 'var(--sidebar-border)' }}
      >
        <div className="flex items-center space-x-3 mb-8 px-2">
          <div className="bg-primary-600 p-2 rounded-lg text-white">
            <TrendingUp size={20} />
          </div>
          <span className="text-lg font-bold">SmartFund</span>
        </div>


        <nav className="flex-1 space-y-2">
          <SidebarLink to="/" icon={LayoutDashboard} label="Dashboard" active={location.pathname === '/'} />
          <SidebarLink to="/funds" icon={Search} label="Search Funds" active={location.pathname === '/funds'} />
          <SidebarLink to="/risk" icon={ShieldAlert} label="Risk Analyzer" active={location.pathname === '/risk'} />
          <SidebarLink to="/portfolio" icon={Briefcase} label="My Portfolio" active={location.pathname === '/portfolio'} />
          <SidebarLink to="/goals" icon={Target} label="Goal Planner" active={location.pathname === '/goals'} />
        </nav>

        <div className="mt-auto pt-6 border-t" style={{ borderColor: 'var(--border-primary)' }}>
          <div className="flex items-center space-x-3 px-3 py-2 mb-4">
            <div className="p-2 rounded-full" style={{ backgroundColor: 'var(--nav-hover)' }}>
              <UserIcon size={18} />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <p className="text-[10px] truncate" style={{ color: 'var(--text-secondary)' }}>{user.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2.5 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors text-sm font-medium"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
