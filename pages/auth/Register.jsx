import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'
import { getErrorMessage } from '../../api/axios'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const Register = () => {
  const { register: registerUser, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, watch, formState: { errors } } = useForm()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const user = await registerUser(data)
      toast.success('Account created successfully! Welcome to SecureBank.')
      navigate('/dashboard')
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
          Join thousands of customers who trust SecureBank for their everyday banking needs.
        </p>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-container">
          <h1 className="auth-form-title">Create Account</h1>
          <p className="auth-form-subtitle">Register to start managing your finances online</p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className={`form-control ${errors.fullName ? 'error' : ''}`}
                placeholder="John Doe"
                {...register('fullName', { required: 'Full name is required', minLength: { value: 2, message: 'Minimum 2 characters' } })}
              />
              {errors.fullName && <p className="form-error">{errors.fullName.message}</p>}
            </div>

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
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className={`form-control ${errors.phoneNumber ? 'error' : ''}`}
                placeholder="9876543210"
                {...register('phoneNumber', {
                  required: 'Phone number is required',
                  pattern: { value: /^[0-9]{10}$/, message: 'Must be 10 digits' },
                })}
              />
              {errors.phoneNumber && <p className="form-error">{errors.phoneNumber.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className={`form-control ${errors.password ? 'error' : ''}`}
                placeholder="Minimum 6 characters"
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
              />
              {errors.password && <p className="form-error">{errors.password.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="Re-enter password"
                {...register('confirmPassword', {
                  required: 'Please confirm password',
                  validate: (val) => val === watch('password') || 'Passwords do not match',
                })}
              />
              {errors.confirmPassword && <p className="form-error">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? <LoadingSpinner size="sm" /> : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
