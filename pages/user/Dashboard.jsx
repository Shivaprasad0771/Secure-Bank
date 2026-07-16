import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Wallet, TrendingUp, TrendingDown, ArrowLeftRight,
  ArrowDownToLine, ArrowUpFromLine, History,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { toast } from 'react-toastify'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { SkeletonCard, SkeletonTable } from '../../components/common/SkeletonLoader'
import { getAccounts } from '../../api/accountApi'
import { getHistory } from '../../api/transactionApi'
import { getErrorMessage } from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import { formatCurrency, formatDate, accountTypeLabel } from '../../utils/formatters'

const quickActions = [
  { to: '/transfer', icon: ArrowLeftRight, label: 'Transfer' },
  { to: '/deposit', icon: ArrowDownToLine, label: 'Deposit' },
  { to: '/withdraw', icon: ArrowUpFromLine, label: 'Withdraw' },
  { to: '/transactions', icon: History, label: 'History' },
]

const Dashboard = () => {
  const { user } = useAuth()
  const [accounts, setAccounts] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  const primaryAccount = accounts[0]

  useEffect(() => {
    const load = async () => {
      try {
        const { data: accData } = await getAccounts()
        setAccounts(accData)
        if (accData.length > 0) {
          const { data: txData } = await getHistory({
            accountNumber: accData[0].accountNumber,
            page: 0,
            size: 50,
          })
          setTransactions(txData.content || [])
        }
      } catch (err) {
        toast.error(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const stats = useMemo(() => {
    let credited = 0
    let debited = 0
    transactions.forEach((tx) => {
      if (!primaryAccount) return
      const isReceiver = tx.receiverAccountNumber === primaryAccount.accountNumber
      const isSender = tx.senderAccountNumber === primaryAccount.accountNumber
      if (tx.transactionType === 'CREDIT' || (tx.transactionType === 'TRANSFER' && isReceiver)) {
        credited += Number(tx.amount)
      }
      if (tx.transactionType === 'DEBIT' || (tx.transactionType === 'TRANSFER' && isSender)) {
        debited += Number(tx.amount)
      }
    })
    return { credited, debited }
  }, [transactions, primaryAccount])

  const chartData = useMemo(() => {
    const months = {}
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = d.toLocaleString('en-IN', { month: 'short' })
      months[key] = { month: key, spending: 0 }
    }
    transactions.forEach((tx) => {
      if (!primaryAccount || tx.senderAccountNumber !== primaryAccount.accountNumber) return
      if (tx.transactionType === 'DEBIT' || tx.transactionType === 'TRANSFER') {
        const d = new Date(tx.createdAt)
        const key = d.toLocaleString('en-IN', { month: 'short' })
        if (months[key]) months[key].spending += Number(tx.amount)
      }
    })
    return Object.values(months)
  }, [transactions, primaryAccount])

  return (
    <DashboardLayout title="Dashboard">
      {loading ? (
        <>
          <SkeletonCard />
          <div className="stats-grid">
            {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
          </div>
          <SkeletonTable rows={5} />
        </>
      ) : (
        <>
          <div className="balance-card">
            <p className="balance-label">Available Balance</p>
            <p className="balance-amount">
              {primaryAccount ? formatCurrency(primaryAccount.balance) : formatCurrency(0)}
            </p>
            <div className="balance-meta">
              <span>Welcome, {user?.fullName}</span>
              {primaryAccount && (
                <>
                  <span>{accountTypeLabel(primaryAccount.accountType)}</span>
                  <span>Acc: {primaryAccount.accountNumber}</span>
                </>
              )}
            </div>
          </div>

          {!primaryAccount && (
            <div className="card" style={{ marginBottom: 24, textAlign: 'center' }}>
              <p style={{ marginBottom: 12 }}>You don't have a bank account yet.</p>
              <Link to="/accounts" className="btn btn-primary">Create Account</Link>
            </div>
          )}

          <div className="quick-actions">
            {quickActions.map(({ to, icon: Icon, label }) => (
              <Link key={to} to={to} className="quick-action-btn">
                <span className="quick-action-icon"><Icon size={20} /></span>
                {label}
              </Link>
            ))}
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon stat-icon-blue"><Wallet size={22} /></div>
              <div>
                <p className="stat-label">Account Balance</p>
                <p className="stat-value">{primaryAccount ? formatCurrency(primaryAccount.balance) : '—'}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon stat-icon-green"><TrendingUp size={22} /></div>
              <div>
                <p className="stat-label">Total Credited</p>
                <p className="stat-value amount-credit">{formatCurrency(stats.credited)}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon stat-icon-red"><TrendingDown size={22} /></div>
              <div>
                <p className="stat-label">Total Debited</p>
                <p className="stat-value amount-debit">{formatCurrency(stats.debited)}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon stat-icon-orange"><History size={22} /></div>
              <div>
                <p className="stat-label">Transactions</p>
                <p className="stat-value">{transactions.length}</p>
              </div>
            </div>
          </div>

          <div className="grid-2">
            <div className="card">
              <div className="card-header">
                <div>
                  <h2 className="card-title">Monthly Spending</h2>
                  <p className="card-subtitle">Last 6 months overview</p>
                </div>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${v}`} />
                    <Tooltip formatter={(v) => formatCurrency(v)} />
                    <Bar dataKey="spending" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div>
                  <h2 className="card-title">Recent Transactions</h2>
                  <p className="card-subtitle">Latest activity on your account</p>
                </div>
                <Link to="/transactions" className="btn btn-outline btn-sm">View All</Link>
              </div>
              {transactions.length === 0 ? (
                <div className="empty-state">
                  <p>No transactions yet</p>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.slice(0, 5).map((tx) => (
                        <tr key={tx.id}>
                          <td>
                            <span className={`badge badge-${tx.transactionType.toLowerCase()}`}>
                              {tx.transactionType}
                            </span>
                          </td>
                          <td className={tx.transactionType === 'CREDIT' ? 'amount-credit' : 'amount-debit'}>
                            {formatCurrency(tx.amount)}
                          </td>
                          <td>{formatDate(tx.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  )
}

export default Dashboard
