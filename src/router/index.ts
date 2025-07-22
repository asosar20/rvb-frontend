import { createRouter, createWebHistory } from 'vue-router'
import CasaPagina from '@/views/CasaPagina.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'casa',
      component: CasaPagina,
    },
    {
      path: '/cotizacion',
      name: 'cotizacion',
      // route level code-splitting
      // this generates a separate chunk (Cotizacion.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/CotizacionPagina.vue'),
    },
  ],
})

export default router
