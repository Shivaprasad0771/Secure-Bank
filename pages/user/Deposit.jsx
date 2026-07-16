import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { getAccounts } from '../../api/accountApi'
import { deposit } from '../../api/transactionApi'
import { getErrorMessage } from '../../api/axios'
import { formatCurrency } from '../../utils/formatters'

const Deposit = () => {
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
      await deposit(pendingData)
      toast.success('Deposit successful!')
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
    <DashboardLayout title="Deposit Money">
      <div className="card form-card">
        <h2 className="card-title" style={{ marginBottom: 4 }}>Deposit Funds</h2>
        <p className="card-subtitle" style={{ marginBottom: 24 }}>Add money to your account</p>

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
            <label className="form-label">Deposit Amount (₹)</label>
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
            <input type="text" className="form-control" placeholder="Cash deposit" {...register('description')} />
          </div>

          <button type="submit" className="btn btn-success btn-block">Review Deposit</button>
        </form>
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Confirm Deposit"
        message={pendingData ? `Deposit ${formatCurrency(pendingData.amount)} into account ${pendingData.accountNumber}?` : ''}
        confirmLabel="Deposit"
        variant="success"
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
        loading={loading}
      />
    </DashboardLayout>
  )
}

export default Deposit
