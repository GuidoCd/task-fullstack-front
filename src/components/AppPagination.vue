<template>
  <div v-if="meta && meta.last_page > 1" class="mt-6 flex justify-between items-center">
    <button @click="$emit('page-change', meta.current_page - 1)" :disabled="isFirstPage"
      class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
      Anterior
    </button>

    <span class="text-sm text-gray-700">
      Página {{ meta.current_page }} de {{ meta.last_page }}
    </span>

    <button @click="$emit('page-change', meta.current_page + 1)" :disabled="isLastPage"
      class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
      Siguiente
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PaginationMeta } from '@/stores/taskStore';

const props = defineProps<{
  meta: PaginationMeta | null;
}>();

defineEmits(['page-change']);

const isFirstPage = computed(() => props.meta?.current_page === 1);
const isLastPage = computed(() => props.meta?.current_page === props.meta?.last_page);
</script>