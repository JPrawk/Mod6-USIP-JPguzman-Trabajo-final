import api from './api.js'

export const getDocumentos = (proyectoId) => api.get(`/documentos?proyectoId=${proyectoId}`)
export const getDocumentosByEtapa = (proyectoId, etapaId) => api.get(`/documentos?proyectoId=${proyectoId}&etapaId=${etapaId}`)
export const getDocumento = (id) => api.get(`/documentos/${id}`)
export const createDocumento = (data) => api.post('/documentos', data)
export const updateDocumento = (id, data) => api.put(`/documentos/${id}`, data)
export const deleteDocumento = (id) => api.delete(`/documentos/${id}`)
export const getEtapas = () => api.get('/etapas')
export const getEstados = () => api.get('/estados')