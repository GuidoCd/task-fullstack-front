import { useAuthStore } from '@/stores/authStore';
import TaskListView from '@/views/TaskListView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'tasks',
      component: TaskListView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Intenta obtener al usuario en cada carga de página
  if (!authStore.user) {
    await authStore.fetchUser();
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Si la ruta requiere autenticación y el usuario no está logueado
    next({ name: 'login' });
  } else {
    // Si todo está bien, permite la navegación
    next();
  }
});

export default router
