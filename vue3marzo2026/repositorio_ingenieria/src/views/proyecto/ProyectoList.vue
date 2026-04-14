<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getProyectos, deleteProyecto } from '@/services/proyectoService'

const router = useRouter()
const proyectos = ref<any[]>([])
const busqueda = ref('')
const loading = ref(false)

const cargarProyectos = async () => {
  loading.value = true
  try {
    const res = await getProyectos()
    proyectos.value = res.data
  } catch (error) {
    console.error('Error al cargar proyectos:', error)
  } finally {
    loading.value = false
  }
}

const proyectosFiltrados = computed(() =>
  proyectos.value.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
    p.cliente.toLowerCase().includes(busqueda.value.toLowerCase())
  )
)

const eliminar = async (id) => {
  if (confirm('¿Estás seguro de eliminar este proyecto?')) {
    await deleteProyecto(id)
    await cargarProyectos()
  }
}

onMounted(cargarProyectos)
</script>

<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>📁 Proyectos</h2>
      <router-link to="/proyectos/nuevo" class="btn btn-primary">
        + Nuevo Proyecto
      </router-link>
    </div>

    <input
      v-model="busqueda"
      type="text"
      class="form-control mb-4"
      placeholder="🔍 Buscar por nombre o cliente..."
    />

    <div v-if="loading" class="text-center">Cargando...</div>

    <div v-else-if="proyectosFiltrados.length === 0" class="text-center text-muted">
      No se encontraron proyectos.
    </div>

    <div v-else class="row">
      <div
        v-for="proyecto in proyectosFiltrados"
        :key="proyecto.id"
        class="col-md-4 mb-4"
      >
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">{{ proyecto.nombre }}</h5>
            <p class="card-text text-muted">{{ proyecto.descripcion }}</p>
            <p><strong>Cliente:</strong> {{ proyecto.cliente }}</p>
            <p><strong>Fecha inicio:</strong> {{ proyecto.fechaInicioEstimado }}</p>
            <span
              class="badge"
              :class="proyecto.estado === 'activo' ? 'bg-success' : 'bg-secondary'"
            >
              {{ proyecto.estado }}
            </span>
          </div>
          <div class="card-footer d-flex gap-2">
            <router-link
              :to="`/proyectos/${proyecto.id}/documentos`"
              class="btn btn-sm btn-outline-primary"
            >
              📄 Documentos
            </router-link>
            <router-link
              :to="`/proyectos/${proyecto.id}/editar`"
              class="btn btn-sm btn-outline-warning"
            >
              ✏️ Editar
            </router-link>
            <button
              @click="eliminar(proyecto.id)"
              class="btn btn-sm btn-outline-danger"
            >
              🗑️ Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>