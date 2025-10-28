import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTaskStore } from '../taskStore'
import apiClient from '@/api/axios'


vi.mock('@/api/axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('Task Store', () => {

  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('should have a correct initial state', () => {
    const store = useTaskStore();

    expect(store.tasks).toEqual([]);
    expect(store.isLoading).toBe(false);
    expect(store.priorities).toEqual([]);
    expect(store.tags).toEqual([]);
  });

  it('fetchTasks should fetch tasks and update state correctly', async () => {
    const fakeTasks = [{ id: 1, titulo: 'Test Task', descripcion: '...' }];
    (apiClient.get as any).mockResolvedValue({
      data: {
        data: fakeTasks,
      },
    });

    const store = useTaskStore();

    await store.fetchTasks();

    expect(apiClient.get).toHaveBeenCalledWith('/tasks', { params: {} });
    expect(store.tasks).toEqual(fakeTasks);
    expect(store.isLoading).toBe(false);
  });
});