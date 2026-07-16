import { useEffect, useState, useCallback } from 'react'
import { toast } from 'react-toastify'
import { Search } from 'lucide-react'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { SkeletonTable } from '../../components/common/SkeletonLoader'
import { getUsers, toggleUserStatus } from '../../api/adminApi'
import { getErrorMessage } from '../../api/axios'
import { formatDateShort } from '../../utils/formatters'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await getUsers({ page, size: 10, search: search || undefined })
      setUsers(data.content || [])
      setTotalPages(data.totalPages || 0)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => { load() }, [load])

  const handleToggle = async (userId) => {
    try {
      await toggleUserStatus(userId)
      toast.success('User status updated')
      load()
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <DashboardLayout title="Manage Users">
      <div className="card">
        <div className="filters-bar">
          <div className="form-group" style={{ flex: 1, minWidth: 240 }}>
            <label className="form-label">Search Users</label>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: 36 }}
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0) }}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <SkeletonTable rows={8} />
        ) : (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.fullName}</td>
                      <td>{u.email}</td>
                      <td>{u.phoneNumber}</td>
                      <td>{u.role}</td>
                      <td>
                        <span className={`badge badge-${u.enabled ? 'active' : 'inactive'}`}>
                          {u.enabled ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>{formatDateShort(u.createdAt)}</td>
                      <td>
                        {u.role !== 'ADMIN' && (
                          <button className="btn btn-outline btn-sm" onClick={() => handleToggle(u.id)}>
                            {u.enabled ? 'Deactivate' : 'Activate'}
                          </button>
                        )}
                      </td>
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

export default AdminUsers
