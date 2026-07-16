import { useEffect, useState, useCallback } from 'react'
import { toast } from 'react-toastify'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { SkeletonTable } from '../../components/common/SkeletonLoader'
import { getAccounts } from '../../api/accountApi'
import { getHistory } from '../../api/transactionApi'
import { getErrorMessage } from '../../api/axios'
import { formatCurrency, formatDate } from '../../utils/formatters'

const Transactions = () => {
  const [accounts, setAccounts] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [filters, setFilters] = useState({
    accountNumber: '',
    type: '',
    startDate: '',
    endDate: '',
    search: '',
  })

  useEffect(() => {
    getAccounts()
      .then(({ data }) => {
        setAccounts(data)
        if (data.length > 0) {
          setFilters((f) => ({ ...f, accountNumber: data[0].accountNumber }))
        }
      })
      .catch((err) => toast.error(getErrorMessage(err)))
  }, [])

  const loadTransactions = useCallback(async () => {
    if (!filters.accountNumber) return
    setLoading(true)
    try {
      const { data } = await getHistory({
        accountNumber: filters.accountNumber,
        type: filters.type,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        page,
        size: 10,
      })
      setTransactions(data.content || [])
      setTotalPages(data.totalPages || 0)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [filters.accountNumber, filters.type, filters.startDate, filters.endDate, page])

  useEffect(() => {
    loadTransactions()
  }, [loadTransactions])

  const filtered = transactions.filter((tx) => {
    if (!filters.search) return true
    const q = filters.search.toLowerCase()
    return (
      tx.transactionReference?.toLowerCase().includes(q) ||
      tx.description?.toLowerCase().includes(q) ||
      tx.senderAccountNumber?.includes(q) ||
      tx.receiverAccountNumber?.includes(q)
    )
  })

  return (
    <DashboardLayout title="Transaction History">
      <div className="card">
        <div className="filters-bar">
          <div className="form-group">
            <label className="form-label">Account</label>
            <select
              className="form-control"
              value={filters.accountNumber}
              onChange={(e) => { setFilters({ ...filters, accountNumber: e.target.value }); setPage(0) }}
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.accountNumber}>{acc.accountNumber}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Type</label>
            <select
              className="form-control"
              value={filters.type}
              onChange={(e) => { setFilters({ ...filters, type: e.target.value }); setPage(0) }}
            >
              <option value="">All Types</option>
              <option value="CREDIT">Credit</option>
              <option value="DEBIT">Debit</option>
              <option value="TRANSFER">Transfer</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">From Date</label>
            <input
              type="date"
              className="form-control"
              value={filters.startDate}
              onChange={(e) => { setFilters({ ...filters, startDate: e.target.value }); setPage(0) }}
            />
          </div>
          <div className="form-group">
            <label className="form-label">To Date</label>
            <input
              type="date"
              className="form-control"
              value={filters.endDate}
              onChange={(e) => { setFilters({ ...filters, endDate: e.target.value }); setPage(0) }}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Search</label>
            <input
              type="text"
              className="form-control"
              placeholder="Reference, description..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
        </div>

        {loading ? (
          <SkeletonTable rows={8} />
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-title">No transactions found</p>
            <p>Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Type</th>
                    <th>From / To</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((tx) => (
                    <tr key={tx.id}>
                      <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{tx.transactionReference}</td>
                      <td>
                        <span className={`badge badge-${tx.transactionType.toLowerCase()}`}>
                          {tx.transactionType}
                        </span>
                      </td>
                      <td style={{ fontSize: 12 }}>
                        {tx.senderAccountNumber && <div>From: {tx.senderAccountNumber}</div>}
                        {tx.receiverAccountNumber && <div>To: {tx.receiverAccountNumber}</div>}
                      </td>
                      <td className={tx.transactionType === 'CREDIT' ? 'amount-credit' : 'amount-debit'}>
                        {formatCurrency(tx.amount)}
                      </td>
                      <td>
                        <span className={`badge badge-${tx.status.toLowerCase()}`}>{tx.status}</span>
                      </td>
                      <td>{formatDate(tx.createdAt)}</td>
                      <td>{tx.description || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <span className="pagination-info">Page {page + 1} of {Math.max(totalPages, 1)}</span>
              <button className="btn btn-outline btn-sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
                Previous
              </button>
              <button className="btn btn-outline btn-sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

export default Transactions
