import { ref } from 'vue'
import { defineStore } from 'pinia'
import apiClient from '@/api/axios'
import { useToast } from 'vue-toastification'
import { TaskService } from '@/services/TaskService';

export interface TaskFilters {
  estado?: string;
  fecha_vencimiento?: string;
}

export interface Priority {
  id: number;
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA';
}

export interface Tag {
  id: number;
  etiqueta: 'DEV' | 'QA' | 'RRHH';
}

type TaskStatus = 'pendiente' | 'en_progreso' | 'completada';

export interface Task {
  id: number;
  titulo: string;
  descripcion: string;
  estado: TaskStatus;
  prioridad: string;
  etiquetas: string[];
}

export interface NewTaskPayload {
  titulo: string;
  descripcion: string;
  priority_id: number;
  tags: number[];
}

export interface UpdateTaskPayload {
  titulo?: string;
  descripcion?: string;
  estado?: 'pendiente' | 'en_progreso' | 'completada';
  priority_id?: number;
  tags?: number[];
}

export const useTaskStore = defineStore('tasks', () => {
  const toast = useToast()

  const tasks = ref<Task[]>([])
  const priorities = ref<Priority[]>([])
  const tags = ref<Tag[]>([])

  const isLoading = ref(false)

  const fetchTasks = async (filters: TaskFilters = {}) => {
    isLoading.value = true;
    try {
      // Limpiamos los filtros para no enviar valores vacíos
      const cleanFilters: Record<string, string> = {};
      if (filters.estado) cleanFilters.estado = filters.estado;
      if (filters.fecha_vencimiento) cleanFilters.fecha_vencimiento = filters.fecha_vencimiento;

      // Axios convierte el objeto 'params' en query parameters (?estado=pendiente)
      tasks.value = await TaskService.getAll(filters);
    } catch (error) {
      toast.error('Error al cargar las tareas');
      console.error('Error fetching tasks:', error);
    } finally {
      isLoading.value = false;
    }
  }

  const updateTask = async (taskId: number, taskData: UpdateTaskPayload) => {
    isLoading.value = true;
    try {
      const updatedTask = await TaskService.update(taskId, taskData);
      // Busca el índice de la tarea actualizada en nuestro array local
      const index = tasks.value.findIndex(t => t.id === taskId);
      if (index !== -1) {
        // Reemplaza la tarea vieja con la nueva versión de la API
        tasks.value[index] = updatedTask;
      }
      toast.success('¡Tarea actualizada con éxito!');
    } catch (error: any) {
      // ... (el manejo de errores es idéntico al de addTask)
      if (error.response && error.response.status === 422) {
        const errors = error.response.data.errors;
        let errorMessage = 'Error de validación:';
        for (const key in errors) {
          errorMessage += `\n- ${errors[key][0]}`;
        }
        toast.error(errorMessage);
      } else {
        toast.error('Error al actualizar la tarea');
      }
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  const updateTaskStatus = async (taskId: number, newStatus: TaskStatus) => {

    const task = tasks.value.find(t => t.id === taskId);
    if (!task) {
      console.error('Tarea no encontrada para actualizar estado.');
      return;
    }
    const originalStatus = task.estado;
    task.estado = newStatus;
    // 1. Encuentra la tarea y guarda su estado original
    try {
      await TaskService.updateStatus(taskId, newStatus);
      toast.success('Estado actualizado');
    } catch (error) {
      // 6. Si falla, revierte el cambio en la UI y notifica al usuario
      task.estado = originalStatus;
      toast.error('No se pudo actualizar el estado');
      console.error('Error updating status:', error);
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
    } catch (error) {
      toast.error('Error al cargar datos para el formulario');
    }
  }

  const addTask = async (taskData: NewTaskPayload) => {
    isLoading.value = true;
    try {
      const newTask = await TaskService.create(taskData);
      tasks.value.unshift(newTask);
      toast.success('¡Tarea creada!');
    } catch (error: any) {
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

  const deleteTask = async (taskId: number) => {
    // Opcional: podrías activar un 'isLoading' específico para esta tarea.
    try {
      // La API devuelve 204 No Content, por lo que no hay datos en la respuesta.
      await TaskService.delete(taskId);
      // Actualiza el estado local eliminando la tarea del array.
      tasks.value = tasks.value.filter(task => task.id !== taskId);

      toast.success('Tarea eliminada con éxito');
    } catch (error) {
      toast.error('Error al eliminar la tarea');
      console.error('Error deleting task:', error);
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
    updateTask,
    deleteTask,
    updateTaskStatus,
  }
})