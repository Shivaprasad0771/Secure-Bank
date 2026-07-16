import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { getProfile, updateProfile, changePassword } from '../../api/userApi'
import { getErrorMessage } from '../../api/axios'
import { formatDateShort } from '../../utils/formatters'

const Profile = () => {
  const [profile, setProfile] = useState(null)
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)

  const profileForm = useForm()
  const passwordForm = useForm()

  useEffect(() => {
    getProfile()
      .then(({ data }) => {
        setProfile(data)
        profileForm.reset({ fullName: data.fullName, phoneNumber: data.phoneNumber })
      })
      .catch((err) => toast.error(getErrorMessage(err)))
  }, [])

  const onUpdateProfile = async (data) => {
    setLoading(true)
    try {
      const { data: updated } = await updateProfile(data)
      setProfile(updated)
      toast.success('Profile updated successfully!')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const onChangePassword = async (data) => {
    setLoading(true)
    try {
      await changePassword(data)
      toast.success('Password changed successfully!')
      passwordForm.reset()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout title="Profile Settings">
      <div className="tabs">
        <button className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
          Profile Information
        </button>
        <button className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`} onClick={() => setActiveTab('password')}>
          Change Password
        </button>
      </div>

      {activeTab === 'profile' && (
        <div className="card form-card">
          <h2 className="card-title" style={{ marginBottom: 4 }}>Personal Information</h2>
          <p className="card-subtitle" style={{ marginBottom: 24 }}>Update your account details</p>

          {profile && (
            <div style={{ marginBottom: 20, padding: 16, background: 'var(--bg)', borderRadius: 8, fontSize: 14 }}>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Role:</strong> {profile.role}</p>
              <p><strong>Member since:</strong> {formatDateShort(profile.createdAt)}</p>
            </div>
          )}

          <form onSubmit={profileForm.handleSubmit(onUpdateProfile)}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                {...profileForm.register('fullName', { required: 'Name is required' })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                {...profileForm.register('phoneNumber', {
                  required: 'Phone is required',
                  pattern: { value: /^[0-9]{10}$/, message: 'Must be 10 digits' },
                })}
              />
              {profileForm.formState.errors.phoneNumber && (
                <p className="form-error">{profileForm.formState.errors.phoneNumber.message}</p>
              )}
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'password' && (
        <div className="card form-card">
          <h2 className="card-title" style={{ marginBottom: 4 }}>Change Password</h2>
          <p className="card-subtitle" style={{ marginBottom: 24 }}>Ensure your account stays secure</p>

          <form onSubmit={passwordForm.handleSubmit(onChangePassword)}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-control"
                {...passwordForm.register('currentPassword', { required: 'Current password is required' })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-control"
                {...passwordForm.register('newPassword', {
                  required: 'New password is required',
                  minLength: { value: 6, message: 'Minimum 6 characters' },
                })}
              />
              {passwordForm.formState.errors.newPassword && (
                <p className="form-error">{passwordForm.formState.errors.newPassword.message}</p>
              )}
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      )}
    </DashboardLayout>
  )
}

export default Profile
