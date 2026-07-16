import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { getAccounts } from '../../api/accountApi'
import { getBeneficiaries } from '../../api/beneficiaryApi'
import { transfer } from '../../api/transactionApi'
import { getErrorMessage } from '../../api/axios'
import { formatCurrency } from '../../utils/formatters'

const Transfer = () => {
  const [accounts, setAccounts] = useState([])
  const [beneficiaries, setBeneficiaries] = useState([])
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingData, setPendingData] = useState(null)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm()

  useEffect(() => {
    Promise.all([getAccounts(), getBeneficiaries()])
      .then(([accRes, benRes]) => {
        setAccounts(accRes.data)
        setBeneficiaries(benRes.data)
        if (accRes.data.length > 0) {
          setValue('senderAccountNumber', accRes.data[0].accountNumber)
        }
      })
      .catch((err) => toast.error(getErrorMessage(err)))
  }, [setValue])

  const onSubmit = (data) => {
    setPendingData(data)
    setConfirmOpen(true)
  }

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await transfer(pendingData)
      toast.success('Transfer completed successfully!')
      setConfirmOpen(false)
      setPendingData(null)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const selectBeneficiary = (ben) => {
    setValue('receiverAccountNumber', ben.accountNumber)
  }

  return (
    <DashboardLayout title="Money Transfer">
      <div className="grid-2">
        <div className="card form-card">
          <h2 className="card-title" style={{ marginBottom: 4 }}>Transfer Funds</h2>
          <p className="card-subtitle" style={{ marginBottom: 24 }}>Send money securely to another account</p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label className="form-label">From Account</label>
              <select
                className="form-control"
                {...register('senderAccountNumber', { required: 'Select sender account' })}
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.accountNumber}>
                    {acc.accountNumber} — {formatCurrency(acc.balance)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Receiver Account Number</label>
              <input
                type="text"
                className={`form-control ${errors.receiverAccountNumber ? 'error' : ''}`}
                placeholder="Enter receiver account number"
                {...register('receiverAccountNumber', { required: 'Receiver account is required' })}
              />
              {errors.receiverAccountNumber && <p className="form-error">{errors.receiverAccountNumber.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Amount (₹)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                className={`form-control ${errors.amount ? 'error' : ''}`}
                placeholder="0.00"
                {...register('amount', {
                  required: 'Amount is required',
                  min: { value: 0.01, message: 'Amount must be greater than 0' },
                })}
              />
              {errors.amount && <p className="form-error">{errors.amount.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Description (optional)</label>
              <input
                type="text"
                className="form-control"
                placeholder="Payment for..."
                {...register('description')}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block">Review Transfer</button>
          </form>
        </div>

        <div className="card">
          <h2 className="card-title" style={{ marginBottom: 16 }}>Saved Beneficiaries</h2>
          {beneficiaries.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No beneficiaries saved. Add them from the Beneficiaries page.</p>
          ) : (
            <div className="beneficiary-list">
              {beneficiaries.map((ben) => (
                <div key={ben.id} className="beneficiary-item" style={{ cursor: 'pointer' }} onClick={() => selectBeneficiary(ben)}>
                  <div className="beneficiary-info">
                    <strong>{ben.beneficiaryName}</strong>
                    <span>{ben.accountNumber}</span>
                  </div>
                  <button type="button" className="btn btn-outline btn-sm">Select</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Confirm Transfer"
        message={
          pendingData
            ? `Transfer ${formatCurrency(pendingData.amount)} from ${pendingData.senderAccountNumber} to ${pendingData.receiverAccountNumber}?`
            : ''
        }
        confirmLabel="Transfer Now"
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
        loading={loading}
      />
    </DashboardLayout>
  )
}

export default Transfer
