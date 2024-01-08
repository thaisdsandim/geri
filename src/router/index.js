import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue')
    },
    {
      path: '/vendas/pedidos',
      name: 'pedidos',
      component: () => import('../views/OrdersView.vue')
    },
    {
      path: '/vendas/clientes',
      name: 'clientes',
      component: () => import('../views/ClientsView.vue')
    },
    {
      path: '/vendas/catalogo',
      name: 'catalogo',
      component: () => import('../views/CatalogView.vue')
    }
  ]
})

export default router