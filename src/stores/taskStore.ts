import { ref } from 'vue'
import { defineStore } from 'pinia'
import apiClient from '@/api/axios'
import { useToast } from 'vue-toastification'

export interface Task {
  id: number;
  titulo: string;
  descripcion: string;
  estado: 'pendiente' | 'en_progreso' | 'completada';
  prioridad: string;
  etiquetas: string[];
}

export const useTaskStore = defineStore('tasks', () => {
  const toast = useToast()

  const tasks = ref<Task[]>([])

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


  return {
    tasks,
    isLoading,
    fetchTasks,
  }
})