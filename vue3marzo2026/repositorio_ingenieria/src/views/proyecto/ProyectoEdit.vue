<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getProyecto, updateProyecto } from '@/services/proyectoService'

const props = defineProps({ id: String })
const router = useRouter()
const error = ref('')

const form = ref({
  nombre: '',
  descripcion: '',
  cliente: '',
  fechaInicioEstimado: '',
  fechaFinalizacionEstimada: '',
  estado: 'activo',
})

const cargar = async () => {
  try {
    const res = await getProyecto(props.id)
    form.value = res.data
  } catch (err) {
    error.value = 'Error al cargar el proyecto.'
  }
}

const guardar = async () => {
  if (!form.value.nombre || !form.value.cliente || !form.value.fechaInicioEstimado) {
    error.value = 'Por favor completa todos los campos requeridos.'
    return
  }
  try {
    await updateProyecto(props.id, form.value)
    router.push('/proyectos')
  } catch (err) {
    error.value = 'Error al actualizar el proyecto.'
  }
}

onMounted(cargar)
</script>

<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow-sm">
          <div class="card-body">
            <h2 class="card-title mb-4">✏️ Editar Proyecto</h2>

            <div v-if="error" class="alert alert-danger">{{ error }}</div>

            <div class="mb-3">
              <label class="form-label">Nombre *</label>
              <input v-model="form.nombre" type="text" class="form-control" />
            </div>

            <div class="mb-3">
              <label class="form-label">Descripción</label>
              <textarea v-model="form.descripcion" class="form-control" rows="3"></textarea>
            </div>

            <div class="mb-3">
              <label class="form-label">Cliente *</label>
              <input v-model="form.cliente" type="text" class="form-control" />
            </div>

            <div class="mb-3">
              <label class="form-label">Fecha de Inicio Estimada *</label>
              <input v-model="form.fechaInicioEstimado" type="date" class="form-control" />
            </div>

            <div class="mb-3">
              <label class="form-label">Fecha de Finalización Estimada</label>
              <input v-model="form.fechaFinalizacionEstimada" type="date" class="form-control" />
            </div>

            <div class="mb-3">
              <label class="form-label">Estado</label>
              <select v-model="form.estado" class="form-select">
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="completado">Completado</option>
                <option value="suspendido">Suspendido</option>
                <option value="en revision">En Revisión</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>

            <div class="d-flex gap-2">
              <button @click="guardar" class="btn btn-primary">Actualizar</button>
              <router-link to="/proyectos" class="btn btn-secondary">Cancelar</router-link>
              <router-link to="/" class="btn btn-outline-dark">🏠 Inicio</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>