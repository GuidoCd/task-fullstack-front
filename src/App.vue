<template>
  <div class="bg-gray-100 min-h-screen">
    <header class="bg-white shadow-md p-4">
      <h1 class="text-2xl font-bold text-gray-800">Gestor de Tareas</h1>
    </header>
    <main class="p-8">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>