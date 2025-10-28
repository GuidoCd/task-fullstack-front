<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
    <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-md z-50">
      <h2 class="text-2xl font-bold mb-4">Crear Nueva Tarea</h2>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label for="titulo" class="block text-sm font-medium text-gray-700">Título</label>
          <input v-model="form.titulo" type="text" id="titulo"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
        </div>

        <div class="mb-4">
          <label for="descripcion" class="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea v-model="form.descripcion" id="descripcion" rows="3"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"></textarea>
        </div>

        <div class="mb-4">
          <label for="priority_id" class="block text-sm font-medium text-gray-700">Prioridad</label>
          <select v-model.number="form.priority_id" id="priority_id"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
            <option disabled value="">Seleccione una prioridad</option>
            <option v-for="priority in taskStore.priorities" :key="priority.id" :value="priority.id">
              {{ priority.prioridad }}
            </option>
          </select>
        </div>

        <div class="mb-6">
          <label for="tags" class="block text-sm font-medium text-gray-700">Etiquetas</label>
          <select multiple v-model="form.tags" id="tags" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
            <option v-for="tag in taskStore.tags" :key="tag.id" :value="tag.id">
              {{ tag.etiqueta }}
            </option>
          </select>
        </div>

        <div class="flex justify-end space-x-4">
          <button type="button" @click="$emit('close')"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
            Cancelar
          </button>
          <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            Crear Tarea
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useTaskStore, type NewTaskPayload } from '@/stores/taskStore';

defineProps<{
  isVisible: boolean;
}>();

const emit = defineEmits(['close']);

const taskStore = useTaskStore();

const form = ref<NewTaskPayload>({
  titulo: '',
  descripcion: '',
  priority_id: 0,
  tags: [],
});

const handleSubmit = async () => {
  try {
    await taskStore.addTask(form.value);
    emit('close'); // Cierra el modal solo si la creación fue exitosa
  } catch (error) {
    console.error("No se pudo crear la tarea");
  }
};

onMounted(() => {
  taskStore.fetchPrioritiesAndTags();
});
</script>