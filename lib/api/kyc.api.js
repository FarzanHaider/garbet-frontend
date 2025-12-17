/**
 * KYC API endpoints
 */

import api from './index'

export const kycAPI = {
  getKYC: () => api.get('/user/kyc'),
  submitKYC: (data) => api.post('/user/kyc/submit', data),
  uploadKYCDocuments: (formData) => api.post('/user/kyc/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
}

