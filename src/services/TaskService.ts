// src/services/TaskService.ts

import apiClient from '@/api/axios';
import type { Task, NewTaskPayload, UpdateTaskPayload, TaskFilters } from '@/stores/taskStore'; // Reutilizamos las interfaces

// Definimos la estructura de la respuesta de la API
interface ApiResponse<T> {
  data: T;
}

export const TaskService = {
  async getAll(filters: TaskFilters = {}): Promise<Task[]> {
    const response = await apiClient.get<ApiResponse<Task[]>>('/tasks', { params: filters });
    return response.data.data;
  },

  async create(taskData: NewTaskPayload): Promise<Task> {
    const response = await apiClient.post<ApiResponse<Task>>('/tasks', taskData);
    return response.data.data;
  },

  async update(id: number, taskData: UpdateTaskPayload): Promise<Task> {
    const response = await apiClient.patch<ApiResponse<Task>>(`/tasks/${id}`, taskData);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/tasks/${id}`);
  },

  async updateStatus(id: number, estado: string): Promise<void> {
    await apiClient.patch(`/tasks/${id}`, { estado });
  }
};