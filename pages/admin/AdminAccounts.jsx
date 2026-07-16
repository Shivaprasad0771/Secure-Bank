import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { SkeletonTable } from '../../components/common/SkeletonLoader'
import { getAccounts } from '../../api/adminApi'
import { getErrorMessage } from '../../api/axios'
import { formatCurrency, formatDateShort, accountTypeLabel } from '../../utils/formatters'

const AdminAccounts = () => {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await getAccounts({ page, size: 10 })
      setAccounts(data.content || [])
      setTotalPages(data.totalPages || 0)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [page])

  return (
    <DashboardLayout title="All Accounts">
      <div className="card">
        {loading ? (
          <SkeletonTable rows={8} />
        ) : (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Account Number</th>
                    <th>Owner</th>
                    <th>Type</th>
                    <th>Balance</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((acc) => (
                    <tr key={acc.id}>
                      <td style={{ fontFamily: 'monospace' }}>{acc.accountNumber}</td>
                      <td>
                        <div>{acc.ownerName}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{acc.ownerEmail}</div>
                      </td>
                      <td>{accountTypeLabel(acc.accountType)}</td>
                      <td style={{ fontWeight: 600 }}>{formatCurrency(acc.balance)}</td>
                      <td><span className={`badge badge-${acc.status.toLowerCase()}`}>{acc.status}</span></td>
                      <td>{formatDateShort(acc.createdAt)}</td>
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

export default AdminAccounts
