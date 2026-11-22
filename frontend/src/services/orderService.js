import api from './api';
export const orderService = {
  create: (payload, token) => api.post('/orders', payload, { headers: { 'X-Order-Access-Token': token } }).then(r => r.data),
  track: (orderId, token) => api.get(`/orders/${encodeURIComponent(orderId)}/track`, { headers: { 'X-Order-Access-Token': token } }).then(r => r.data),
  list: params => api.get('/orders/admin', { params }).then(r => r.data),
  summary: () => api.get('/orders/admin/summary').then(r => r.data),
  get: id => api.get(`/orders/admin/${id}`).then(r => r.data),
  status: (id, status, reason) => api.patch(`/orders/admin/${id}/status`, { status, reason }).then(r => r.data),
  payment: (id, paymentStatus) => api.patch(`/orders/admin/${id}/payment`, { paymentStatus }).then(r => r.data),
  note: (id, text) => api.post(`/orders/admin/${id}/notes`, { text }).then(r => r.data)
};
