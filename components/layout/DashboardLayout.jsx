import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  ArrowDownToLine,
  ArrowUpFromLine,
  History,
  Users,
  UserCircle,
  Shield,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getInitials } from '../../utils/formatters'

const userLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/accounts', icon: Wallet, label: 'Accounts' },
  { to: '/transfer', icon: ArrowLeftRight, label: 'Transfer' },
  { to: '/deposit', icon: ArrowDownToLine, label: 'Deposit' },
  { to: '/withdraw', icon: ArrowUpFromLine, label: 'Withdraw' },
  { to: '/transactions', icon: History, label: 'Transactions' },
  { to: '/beneficiaries', icon: Users, label: 'Beneficiaries' },
  { to: '/profile', icon: UserCircle, label: 'Profile' },
]

const adminLinks = [
  { to: '/admin', icon: Shield, label: 'Admin Dashboard' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/accounts', icon: Wallet, label: 'Accounts' },
  { to: '/admin/transactions', icon: History, label: 'Transactions' },
]

const Sidebar = ({ mobileOpen, onClose }) => {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const links = isAdmin ? adminLinks : userLinks

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <div className={`sidebar-overlay ${mobileOpen ? 'open' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand">
            <div className="brand-icon">SB</div>
            <div>
              <span className="brand-name">SecureBank</span>
              <span className="brand-tagline">Online Banking</span>
            </div>
          </div>
          <button className="sidebar-close mobile-only" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-user">
          <div className="avatar">{getInitials(user?.fullName)}</div>
          <div>
            <p className="sidebar-user-name">{user?.fullName}</p>
            <p className="sidebar-user-role">{isAdmin ? 'Administrator' : 'Customer'}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard' || to === '/admin'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <button className="nav-link logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </aside>
    </>
  )
}

export const Navbar = ({ onMenuClick, title }) => {
  const { user } = useAuth()

  return (
    <header className="top-navbar">
      <div className="navbar-left">
        <button className="menu-btn mobile-only" onClick={onMenuClick}>
          <Menu size={22} />
        </button>
        <h1 className="page-title">{title}</h1>
      </div>
      <div className="navbar-right">
        <span className="navbar-greeting">Welcome, {user?.fullName?.split(' ')[0]}</span>
      </div>
    </header>
  )
}

export const DashboardLayout = ({ children, title }) => {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="dashboard-layout">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="main-content">
        <Navbar title={title} onMenuClick={() => setMobileOpen(true)} />
        <main className="page-content fade-in">{children}</main>
      </div>
    </div>
  )
}

export default Sidebar
