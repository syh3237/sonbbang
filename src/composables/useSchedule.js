import { ref, reactive } from 'vue'
import { useCalendarStore } from '@/stores/calendar.store'
import { useScheduleStore } from '@/stores/schedule.store'
import { toDateKey } from '@/utils/date'
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'

const isFormOpen = ref(false)
const editingItem = ref(null) // 편집 중인 일정 (null이면 등록 모드)

const form = reactive({
  title: '',
  startDate: '',
  endDate: '',
  memo: '',
})

const formError = ref('')

export function useSchedule() {
  const calendarStore = useCalendarStore()
  const scheduleStore = useScheduleStore()
  const router = useRouter()
  const authStore = useAuthStore()

  function openForm() {
    if (!authStore.isAuthenticated) {
      alert('로그인 후 이용해 주세요.')
      router.push({ name: 'mypage' })
      return
    }

    const dateKey = calendarStore.selectedDateKey || toDateKey(new Date())
    editingItem.value = null
    form.title = ''
    form.startDate = dateKey
    form.endDate = dateKey
    form.memo = ''
    formError.value = ''
    isFormOpen.value = true
  }

  function openEditForm(schedule) {
    editingItem.value = schedule
    form.title = schedule.title
    form.startDate = schedule.start_at.slice(0, 10)
    form.endDate = schedule.end_at.slice(0, 10)
    form.memo = schedule.description ?? ''
    formError.value = ''
    isFormOpen.value = true
  }

  function closeForm() {
    isFormOpen.value = false
    editingItem.value = null
    formError.value = ''
  }

  async function submitForm() {
    formError.value = ''

    const title = form.title.trim()
    if (!title) {
      formError.value = '일정 이름을 입력해 주세요.'
      return
    }

    if (!form.startDate || !form.endDate) {
      formError.value = '시작일과 종료일을 선택해 주세요.'
      return
    }

    if (form.endDate < form.startDate) {
      formError.value = '종료일은 시작일 이후여야 합니다.'
      return
    }

    try {
      if (editingItem.value) {
        await scheduleStore.update({
          id: editingItem.value.id,
          title,
          startDate: form.startDate,
          endDate: form.endDate,
          memo: form.memo.trim(),
        })
      } else {
        await scheduleStore.create({
          title,
          startDate: form.startDate,
          endDate: form.endDate,
          memo: form.memo.trim(),
        })
      }
      closeForm()
    } catch (err) {
      formError.value = err.message || '일정 저장에 실패했습니다.'
    }
  }

  return {
    isFormOpen,
    editingItem,
    form,
    formError,
    openForm,
    openEditForm,
    closeForm,
    submitForm,
  }
}
