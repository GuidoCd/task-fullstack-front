<template>
  <div>
    <div v-if="taskStore.isLoading" class="text-center text-gray-500">
      Cargando tareas...
    </div>

    <div v-else class="space-y-4">
      <div v-for="task in taskStore.tasks" :key="task.id" class="bg-white p-4 rounded-lg shadow">
        <h3 class="font-bold text-lg">{{ task.titulo }}</h3>
        <p class="text-gray-600">{{ task.descripcion }}</p>
        <div class="mt-2 flex items-center justify-between">
          <span class="px-2 py-1 text-xs font-semibold text-white rounded-full" :class="getStatusColor(task.estado)">
            {{ task.estado }}
          </span>
          <span class="text-sm font-medium text-blue-600">
            {{ task.prioridad }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useTaskStore, type Task } from '@/stores/taskStore'

const taskStore = useTaskStore()

onMounted(() => {
  taskStore.fetchTasks()
})

const getStatusColor = (status: Task['estado']): string => {
  const colors = {
    pendiente: 'bg-yellow-500',
    en_progreso: 'bg-blue-500',
    completada: 'bg-green-500',
  }
  return colors[status] ?? 'bg-gray-500'
}
</script>