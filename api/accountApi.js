import api from './axios'

export const getAccounts = () => api.get('/accounts')
export const getAccountById = (id) => api.get(`/accounts/${id}`)
export const getAccountByNumber = (accountNumber) => api.get(`/accounts/number/${accountNumber}`)
export const createAccount = (data) => api.post('/accounts', data)
