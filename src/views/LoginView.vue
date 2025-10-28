<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-center text-gray-900">Iniciar Sesión</h2>
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="form.email" type="email" id="email" required
            class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
          <input v-model="form.password" type="password" id="password" required
            class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
        </div>
        <div v-if="errorMessage" class="text-sm text-red-600">
          {{ errorMessage }}
        </div>
        <div>
          <button type="submit"
            class="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Entrar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const form = ref({
  email: '',
  password: '',
});
const errorMessage = ref('');

const handleLogin = async () => {
  errorMessage.value = '';
  try {
    await authStore.login(form.value);
    router.push({ name: 'tasks' }); // Redirige a las tareas si el login es exitoso
  } catch (error: any) {
    console.log(error);
    if (error.response && error.response.status === 422) {
      errorMessage.value = error.response.data.email || 'Credenciales incorrectas.';
    } else {
      errorMessage.value = 'Ocurrió un error. Por favor, inténtalo de nuevo.';
    }
  }
};
</script>