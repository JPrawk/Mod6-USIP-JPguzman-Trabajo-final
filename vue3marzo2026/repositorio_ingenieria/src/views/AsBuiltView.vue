<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'

const documentos  = ref<any[]>([])
const proyectos   = ref<any[]>([])
const etapas      = ref<any[]>([])
const busqueda    = ref('')
const loading     = ref(false)

const cargar = async () => {
  loading.value = true
  try {
    const [docRes, proyRes, etapaRes] = await Promise.all([
      api.get('/documentos?estado=VAsbuilt'),
      api.get('/proyectos'),
      api.get('/etapas')
    ])
    documentos.value  = docRes.data
    proyectos.value   = proyRes.data
    etapas.value      = etapaRes.data
  } finally {
    loading.value = false
  }
}

const getNombreProyecto = (proyectoId: number) => {
  const p = proyectos.value.find(p => p.id === proyectoId)
  return p ? p.nombre : '—'
}

const getNombreEtapa = (etapaId: number) => {
  const e = etapas.value.find(e => e.id === etapaId)
  return e ? e.nombre : '—'
}

const documentosFiltrados = computed(() =>
  documentos.value.filter(d =>
    d.titulo.toLowerCase().includes(busqueda.value.toLowerCase()) ||
    getNombreProyecto(d.proyectoId).toLowerCase().includes(busqueda.value.toLowerCase())
  )
)

onMounted(cargar)
</script>

<template>
  <div class="container mt-4">

    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="mb-0">📋 Planos As Built</h2>
        <p class="text-muted small mb-0">Documentos con versión final aprobada por GIPM</p>
      </div>
      <router-link to="/" class="btn btn-outline-dark btn-sm">🏠 Inicio</router-link>
    </div>

    <!-- Buscador -->
    <input
      v-model="busqueda"
      type="text"
      class="form-control mb-4"
      placeholder="🔍 Buscar por título o proyecto..."
    />

    <div v-if="loading" class="text-center text-muted py-4">Cargando...</div>

    <div v-else-if="documentosFiltrados.length === 0" class="text-center text-muted py-4">
      No hay documentos As Built registrados.
    </div>

    <div v-else class="table-responsive">
      <table class="table table-hover align-middle">
        <thead class="table-dark">
          <tr>
            <th>Título</th>
            <th>Proyecto</th>
            <th>Etapa</th>
            <th>Tipo</th>
            <th>Versión</th>
            <th>Autor</th>
            <th>Fecha</th>
            <th>Archivo</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="doc in documentosFiltrados" :key="doc.id">
            <td class="fw-bold">{{ doc.titulo }}</td>
            <td>{{ getNombreProyecto(doc.proyectoId) }}</td>
            <td>{{ getNombreEtapa(doc.etapaId) }}</td>
            <td>{{ doc.tipo }}</td>
            <td>{{ doc.version }}</td>
            <td>{{ doc.autor }}</td>
            <td>{{ doc.fecha }}</td>
            <td>
              <a
                v-if="doc.archivo"
                :href="doc.archivo"
                target="_blank"
                class="btn btn-sm btn-outline-primary"
              >🔗 Ver</a>
              <span v-else class="text-muted small">—</span>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="mt-2 text-muted small">
        Total: <strong>{{ documentosFiltrados.length }}</strong> documento(s) As Built
      </div>
    </div>

  </div>
</template>
