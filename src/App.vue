<template>
  <div class="bg-gray-100 min-h-screen">
    <header v-if="authStore.isAuthenticated" class="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-800">Gestor de Tareas</h1>
      <div class="flex items-center space-x-4">
        <span class="text-sm text-gray-600">Hola, {{ authStore.user?.name }}</span>
        <button @click="authStore.logout()"
          class="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600">
          Salir
        </button>
      </div>
    </header>
    <main class="p-8">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useAuthStore } from './stores/authStore';

const authStore = useAuthStore();
</script>