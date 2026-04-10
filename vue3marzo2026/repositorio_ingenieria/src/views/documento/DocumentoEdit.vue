<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getDocumento, updateDocumento, getEtapas, getEstados } from '@/services/documentoService'

const props = defineProps({ id: String, docId: String })
const router = useRouter()
const etapas = ref<any[]>([])
const estados = ref<any[]>([])
const error = ref('')

const form = ref({
  proyectoId: props.id,
  etapaId: '',
  titulo: '',
  descripcion: '',
  tipo: 'plano',
  version: '1.0',
  autor: '',
  fecha: '',
  archivo: '',
  estado: 'inicial',
  observaciones: '',
  aprobadoPor: ''
})

// Estado actual antes de editar (para saber retorno de rechazo)
const estadoAnterior = ref('')

const estadoSeleccionado = computed(() =>
  estados.value.find(e => e.nombre === form.value.estado)
)

const esRechazo = computed(() => form.value.estado === 'rechazado')

const retornoRechazo = computed(() => {
  const anterior = estados.value.find(e => e.nombre === estadoAnterior.value)
  return anterior?.retornoRechazo ?? null
})

const cargarDatos = async () => {
  try {
    const [docRes, etapaRes, estadoRes] = await Promise.all([
      getDocumento(props.docId),
      getEtapas(),
      getEstados()
    ])
    form.value = docRes.data
    estadoAnterior.value = docRes.data.estado
    etapas.value = etapaRes.data
    estados.value = estadoRes.data
  } catch (err) {
    error.value = 'Error al cargar el documento.'
  }
}

const guardar = async () => {
  if (!form.value.titulo || !form.value.etapaId) {
    error.value = 'Por favor completa los campos obligatorios.'
    return
  }
  if (esRechazo.value && !form.value.observaciones) {
    error.value = 'El rechazo requiere una nota de observación.'
    return
  }
  try {
    await updateDocumento(props.docId, form.value)
    router.push(`/proyectos/${props.id}/documentos`)
  } catch (err) {
    error.value = 'Error al actualizar el documento.'
  }
}

onMounted(cargarDatos)
</script>

<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-md-8">

        <!-- Flujo de estados -->
        <div class="flujo-estados mb-4">
          <div
            v-for="(est, i) in estados.filter(e => e.nombre !== 'rechazado')"
            :key="est.id"
            class="flujo-paso"
          >
            <div
              class="flujo-badge"
              :style="{ backgroundColor: est.color }"
              :class="{ activo: form.estado === est.nombre }"
              :title="est.descripcion"
            >
              {{ est.orden }}. {{ est.nombre }}
            </div>
            <span v-if="i < estados.filter(e => e.nombre !== 'rechazado').length - 1" class="flujo-flecha">→</span>
          </div>
        </div>

        <div class="card shadow-sm">
          <div class="card-body">
            <h2 class="card-title mb-4">✏️ Editar Documento</h2>

            <div v-if="error" class="alert alert-danger">{{ error }}</div>

            <!-- Alerta de rechazo -->
            <div v-if="esRechazo && retornoRechazo" class="alert alert-warning">
              ⚠️ Al guardar como <strong>rechazado</strong>, el documento retornará a
              <strong>{{ retornoRechazo }}</strong>. Es obligatorio ingresar una observación.
            </div>

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
              <input v-model="form.titulo" type="text" class="form-control" />
            </div>

            <div class="mb-3">
              <label class="form-label">Descripción</label>
              <textarea v-model="form.descripcion" class="form-control" rows="2"></textarea>
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

            <!-- Estado con descripción -->
            <div class="mb-3">
              <label class="form-label">Estado</label>
              <select v-model="form.estado" class="form-select">
                <option v-for="est in estados" :key="est.id" :value="est.nombre">
                  {{ est.nombre }}
                </option>
              </select>
              <div v-if="estadoSeleccionado" class="form-text mt-1">
                <span
                  class="badge me-2"
                  :style="{ backgroundColor: estadoSeleccionado.color }"
                >{{ estadoSeleccionado.nombre }}</span>
                {{ estadoSeleccionado.descripcion }}
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">
                Aprobado por
              </label>
              <input v-model="form.aprobadoPor" type="text" class="form-control" />
            </div>

            <!-- Observaciones - obligatorio si rechazado -->
            <div class="mb-3">
              <label class="form-label">
                Observaciones
                <span v-if="esRechazo" class="text-danger fw-bold">* (obligatorio al rechazar)</span>
              </label>
              <textarea
                v-model="form.observaciones"
                class="form-control"
                rows="3"
                :class="{ 'border-danger': esRechazo && !form.observaciones }"
                placeholder="Ingrese la razón del rechazo o comentarios adicionales..."
              ></textarea>
            </div>

            <div class="mb-3">
              <label class="form-label">URL del Archivo</label>
              <input v-model="form.archivo" type="text" class="form-control" placeholder="https://..." />
            </div>

            <div class="d-flex gap-2">
              <button @click="guardar" class="btn btn-primary">Actualizar</button>
              <router-link :to="`/proyectos/${id}/documentos`" class="btn btn-secondary">
                Cancelar
              </router-link>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.flujo-estados {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  background: #f8f9fa;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}
.flujo-paso {
  display: flex;
  align-items: center;
  gap: 4px;
}
.flujo-badge {
  color: white;
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 12px;
  white-space: nowrap;
  opacity: 0.6;
  cursor: default;
  transition: opacity 0.2s, transform 0.2s;
}
.flujo-badge.activo {
  opacity: 1;
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}
.flujo-flecha {
  color: #aaa;
  font-size: 14px;
}
</style>
