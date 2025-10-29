// src/services/TaskService.ts

import apiClient from '@/api/axios';
import type { Task, NewTaskPayload, UpdateTaskPayload, TaskFilters, PaginatedTasksResponse } from '@/stores/taskStore'; // Reutilizamos las interfaces

// Definimos la estructura de la respuesta de la API
interface ApiResponse<T> {
  data: T;
}

export const TaskService = {
  async getAll(filters: TaskFilters = {}, page: number = 1): Promise<PaginatedTasksResponse> { // <-- Devuelve el objeto completo
    const response = await apiClient.get<PaginatedTasksResponse>('/api/tasks', {
      params: { ...filters, page }
    });
    return response.data; // <-- Devuelve toda la respuesta (data, links, meta)
  },

  async create(taskData: NewTaskPayload): Promise<Task> {
    const response = await apiClient.post<ApiResponse<Task>>('/api/tasks', taskData);
    return response.data.data;
  },

  async update(id: number, taskData: UpdateTaskPayload): Promise<Task> {
    const response = await apiClient.patch<ApiResponse<Task>>(`/api/tasks/${id}`, taskData);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/tasks/${id}`);
  },

  async updateStatus(id: number, estado: string): Promise<void> {
    await apiClient.patch(`/api/tasks/${id}`, { estado });
  }
};