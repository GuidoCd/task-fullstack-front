<template>
  <div>
    <div class="mb-6 flex justify-end">
      <button @click="openCreateModal" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
        + Crear Tarea
      </button>
    </div>
    <div class="bg-white p-4 rounded-lg shadow mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label for="filter-estado" class="block text-sm font-medium text-gray-700">Estado</label>
          <select v-model="filters.estado" id="filter-estado"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
            <option value="">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="en_progreso">En Progreso</option>
            <option value="completada">Completada</option>
          </select>
        </div>
        <div>
          <label for="filter-fecha" class="block text-sm font-medium text-gray-700">Fecha de Vencimiento</label>
          <input v-model="filters.fecha_vencimiento" type="date" id="filter-fecha"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
        </div>
        <div class="self-end">
          <button @click="filters.estado = ''; filters.fecha_vencimiento = ''"
            class="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
            Limpiar
          </button>
        </div>
      </div>
    </div>

    <TaskFormModal :is-visible="isModalVisible" :task-to-edit="taskBeingEdited" @close="closeModal" />
  </div>
  <div>
    <div v-if="taskStore.isLoading" class="flex justify-center items-center p-10">
      <div class="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>

    <div v-else class="space-y-4">
      <div v-for="task in taskStore.tasks" :key="task.id" class="bg-white p-4 rounded-lg shadow">
        <h3 class="font-bold text-lg">{{ task.titulo }}</h3>
        <p class="text-gray-600">{{ task.descripcion }}</p>
        <div class="mt-2 flex items-center justify-between">
          <div class="relative" v-click-outside="() => openStatusMenuId = null">
            <button @click.stop="toggleStatusMenu(task.id)"
              class="px-2 py-1 text-xs font-semibold text-white rounded-full cursor-pointer transition-transform transform hover:scale-110"
              :class="getStatusColor(task.estado)">
              {{ task.estado }}
            </button>
            <div v-if="openStatusMenuId === task.id"
              class="absolute bottom-full mb-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <ul>
                <li v-for="status in availableStatuses" :key="status" @click="changeStatus(task.id, status)"
                  class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                  {{ status }}
                </li>
              </ul>
            </div>
          </div>
          <span class="text-sm font-medium text-blue-600">
            {{ task.prioridad }}
          </span>
        </div>
        <div class="mt-4 flex justify-end items-center border-t pt-3 space-x-2">
          <button @click="openEditModal(task)"
            class="px-3 py-1 text-xs font-medium text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Editar
          </button>
          <button @click="handleDelete(task.id)"
            class="px-3 py-1 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useTaskStore, type Task, type TaskFilters } from '@/stores/taskStore'
import TaskFormModal from '@/components/TaskFormModal.vue'

const taskStore = useTaskStore()
const filters = ref<TaskFilters>({
  estado: '',
  fecha_vencimiento: '',
});

const isModalVisible = ref(false)
const taskBeingEdited = ref<Task | null>(null);
const openStatusMenuId = ref<number | null>(null);

watch(filters, () => {
  taskStore.fetchTasks(filters.value);
}, { deep: true });

onMounted(() => {
  taskStore.fetchTasks()
})

const availableStatuses: Task['estado'][] = ['pendiente', 'en_progreso', 'completada'];

const toggleStatusMenu = (taskId: number) => {
  openStatusMenuId.value = openStatusMenuId.value === taskId ? null : taskId;
};

const changeStatus = (taskId: number, newStatus: Task['estado']) => {
  taskStore.updateTaskStatus(taskId, newStatus);
  openStatusMenuId.value = null; // Cierra el menú
};

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