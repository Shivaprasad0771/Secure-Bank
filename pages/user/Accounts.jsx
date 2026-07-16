import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Plus, Wallet } from 'lucide-react'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { SkeletonCard } from '../../components/common/SkeletonLoader'
import { getAccounts, createAccount } from '../../api/accountApi'
import { getErrorMessage } from '../../api/axios'
import { formatCurrency, formatDateShort, accountTypeLabel } from '../../utils/formatters'

const Accounts = () => {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const loadAccounts = async () => {
    try {
      const { data } = await getAccounts()
      setAccounts(data)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadAccounts() }, [])

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      await createAccount(data)
      toast.success('Account created successfully!')
      reset()
      setShowForm(false)
      setLoading(true)
      await loadAccounts()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardLayout title="My Accounts">
      <div className="card-header" style={{ marginBottom: 20 }}>
        <div>
          <h2 className="card-title">Account Management</h2>
          <p className="card-subtitle">View and manage your bank accounts</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={16} /> New Account
        </button>
      </div>

      {showForm && (
        <div className="card form-card" style={{ marginBottom: 24 }}>
          <h3 className="card-title" style={{ marginBottom: 16 }}>Create New Account</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label className="form-label">Account Type</label>
              <select className="form-control" {...register('accountType', { required: true })}>
                <option value="SAVINGS">Savings Account</option>
                <option value="CURRENT">Current Account</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Account'}
              </button>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="account-grid">
          {[1, 2].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : accounts.length === 0 ? (
        <div className="card empty-state">
          <Wallet size={48} className="empty-state-icon" />
          <p className="empty-state-title">No accounts yet</p>
          <p>Create your first bank account to get started</p>
        </div>
      ) : (
        <div className="account-grid">
          {accounts.map((acc) => (
            <div key={acc.id} className="account-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span className={`badge badge-${acc.status.toLowerCase()}`}>{acc.status}</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{accountTypeLabel(acc.accountType)}</span>
              </div>
              <p className="account-number">{acc.accountNumber}</p>
              <p style={{ fontSize: 24, fontWeight: 700, margin: '12px 0' }}>{formatCurrency(acc.balance)}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Opened {formatDateShort(acc.createdAt)}</p>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}

export default Accounts
