import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Trash2, UserPlus } from 'lucide-react'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { getBeneficiaries, addBeneficiary, deleteBeneficiary } from '../../api/beneficiaryApi'
import { getErrorMessage } from '../../api/axios'

const Beneficiaries = () => {
  const [beneficiaries, setBeneficiaries] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const load = async () => {
    try {
      const { data } = await getBeneficiaries()
      setBeneficiaries(data)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  useEffect(() => { load() }, [])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await addBeneficiary(data)
      toast.success('Beneficiary added successfully!')
      reset()
      setShowForm(false)
      load()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteBeneficiary(deleteId)
      toast.success('Beneficiary removed')
      setDeleteId(null)
      load()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout title="Beneficiaries">
      <div className="card-header" style={{ marginBottom: 20 }}>
        <div>
          <h2 className="card-title">Saved Beneficiaries</h2>
          <p className="card-subtitle">Manage recipients for quick transfers</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <UserPlus size={16} /> Add Beneficiary
        </button>
      </div>

      {showForm && (
        <div className="card form-card" style={{ marginBottom: 24 }}>
          <h3 className="card-title" style={{ marginBottom: 16 }}>Add New Beneficiary</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label className="form-label">Beneficiary Name</label>
              <input
                type="text"
                className={`form-control ${errors.beneficiaryName ? 'error' : ''}`}
                placeholder="Full name"
                {...register('beneficiaryName', { required: 'Name is required' })}
              />
              {errors.beneficiaryName && <p className="form-error">{errors.beneficiaryName.message}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Account Number</label>
              <input
                type="text"
                className={`form-control ${errors.accountNumber ? 'error' : ''}`}
                placeholder="Account number"
                {...register('accountNumber', { required: 'Account number is required' })}
              />
              {errors.accountNumber && <p className="form-error">{errors.accountNumber.message}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Bank Name (optional)</label>
              <input type="text" className="form-control" placeholder="SecureBank" {...register('bankName')} />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>Save Beneficiary</button>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        {beneficiaries.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-title">No beneficiaries yet</p>
            <p>Add beneficiaries for faster money transfers</p>
          </div>
        ) : (
          <div className="beneficiary-list">
            {beneficiaries.map((ben) => (
              <div key={ben.id} className="beneficiary-item">
                <div className="beneficiary-info">
                  <strong>{ben.beneficiaryName}</strong>
                  <span>{ben.accountNumber}{ben.bankName ? ` · ${ben.bankName}` : ''}</span>
                </div>
                <button className="btn btn-outline btn-sm" style={{ color: 'var(--danger)' }} onClick={() => setDeleteId(ben.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Remove Beneficiary"
        message="Are you sure you want to remove this beneficiary?"
        confirmLabel="Remove"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={loading}
      />
    </DashboardLayout>
  )
}

export default Beneficiaries
