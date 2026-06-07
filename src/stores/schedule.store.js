import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useScheduleStore = defineStore('schedule', () => {
  const items = ref([])
  const selectedId = ref(null)
  const is_loading = ref(false)

  return {
    items,
    selectedId,
    is_loading,
  }
})
