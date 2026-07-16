import api from './axios'

export const getBeneficiaries = () => api.get('/beneficiaries')
export const addBeneficiary = (data) => api.post('/beneficiaries', data)
export const deleteBeneficiary = (id) => api.delete(`/beneficiaries/${id}`)
