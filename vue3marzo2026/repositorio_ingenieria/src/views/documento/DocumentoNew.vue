<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { createDocumento, getEtapas, getEstados } from '@/services/documentoService'
import appMemory from '@/services/appMemory'

const props = defineProps({ id: String })
const router = useRouter()
const route = useRoute()
const etapas = ref<any[]>([])
const estados = ref<any[]>([])
const error = ref('')

// Precarga etapa y título si vienen desde el botón "+ Cargar"
const etapaQuery = route.query.etapa ? String(route.query.etapa) : ''
const tituloQuery = route.query.titulo ? String(route.query.titulo) : ''

const form = ref({
  proyectoId: props.id,
  etapaId: etapaQuery,
  titulo: tituloQuery,
  descripcion: '',
  tipo: 'plano',
  version: '1.0',
  autor: appMemory.get('userName'),
  fecha: new Date().toISOString().split('T')[0],
  archivo: '',
  estado: 'inicial',
  observaciones: '',
  aprobadoPor: ''
})

const cargarDatos = async () => {
  try {
    const [etapaRes, estadoRes] = await Promise.all([
      getEtapas(),
      getEstados()
    ])
    etapas.value = etapaRes.data
    estados.value = estadoRes.data
  } catch (err) {
    console.error('Error al cargar datos:', err)
  }
}

const guardar = async () => {
  if (!form.value.titulo || !form.value.etapaId) {
    error.value = 'Por favor completa todos los campos requeridos.'
    return
  }
  try {
    await createDocumento({ ...form.value, etapaId: Number(form.value.etapaId) })
    router.push(`/proyectos/${props.id}/documentos`)
  } catch (err) {
    error.value = 'Error al crear el documento.'
  }
}

onMounted(cargarDatos)
</script>

<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-md-7">
        <div class="card shadow-sm">
          <div class="card-body">
            <h2 class="card-title mb-4">➕ Nuevo Documento</h2>

            <div v-if="error" class="alert alert-danger">{{ error }}</div>

            <div class="mb-3">
              <label class="form-label">Etapa *</label>
              <select v-model="form.etapaId" class="form-select">
                <option value="">Selecciona una etapa</option>
                <option v-for="etapa in etapas" :key="etapa.id" :value="etapa.id">
                  {{ etapa.nombre }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Título *</label>
              <input v-model="form.titulo" type="text" class="form-control" placeholder="Título del documento" />
            </div>

            <div class="mb-3">
              <label class="form-label">Descripción</label>
              <textarea v-model="form.descripcion" class="form-control" rows="3"></textarea>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Tipo</label>
                <select v-model="form.tipo" class="form-select">
                  <option value="plano">Plano</option>
                  <option value="manual">Manual</option>
                  <option value="planilla">Planilla</option>
                  <option value="informe">Informe</option>
                  <option value="cronograma">Cronograma</option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Versión</label>
                <input v-model="form.version" type="text" class="form-control" />
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Autor</label>
                <input v-model="form.autor" type="text" class="form-control" />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Fecha</label>
                <input v-model="form.fecha" type="date" class="form-control" />
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Estado</label>
              <select v-model="form.estado" class="form-select">
                <option v-for="estado in estados" :key="estado.id" :value="estado.nombre">
                  {{ estado.nombre }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Observaciones</label>
              <textarea v-model="form.observaciones" class="form-control" rows="2"></textarea>
            </div>

            <div class="mb-3">
              <label class="form-label">URL del Archivo</label>
              <input v-model="form.archivo" type="text" class="form-control" placeholder="https://..." />
            </div>

            <div class="d-flex gap-2">
              <button @click="guardar" class="btn btn-primary">Guardar</button>
              <router-link :to="`/proyectos/${props.id}/documentos`" class="btn btn-secondary">Cancelar</router-link>
              <router-link to="/" class="btn btn-outline-dark">🏠 Inicio</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>