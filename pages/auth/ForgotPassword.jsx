import { Link } from 'react-router-dom'
import { Mail, ArrowLeft } from 'lucide-react'

const ForgotPassword = () => (
  <div className="auth-layout">
    <div className="auth-brand-panel">
      <div className="auth-brand-logo">SecureBank</div>
      <p className="auth-brand-tagline">We'll help you recover access to your account securely.</p>
    </div>

    <div className="auth-form-panel">
      <div className="auth-form-container">
        <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', marginBottom: '24px' }}>
          <ArrowLeft size={16} /> Back to login
        </Link>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ width: 64, height: 64, background: 'var(--primary-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--primary)' }}>
            <Mail size={28} />
          </div>
          <h1 className="auth-form-title">Forgot Password</h1>
          <p className="auth-form-subtitle">
            Enter your registered email address and we'll send you a password reset link.
          </p>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-control" placeholder="you@example.com" />
          </div>
          <button type="button" className="btn btn-primary btn-block" onClick={() => alert('Password reset is a demo UI feature. Contact your administrator for account recovery.')}>
            Send Reset Link
          </button>
        </form>

        <div className="auth-demo-note" style={{ marginTop: '24px' }}>
          This is a demo interface. In a production system, this would send a secure reset link via email with token expiration.
        </div>
      </div>
    </div>
  </div>
)

export default ForgotPassword
