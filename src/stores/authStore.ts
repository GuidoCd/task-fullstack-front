import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import apiClient from '@/api/axios';
import { useRouter } from 'vue-router';

export interface User {
  id: number;
  name: string;
  email: string;
}

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();
  const user = ref<User | null>(null);

  const isAuthenticated = computed(() => !!user.value);

  const fetchUser = async () => {
    try {
      const { data } = await apiClient.get('/api/user');
      user.value = data;
    } catch (error) {
      user.value = null;
    }
  };

  const login = async (credentials: any) => {
    // Sanctum necesita esta llamada para obtener la cookie de seguridad
    await apiClient.get('/sanctum/csrf-cookie');
    await apiClient.post('/api/login', credentials);
    await fetchUser(); // Después de loguear, obtenemos los datos del usuario
  };

  const logout = async () => {
    await apiClient.post('/api/logout');
    user.value = null;
    router.push({ name: 'login' });
  };

  return { user, isAuthenticated, fetchUser, login, logout };
});