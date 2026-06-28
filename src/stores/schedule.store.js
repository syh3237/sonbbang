import { defineStore } from 'pinia'
import { ref } from 'vue'
import { scheduleService } from '@/services/schedule.service'
import { supabase } from '@/services/supabase/client'
import { useAuthStore } from '@/stores/auth.store'

export const useScheduleStore = defineStore('schedule', () => {
  const items = ref([])
  const selectedId = ref(null)
  const is_loading = ref(false)

  function clear() {
    items.value = []
  }

  async function fetchByMonth(year, month) {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) {
      items.value = []
      return
    }

    const start = new Date(year, month - 1, 1)
    const end = new Date(year, month, 0, 23, 59, 59)

    is_loading.value = true
    try {
      const { data, error } = await scheduleService.fetchByRange({
        start,
        end,
        ownerId: authStore.userId,
      })
      if (error) throw error
      items.value = data ?? []
    } finally {
      is_loading.value = false
    }
  }

  async function create({ title, startDate, endDate, memo }) {
    is_loading.value = true
    const authStore = useAuthStore()

    const payload = {
      title,
      start_at: `${startDate}T00:00:00`,
      end_at: `${endDate}T23:59:59`,
      description: memo || null,
      owner_id: authStore.userId,
    }

    try {
      if (supabase) {
        const { data, error } = await scheduleService.create(payload)
        if (error) throw error
        if (data) items.value.push(data)
      } else {
        items.value.push({
          id: crypto.randomUUID(),
          ...payload,
          created_at: new Date().toISOString(),
        })
      }
    } finally {
      is_loading.value = false
    }
  }

  async function update({ id, title, startDate, endDate, memo }) {
    is_loading.value = true
    const payload = {
      title,
      start_at: `${startDate}T00:00:00`,
      end_at: `${endDate}T23:59:59`,
      description: memo || null,
    }
    try {
      const { data, error } = await scheduleService.update({ id, payload })
      if (error) throw error
      if (data) {
        const idx = items.value.findIndex(i => i.id === id)
        if (idx !== -1) items.value[idx] = data
      }
    } finally {
      is_loading.value = false
    }
  }

  return {
    items,
    selectedId,
    is_loading,
    clear,
    fetchByMonth,
    create,
    update,
  }
})
