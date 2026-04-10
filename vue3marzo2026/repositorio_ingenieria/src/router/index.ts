import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ProyectoList from '@/views/proyecto/ProyectoList.vue'
import ProyectoNew from '@/views/proyecto/ProyectoNew.vue'
import ProyectoEdit from '@/views/proyecto/ProyectoEdit.vue'
import DocumentoList from '@/views/documento/DocumentoList.vue'
import DocumentoNew from '@/views/documento/DocumentoNew.vue'
import DocumentoEdit from '@/views/documento/DocumentoEdit.vue'
import { isLogin } from '@/services/authService'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/proyectos',
      name: 'proyectos',
      component: ProyectoList,
      meta: { requiresAuth: true },
    },
    {
      path: '/proyectos/nuevo',
      name: 'proyectoNew',
      component: ProyectoNew,
      meta: { requiresAuth: true },
    },
    {
      path: '/proyectos/:id/editar',
      name: 'proyectoEdit',
      component: ProyectoEdit,
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/proyectos/:id/documentos',
      name: 'documentos',
      component: DocumentoList,
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/proyectos/:id/documentos/nuevo',
      name: 'documentoNew',
      component: DocumentoNew,
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/proyectos/:id/documentos/:docId/editar',
      name: 'documentoEdit',
      component: DocumentoEdit,
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/asbuilt',
      name: 'asbuilt',
      component: () => import('../views/AsBuiltView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

router.beforeEach((to) => {
  if (to.path === '/login' && isLogin()) {
    return '/'
  } else if (to.meta.requiresAuth && !isLogin()) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
})

export default router