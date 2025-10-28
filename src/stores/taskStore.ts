import { ref } from 'vue'
import { defineStore } from 'pinia'
import apiClient from '@/api/axios'
import { useToast } from 'vue-toastification'

export interface Priority {
  id: number;
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA';
}

export interface Tag {
  id: number;
  etiqueta: 'DEV' | 'QA' | 'RRHH';
}
export interface Task {
  id: number;
  titulo: string;
  descripcion: string;
  estado: 'pendiente' | 'en_progreso' | 'completada';
  prioridad: string;
  etiquetas: string[];
}

export interface NewTaskPayload {
  titulo: string;
  descripcion: string;
  priority_id: number;
  tags: number[];
}

export const useTaskStore = defineStore('tasks', () => {
  const toast = useToast()

  const tasks = ref<Task[]>([])
  const priorities = ref<Priority[]>([])
  const tags = ref<Tag[]>([])

  const isLoading = ref(false)

  const fetchTasks = async () => {
    isLoading.value = true
    try {
      const response = await apiClient.get('/tasks')

      tasks.value = response.data.data
    } catch (error) {
      toast.error('Error al cargar las tareas')
      console.error('Error fetching tasks:', error)
    } finally {

      isLoading.value = false
    }
  }

  const fetchPrioritiesAndTags = async () => {
    try {
      const [priorityResponse, tagResponse] = await Promise.all([
        apiClient.get('/priorities'),
        apiClient.get('/tags')
      ]);
      priorities.value = priorityResponse.data.data;
      tags.value = tagResponse.data.data;
      console.log('Priorities and Tags loaded:', priorities.value, tags.value);
    } catch (error) {
      toast.error('Error al cargar datos para el formulario');
    }
  }

  const addTask = async (taskData: NewTaskPayload) => {
    isLoading.value = true;
    try {
      const response = await apiClient.post('/tasks', taskData);
      // Añade la nueva tarea al principio de la lista para verla inmediatamente
      tasks.value.unshift(response.data.data);
      toast.success('¡Tarea creada con éxito!');
    } catch (error: any) {
      // Manejo de errores de validación de Laravel
      if (error.response && error.response.status === 422) {
        const errors = error.response.data.errors;
        let errorMessage = 'Error de validación:';
        for (const key in errors) {
          errorMessage += `\n- ${errors[key][0]}`;
        }
        toast.error(errorMessage);
      } else {
        toast.error('Error al crear la tarea');
      }
      // Lanza el error para que el componente sepa que falló
      throw error;
    } finally {
      isLoading.value = false;
    }
  }


  return {
    tasks,
    priorities,
    tags,
    isLoading,
    fetchTasks,
    fetchPrioritiesAndTags,
    addTask,
  }
})