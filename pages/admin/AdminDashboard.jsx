import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Users, Wallet, History, Shield } from 'lucide-react'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { SkeletonCard } from '../../components/common/SkeletonLoader'
import { getStats, getUsers, getTransactions } from '../../api/adminApi'
import { getErrorMessage } from '../../api/axios'
import { formatCurrency, formatDate } from '../../utils/formatters'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [recentUsers, setRecentUsers] = useState([])
  const [recentTx, setRecentTx] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getStats(),
      getUsers({ page: 0, size: 5 }),
      getTransactions({ page: 0, size: 5 }),
    ])
      .then(([statsRes, usersRes, txRes]) => {
        setStats(statsRes.data)
        setRecentUsers(usersRes.data.content || [])
        setRecentTx(txRes.data.content || [])
      })
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  return (
    <DashboardLayout title="Admin Dashboard">
      {loading ? (
        <div className="stats-grid">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <>
          <div className="balance-card" style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <Shield size={24} />
              <p className="balance-label">Administrator Control Panel</p>
            </div>
            <p style={{ fontSize: 14, opacity: 0.85 }}>Manage users, accounts, and monitor all banking transactions</p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon stat-icon-blue"><Users size={22} /></div>
              <div>
                <p className="stat-label">Total Users</p>
                <p className="stat-value">{stats?.totalUsers ?? 0}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon stat-icon-green"><Wallet size={22} /></div>
              <div>
                <p className="stat-label">Total Accounts</p>
                <p className="stat-value">{stats?.totalAccounts ?? 0}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon stat-icon-orange"><History size={22} /></div>
              <div>
                <p className="stat-label">Total Transactions</p>
                <p className="stat-value">{stats?.totalTransactions ?? 0}</p>
              </div>
            </div>
          </div>

          <div className="grid-2">
            <div className="card">
              <h2 className="card-title" style={{ marginBottom: 16 }}>Recent Users</h2>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr><th>Name</th><th>Email</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((u) => (
                      <tr key={u.id}>
                        <td>{u.fullName}</td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`badge badge-${u.enabled ? 'active' : 'inactive'}`}>
                            {u.enabled ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card">
              <h2 className="card-title" style={{ marginBottom: 16 }}>Recent Transactions</h2>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr><th>Type</th><th>Amount</th><th>Date</th></tr>
                  </thead>
                  <tbody>
                    {recentTx.map((tx) => (
                      <tr key={tx.id}>
                        <td><span className={`badge badge-${tx.transactionType.toLowerCase()}`}>{tx.transactionType}</span></td>
                        <td>{formatCurrency(tx.amount)}</td>
                        <td>{formatDate(tx.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  )
}

export default AdminDashboard
