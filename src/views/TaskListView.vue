<template>
  <div>
    <div class="mb-6 flex justify-end">
      <button @click="openCreateModal" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
        + Crear Tarea
      </button>
    </div>

    <TaskFormModal :is-visible="isModalVisible" :task-to-edit="taskBeingEdited" @close="closeModal" />
  </div>
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
        <div class="mt-4 flex justify-end">
          <button @click="openEditModal(task)" class="text-sm font-medium text-indigo-600 hover:text-indigo-800">
            Editar
          </button>
          <button @click="handleDelete(task.id)" class="text-sm font-medium text-red-600 hover:text-red-800">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useTaskStore, type Task } from '@/stores/taskStore'
import TaskFormModal from '@/components/TaskFormModal.vue'

const taskStore = useTaskStore()
const isModalVisible = ref(false)
const taskBeingEdited = ref<Task | null>(null);

onMounted(() => {
  taskStore.fetchTasks()
})

const handleDelete = (taskId: number) => {
  // Buena Práctica de UX: Siempre pide confirmación para acciones destructivas.
  if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
    taskStore.deleteTask(taskId);
  }
};

const getStatusColor = (status: Task['estado']): string => {
  const colors = {
    pendiente: 'bg-yellow-500',
    en_progreso: 'bg-blue-500',
    completada: 'bg-green-500',
  }
  return colors[status] ?? 'bg-gray-500'
}

const openCreateModal = () => {
  taskBeingEdited.value = null; // Nos aseguramos de que no hay tarea a editar
  isModalVisible.value = true;
};

const openEditModal = (task: Task) => {
  taskBeingEdited.value = task; // Guardamos la tarea que se va a editar
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
  taskBeingEdited.value = null; // Limpiamos al cerrar
};
</script>