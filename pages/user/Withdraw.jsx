import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { getAccounts } from '../../api/accountApi'
import { withdraw } from '../../api/transactionApi'
import { getErrorMessage } from '../../api/axios'
import { formatCurrency } from '../../utils/formatters'

const Withdraw = () => {
  const [accounts, setAccounts] = useState([])
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingData, setPendingData] = useState(null)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, setValue, formState: { errors } } = useForm()

  useEffect(() => {
    getAccounts()
      .then(({ data }) => {
        setAccounts(data)
        if (data.length > 0) setValue('accountNumber', data[0].accountNumber)
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
      await withdraw(pendingData)
      toast.success('Withdrawal successful!')
      setConfirmOpen(false)
      const { data } = await getAccounts()
      setAccounts(data)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout title="Withdraw Money">
      <div className="card form-card">
        <h2 className="card-title" style={{ marginBottom: 4 }}>Withdraw Funds</h2>
        <p className="card-subtitle" style={{ marginBottom: 24 }}>Withdraw money from your account</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label">Select Account</label>
            <select className="form-control" {...register('accountNumber', { required: true })}>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.accountNumber}>
                  {acc.accountNumber} — Balance: {formatCurrency(acc.balance)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Withdrawal Amount (₹)</label>
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
            <input type="text" className="form-control" placeholder="ATM withdrawal" {...register('description')} />
          </div>

          <button type="submit" className="btn btn-danger btn-block">Review Withdrawal</button>
        </form>
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Confirm Withdrawal"
        message={pendingData ? `Withdraw ${formatCurrency(pendingData.amount)} from account ${pendingData.accountNumber}?` : ''}
        confirmLabel="Withdraw"
        variant="danger"
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
        loading={loading}
      />
    </DashboardLayout>
  )
}

export default Withdraw
