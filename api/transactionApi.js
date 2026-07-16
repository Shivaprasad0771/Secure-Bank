import api from './axios'

export const transfer = (data) => api.post('/transactions/transfer', data)
export const deposit = (data) => api.post('/transactions/deposit', data)
export const withdraw = (data) => api.post('/transactions/withdraw', data)
export const getHistory = (params) => api.get('/transactions/history', { params })
