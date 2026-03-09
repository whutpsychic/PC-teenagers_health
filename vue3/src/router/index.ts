import { createRouter, createWebHistory } from 'vue-router'
import MainView from '../views/MainView.vue'
import HistoryView from '../views/HistoryView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'main', component: MainView },
    { path: '/history', name: 'history', component: HistoryView },
  ],
})

export default router
