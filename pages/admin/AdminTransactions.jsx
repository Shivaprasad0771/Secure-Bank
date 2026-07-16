import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { SkeletonTable } from '../../components/common/SkeletonLoader'
import { getTransactions } from '../../api/adminApi'
import { getErrorMessage } from '../../api/axios'
import { formatCurrency, formatDate } from '../../utils/formatters'

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await getTransactions({ page, size: 15 })
      setTransactions(data.content || [])
      setTotalPages(data.totalPages || 0)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [page])

  return (
    <DashboardLayout title="All Transactions">
      <div className="card">
        {loading ? (
          <SkeletonTable rows={10} />
        ) : (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Type</th>
                    <th>Sender</th>
                    <th>Receiver</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{tx.transactionReference}</td>
                      <td><span className={`badge badge-${tx.transactionType.toLowerCase()}`}>{tx.transactionType}</span></td>
                      <td style={{ fontSize: 12 }}>{tx.senderAccountNumber || '—'}</td>
                      <td style={{ fontSize: 12 }}>{tx.receiverAccountNumber || '—'}</td>
                      <td className={tx.transactionType === 'CREDIT' ? 'amount-credit' : 'amount-debit'}>
                        {formatCurrency(tx.amount)}
                      </td>
                      <td><span className={`badge badge-${tx.status.toLowerCase()}`}>{tx.status}</span></td>
                      <td>{formatDate(tx.createdAt)}</td>
                      <td>{tx.description || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pagination">
              <span className="pagination-info">Page {page + 1} of {Math.max(totalPages, 1)}</span>
              <button className="btn btn-outline btn-sm" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
              <button className="btn btn-outline btn-sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>Next</button>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

export default AdminTransactions
