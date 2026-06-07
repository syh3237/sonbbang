import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFriendStore = defineStore('friend', () => {
  const friends = ref([])
  const incomingRequests = ref([])
  const outgoingRequests = ref([])
  const is_loading = ref(false)

  return {
    friends,
    incomingRequests,
    outgoingRequests,
    is_loading,
  }
})
