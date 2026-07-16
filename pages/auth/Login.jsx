import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Shield, Lock, Smartphone, TrendingUp } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getErrorMessage } from '../../api/axios'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const Login = () => {
  const { login, isAuthenticated, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? '/admin' : '/dashboard', { replace: true })
    }
  }, [isAuthenticated, isAdmin, navigate])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const user = await login(data)
      toast.success(`Welcome back, ${user.fullName}!`)
      navigate(user.role === 'ADMIN' ? '/admin' : '/dashboard')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-layout">
      <div className="auth-brand-panel">
        <div className="auth-brand-logo">SecureBank</div>
        <p className="auth-brand-tagline">
          Your trusted partner for secure, seamless online banking. Manage accounts, transfer funds, and track finances anytime.
        </p>
        <ul className="auth-features">
          <li>
            <span className="auth-feature-icon"><Shield size={16} /></span>
            Bank-grade security with JWT authentication
          </li>
          <li>
            <span className="auth-feature-icon"><Lock size={16} /></span>
            Encrypted transactions & BCrypt password protection
          </li>
          <li>
            <span className="auth-feature-icon"><Smartphone size={16} /></span>
            Responsive design for all devices
          </li>
          <li>
            <span className="auth-feature-icon"><TrendingUp size={16} /></span>
            Real-time balance & transaction tracking
          </li>
        </ul>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-container">
          <h1 className="auth-form-title">Sign In</h1>
          <p className="auth-form-subtitle">Enter your credentials to access your account</p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className={`form-control ${errors.email ? 'error' : ''}`}
                placeholder="you@example.com"
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && <p className="form-error">{errors.email.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className={`form-control ${errors.password ? 'error' : ''}`}
                placeholder="Enter your password"
                {...register('password', { required: 'Password is required' })}
              />
              {errors.password && <p className="form-error">{errors.password.message}</p>}
            </div>

            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
              <Link to="/forgot-password">Forgot password?</Link>
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? <LoadingSpinner size="sm" /> : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account? <Link to="/register">Create one</Link>
          </div>

          <div className="auth-demo-note">
            <strong>Demo accounts:</strong><br />
            Admin: admin@securebank.com / admin123<br />
            Register a new user account to test customer features
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
