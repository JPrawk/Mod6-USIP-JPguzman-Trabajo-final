<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { isLogin } from '@/services/authService'
import { getProyectos, createProyecto, updateProyecto, deleteProyecto, getProyecto } from '@/services/proyectoService'
import appMemory from '@/services/appMemory'
import api from '@/services/api'

// ── Estado general ──────────────────────────────────
const proyectos = ref<any[]>([])
const busqueda  = ref('')
const loading   = ref(false)
const modo      = ref<'lista' | 'nuevo' | 'editar'>('lista')
const vistaGrid = ref(true)
const error     = ref('')

// ── Formulario compartido ────────────────────────────
const formVacio = () => ({
  nombre: '', descripcion: '', cliente: '',
  fechaInicioEstimado: '', fechaFinalizacionEstimada: '',
  estado: 'activo',
  userId: appMemory.get('userId')
})
const form      = ref(formVacio())
const editId    = ref<number | null>(null)

// ── Lista filtrada ───────────────────────────────────
const proyectosFiltrados = computed(() =>
  proyectos.value.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
    p.cliente.toLowerCase().includes(busqueda.value.toLowerCase())
  )
)

// ── Cargar proyectos ────────────────────────────────
const cargar = async () => {
  loading.value = true
  try {
    const res = await getProyectos()
    proyectos.value = res.data
  } finally {
    loading.value = false
  }
}

// ── Abrir formulario NUEVO ──────────────────────────
const abrirNuevo = () => {
  form.value = formVacio()
  editId.value = null
  error.value  = ''
  modo.value   = 'nuevo'
}

// ── Abrir formulario EDITAR ─────────────────────────
const abrirEditar = async (id: number) => {
  error.value = ''
  try {
    const res   = await getProyecto(id)
    form.value  = { ...res.data }
    editId.value = id
    modo.value   = 'editar'
  } catch {
    error.value = 'Error al cargar el proyecto.'
  }
}

// ── Guardar (crear o actualizar) ────────────────────
const guardar = async () => {
  if (!form.value.nombre || !form.value.cliente || !form.value.fechaInicioEstimado) {
    error.value = 'Completa los campos obligatorios (*).'
    return
  }
  try {
    if (modo.value === 'nuevo') {
      await createProyecto(form.value)
    } else {
      await updateProyecto(editId.value, form.value)
    }
    await cargar()
    modo.value  = 'lista'
    error.value = ''
  } catch {
    error.value = 'Error al guardar el proyecto.'
  }
}

// ── Eliminar ────────────────────────────────────────
const eliminar = async (id: number) => {
  if (confirm('¿Eliminar este proyecto?')) {
    await deleteProyecto(id)
    await cargar()
  }
}

// ── Color por estado ────────────────────────────────
const colorEstado = (estado: string) => ({
  'activo'      : 'bg-success',
  'completado'  : 'bg-primary',
  'en revision' : 'bg-warning text-dark',
  'suspendido'  : 'bg-orange',
  'inactivo'    : 'bg-secondary',
  'cancelado'   : 'bg-danger',
}[estado] ?? 'bg-secondary')

// ── Cancelar ────────────────────────────────────────
const cancelar = () => {
  modo.value  = 'lista'
  error.value = ''
}

// ── As Built ────────────────────────────────────────
const documentosAsBuilt  = ref<any[]>([])
const etapas             = ref<any[]>([])
const busquedaAsBuilt    = ref('')
const loadingAsBuilt     = ref(false)

const cargarAsBuilt = async () => {
  loadingAsBuilt.value = true
  try {
    const [docRes, etapaRes] = await Promise.all([
      api.get('/documentos?estado=VAsbuilt'),
      api.get('/etapas')
    ])
    documentosAsBuilt.value = docRes.data
    etapas.value            = etapaRes.data
  } finally {
    loadingAsBuilt.value = false
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

const documentosAsBuiltFiltrados = computed(() =>
  documentosAsBuilt.value.filter(d =>
    d.titulo.toLowerCase().includes(busquedaAsBuilt.value.toLowerCase()) ||
    getNombreProyecto(d.proyectoId).toLowerCase().includes(busquedaAsBuilt.value.toLowerCase())
  )
)

onMounted(() => {
  if (isLogin()) {
    cargar()
    cargarAsBuilt()
  }
})
</script>

<template>

  <!-- ══════════ HERO ══════════ -->
  <div class="hero">
    <div class="hero-content">
      <h1>📐 Repositorio de Ingeniería</h1>
      <p class="subtitle">Gestión de planos y documentos técnicos para proyectos eléctricos</p>
      <div class="hero-actions" v-if="!isLogin()">
        <router-link to="/login"    class="btn-hero-primary">Iniciar Sesión</router-link>
        <router-link to="/register" class="btn-hero-secondary">Registrarse</router-link>
      </div>
    </div>
  </div>

  <!-- ══════════ DASHBOARD ══════════ -->
  <div class="container mt-4" v-if="isLogin()">

    <!-- Título + controles -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4 class="mb-0">🏗️ Gestión de Proyectos</h4>
      <div class="d-flex gap-2">
        <!-- Toggle vista (solo en modo lista) -->
        <div v-if="modo === 'lista'" class="btn-group btn-group-sm">
          <button
            @click="vistaGrid = true"
            class="btn"
            :class="vistaGrid ? 'btn-dark' : 'btn-outline-dark'"
            title="Vista tarjetas"
          >⊞</button>
          <button
            @click="vistaGrid = false"
            class="btn"
            :class="!vistaGrid ? 'btn-dark' : 'btn-outline-dark'"
            title="Vista lista"
          >☰</button>
        </div>
        <button v-if="modo === 'lista'" @click="abrirNuevo" class="btn btn-primary btn-sm">
          + Nuevo Proyecto
        </button>
        <button v-else @click="cancelar" class="btn btn-outline-secondary btn-sm">
          ← Volver a la lista
        </button>
      </div>
    </div>

    <!-- ── LISTA ── -->
    <div v-if="modo === 'lista'">

      <!-- Buscador / filtro -->
      <input
        v-model="busqueda"
        type="text"
        class="form-control mb-3"
        placeholder="🔍 Buscar por nombre o cliente..."
      />

      <div v-if="loading" class="text-center text-muted py-4">Cargando...</div>

      <div v-else-if="proyectosFiltrados.length === 0" class="text-center text-muted py-4">
        No se encontraron proyectos.
      </div>

      <!-- VISTA TARJETAS -->
      <div v-else-if="vistaGrid" class="row">
        <div v-for="proyecto in proyectosFiltrados" :key="proyecto.id" class="col-md-4 mb-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <h5 class="card-title mb-0">{{ proyecto.nombre }}</h5>
                <span class="badge"
                  :class="colorEstado(proyecto.estado)"
                >{{ proyecto.estado }}</span>
              </div>
              <p class="card-text text-muted small">{{ proyecto.descripcion }}</p>
              <p class="small mb-0"><strong>Cliente:</strong> {{ proyecto.cliente }}</p>
              <p class="small mb-0"><strong>Inicio estimado:</strong> {{ proyecto.fechaInicioEstimado || '—' }}</p>
              <p class="small"><strong>Fin estimado:</strong> {{ proyecto.fechaFinalizacionEstimada || '—' }}</p>
            </div>
            <div class="card-footer d-flex gap-2 flex-wrap">
              <router-link :to="`/proyectos/${proyecto.id}/documentos`" class="btn btn-sm btn-outline-primary">📄 Documentos</router-link>
              <button @click="abrirEditar(proyecto.id)" class="btn btn-sm btn-outline-warning">✏️ Editar</button>
              <button @click="eliminar(proyecto.id)"    class="btn btn-sm btn-outline-danger">🗑️ Eliminar</button>
            </div>
          </div>
        </div>
      </div>

      <!-- VISTA LISTA -->
      <div v-else class="table-responsive">
        <table class="table table-hover align-middle">
          <thead class="table-dark">
            <tr>
              <th>Proyecto</th>
              <th>Cliente</th>
              <th>Inicio estimado</th>
              <th>Fin estimado</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="proyecto in proyectosFiltrados" :key="proyecto.id">
              <td>
                <div class="fw-bold">{{ proyecto.nombre }}</div>
                <div class="text-muted small">{{ proyecto.descripcion }}</div>
              </td>
              <td>{{ proyecto.cliente }}</td>
              <td>{{ proyecto.fechaInicioEstimado || '—' }}</td>
              <td>{{ proyecto.fechaFinalizacionEstimada || '—' }}</td>
              <td>
                <span class="badge"
                  :class="colorEstado(proyecto.estado)"
                >{{ proyecto.estado }}</span>
              </td>
              <td>
                <div class="d-flex gap-1">
                  <router-link :to="`/proyectos/${proyecto.id}/documentos`" class="btn btn-sm btn-outline-primary">📄</router-link>
                  <button @click="abrirEditar(proyecto.id)" class="btn btn-sm btn-outline-warning">✏️</button>
                  <button @click="eliminar(proyecto.id)"    class="btn btn-sm btn-outline-danger">🗑️</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- ══ SECCIÓN AS BUILT ══ -->
      <hr class="my-4" />
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 class="mb-0">📋 Planos As Built</h4>
          <p class="text-muted small mb-0">Documentos con versión final aprobada (VAsbuilt)</p>
        </div>
        <router-link to="/asbuilt" class="btn btn-outline-dark btn-sm">Ver página completa</router-link>
      </div>

      <input
        v-model="busquedaAsBuilt"
        type="text"
        class="form-control mb-3"
        placeholder="🔍 Buscar plano por título o proyecto..."
      />

      <div v-if="loadingAsBuilt" class="text-center text-muted py-3">Cargando planos...</div>

      <div v-else-if="documentosAsBuiltFiltrados.length === 0" class="text-center text-muted py-3">
        No hay planos As Built registrados.
      </div>

      <div v-else class="table-responsive">
        <table class="table table-hover align-middle table-sm">
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
            <tr v-for="doc in documentosAsBuiltFiltrados" :key="doc.id">
              <td class="fw-bold">{{ doc.titulo }}</td>
              <td>{{ getNombreProyecto(doc.proyectoId) }}</td>
              <td>{{ getNombreEtapa(doc.etapaId) }}</td>
              <td>{{ doc.tipo }}</td>
              <td>{{ doc.version }}</td>
              <td>{{ doc.autor }}</td>
              <td>{{ doc.fecha }}</td>
              <td>
                <a v-if="doc.archivo" :href="doc.archivo" target="_blank" class="btn btn-sm btn-outline-primary">🔗 Ver</a>
                <span v-else class="text-muted small">—</span>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="text-muted small">Total: <strong>{{ documentosAsBuiltFiltrados.length }}</strong> plano(s)</div>
      </div>

    </div>

    <!-- ── FORMULARIO NUEVO / EDITAR ── -->
    <div v-else class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow-sm">
          <div class="card-header fw-bold">
            {{ modo === 'nuevo' ? '➕ Nuevo Proyecto' : '✏️ Editar Proyecto' }}
          </div>
          <div class="card-body">

            <div v-if="error" class="alert alert-danger">{{ error }}</div>

            <div class="mb-3">
              <label class="form-label">Nombre *</label>
              <input v-model="form.nombre" type="text" class="form-control" placeholder="Nombre del proyecto" />
            </div>

            <div class="mb-3">
              <label class="form-label">Descripción</label>
              <textarea v-model="form.descripcion" class="form-control" rows="2"></textarea>
            </div>

            <div class="mb-3">
              <label class="form-label">Cliente *</label>
              <input v-model="form.cliente" type="text" class="form-control" placeholder="Nombre del cliente" />
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Fecha de Inicio Estimada *</label>
                <input v-model="form.fechaInicioEstimado" type="date" class="form-control" />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Fecha de Finalización Estimada</label>
                <input v-model="form.fechaFinalizacionEstimada" type="date" class="form-control" />
              </div>
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
              <button @click="guardar" class="btn btn-primary">
                {{ modo === 'nuevo' ? 'Crear Proyecto' : 'Actualizar Proyecto' }}
              </button>
              <button @click="cancelar" class="btn btn-secondary">Cancelar</button>
            </div>

          </div>
        </div>
      </div>
    </div>

  </div>

  <!-- ══════════ FEATURES (no logueado) ══════════ -->
  <div class="features" v-else>
    <div class="feature-card">
      <span class="icon">🏗️</span>
      <h3>Gestión de Proyectos</h3>
      <p>Administra tus proyectos eléctricos desde el diseño conceptual hasta los planos As Built.</p>
    </div>
    <div class="feature-card">
      <span class="icon">📋</span>
      <h3>Control de Etapas</h3>
      <p>Organiza documentos por etapas: diseño, adquisición, montaje, activación y más.</p>
    </div>
    <div class="feature-card">
      <span class="icon">✅</span>
      <h3>Flujo de Aprobación</h3>
      <p>Controla el estado de cada documento: inicial, revisión, aprobado o versión final.</p>
    </div>
  </div>

</template>

<style>
.hero {
  background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
  color: white; padding: 60px 20px; text-align: center;
}
.hero h1    { font-size: 2.2rem; margin-bottom: 1rem; }
.hero .subtitle { font-size: 1.1rem; opacity: 0.8; margin-bottom: 1.5rem; }
.hero-actions   { display: flex; gap: 1rem; justify-content: center; }
.btn-hero-primary {
  background: #e94560; color: white; padding: 10px 28px;
  border-radius: 8px; text-decoration: none; font-weight: bold;
}
.btn-hero-primary:hover  { background: #c73652; color: white; }
.btn-hero-secondary {
  background: transparent; color: white; padding: 10px 28px;
  border-radius: 8px; text-decoration: none; border: 2px solid white; font-weight: bold;
}
.btn-hero-secondary:hover { background: white; color: #1a1a2e; }
.features {
  display: flex; gap: 2rem; padding: 60px 40px;
  justify-content: center; flex-wrap: wrap;
}
.feature-card {
  background: white; border-radius: 12px; padding: 30px;
  width: 280px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}
.feature-card .icon { font-size: 2.5rem; }
.feature-card h3    { margin: 1rem 0 0.5rem; color: #1a1a2e; }
.feature-card p     { color: #666; }
.bg-orange { background-color: #fd7e14 !important; color: white; }
</style>
