import api from './axios'

export const getStats = () => api.get('/admin/stats')
export const getUsers = (params) => api.get('/admin/users', { params })
export const toggleUserStatus = (userId) => api.put(`/admin/users/${userId}/toggle`)
export const getAccounts = (params) => api.get('/admin/accounts', { params })
export const getTransactions = (params) => api.get('/admin/transactions', { params })
