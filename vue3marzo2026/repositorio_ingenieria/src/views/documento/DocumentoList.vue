<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getDocumentos, getEtapas, getEstados, deleteDocumento } from '@/services/documentoService'

const props = defineProps({ id: String })
const documentos = ref<any[]>([])
const etapas = ref<any[]>([])
const estados = ref<any[]>([])
const loading = ref(false)
const busqueda = ref('')

const etapasFiltradas = () => {
  if (!busqueda.value) return etapas.value
  const q = busqueda.value.toLowerCase()
  return etapas.value
    .map(etapa => ({
      ...etapa,
      subdocumentos: etapa.subdocumentos.filter((sub: string) =>
        sub.toLowerCase().includes(q)
      )
    }))
    .filter(etapa => etapa.subdocumentos.length > 0)
}

const cargarDatos = async () => {
  loading.value = true
  try {
    const [docRes, etapaRes, estadoRes] = await Promise.all([
      getDocumentos(props.id),
      getEtapas(),
      getEstados()
    ])
    documentos.value = docRes.data
    etapas.value = etapaRes.data
    estados.value = estadoRes.data
  } catch (error) {
    console.error('Error al cargar datos:', error)
  } finally {
    loading.value = false
  }
}

const getDocumento = (etapaId: number, titulo: string) => {
  return documentos.value.find(d => d.etapaId === etapaId && d.titulo === titulo)
}

const getColorEstado = (estadoNombre: string) => {
  const estado = estados.value.find(e => e.nombre === estadoNombre)
  return estado ? estado.color : '#6c757d'
}

const coloresEtapa = [
  '#0f3460', // 1 azul oscuro
  '#1a6b3c', // 2 verde oscuro
  '#7b2d8b', // 3 morado
  '#b5451b', // 4 naranja oscuro
  '#1565c0', // 5 azul medio
  '#4a235a', // 6 violeta
  '#b7950b', // 7 dorado oscuro
  '#117a65', // 8 verde azulado
  '#922b21', // 9 rojo oscuro
  '#1b2631', // 10 gris oscuro
]

const getColorEtapa = (index: number) => coloresEtapa[index % coloresEtapa.length]

const eliminar = async (id: number) => {
  if (confirm('¿Eliminar este documento?')) {
    await deleteDocumento(id)
    await cargarDatos()
  }
}

onMounted(cargarDatos)
</script>

<template>
  <div class="container mt-4">

    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>📁 Etapas del Proyecto</h2>
      <router-link to="/proyectos" class="btn btn-outline-secondary btn-sm">
        ← Volver a Proyectos
      </router-link>
    </div>

    <!-- Buscador -->
    <input
      v-model="busqueda"
      type="text"
      class="form-control mb-4"
      placeholder="🔍 Buscar subdocumento..."
    />

    <div v-if="loading" class="text-center text-muted">Cargando...</div>

    <div v-else>
      <div v-for="(etapa, index) in etapasFiltradas()" :key="etapa.id" class="etapa-bloque mb-3">

        <!-- Cabecera de etapa -->
        <div class="etapa-titulo" :style="{ backgroundColor: getColorEtapa(index) }">
          <span class="etapa-num">{{ etapa.orden }}</span>
          <strong>{{ etapa.nombre }}</strong>
        </div>

        <!-- Sin subdocumentos -->
        <div v-if="etapa.subdocumentos.length === 0" class="sub-fila text-muted fst-italic">
          <span class="arbol-icono">└──</span> Sin subdocumentos definidos
        </div>

        <!-- Lista de subdocumentos -->
        <div
          v-for="(sub, index) in etapa.subdocumentos"
          :key="sub"
          class="sub-fila"
        >
          <span class="arbol-icono">
            {{ index === etapa.subdocumentos.length - 1 ? '└──' : '├──' }}
          </span>

          <span class="sub-nombre">{{ sub }}</span>

          <template v-if="getDocumento(etapa.id, sub)">
            <span
              class="badge ms-2"
              :style="{ backgroundColor: getColorEstado(getDocumento(etapa.id, sub).estado) }"
            >
              {{ getDocumento(etapa.id, sub).estado }}
            </span>
            <span class="text-muted ms-2 small">
              v{{ getDocumento(etapa.id, sub).version }} — {{ getDocumento(etapa.id, sub).autor }}
            </span>
            <div class="ms-auto d-flex gap-1">
              <router-link
                :to="`/proyectos/${props.id}/documentos/${getDocumento(etapa.id, sub).id}/editar`"
                class="btn btn-sm btn-outline-warning py-0"
              >✏️</router-link>
              <button
                @click="eliminar(getDocumento(etapa.id, sub).id)"
                class="btn btn-sm btn-outline-danger py-0"
              >🗑️</button>
            </div>
          </template>

          <template v-else>
            <span class="badge bg-secondary ms-2">pendiente</span>
            <div class="ms-auto">
              <router-link
                :to="`/proyectos/${props.id}/documentos/nuevo?etapa=${etapa.id}&titulo=${encodeURIComponent(sub)}`"
                class="btn btn-sm btn-outline-primary py-0"
              >+ Cargar</router-link>
            </div>
          </template>

        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
.etapa-bloque {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  overflow: hidden;
}

.etapa-titulo {
  color: white;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
}

.etapa-num {
  background: #e94560;
  color: white;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 13px;
  flex-shrink: 0;
}

.sub-fila {
  display: flex;
  align-items: center;
  padding: 6px 16px;
  border-top: 1px solid #f0f0f0;
  background: white;
  flex-wrap: wrap;
  gap: 4px;
}

.sub-fila:hover {
  background: #f8f9fa;
}

.arbol-icono {
  font-family: monospace;
  color: #aaa;
  margin-right: 6px;
  flex-shrink: 0;
}

.sub-nombre {
  font-size: 14px;
}
</style>
