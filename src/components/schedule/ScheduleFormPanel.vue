<script setup>
import { useSchedule } from '@/composables/useSchedule'
import { storeToRefs } from 'pinia'
import { useScheduleStore } from '@/stores/schedule.store'

const { form, formError, editingItem, closeForm, submitForm, deleteSchedule } = useSchedule()
const scheduleStore = useScheduleStore()
const { is_loading } = storeToRefs(scheduleStore)
</script>

<template>
  <section class="schedule_wrap schedule_form_panel" role="dialog" aria-modal="true"
    aria-labelledby="schedule_form_title">
    <header class="schedule_form_header">
      <h1 id="schedule_form_title" class="title_page">{{ editingItem ? '일정 편집' : '일정 등록' }}</h1>
      <button type="button" class="btn_close" aria-label="닫기" @click="closeForm">
        ✕
      </button>
    </header>

    <form class="schedule_form_area" @submit.prevent="submitForm">
      <div class="form_field">
        <label class="form_label" for="schedule_title">일정 이름</label>
        <input id="schedule_title" v-model="form.title" type="text" class="form_input" placeholder="일정 제목을 입력하세요"
          autocomplete="off" />
      </div>

      <div class="schedule_form_date_row">
        <div class="form_field">
          <label class="form_label" for="schedule_start_date">시작일</label>
          <input id="schedule_start_date" v-model="form.startDate" type="date" class="form_input" />
        </div>
        <div class="form_field">
          <label class="form_label" for="schedule_end_date">종료일</label>
          <input id="schedule_end_date" v-model="form.endDate" type="date" class="form_input" :min="form.startDate" />
        </div>
      </div>

      <div class="form_field">
        <label class="form_label" for="schedule_memo">메모</label>
        <textarea id="schedule_memo" v-model="form.memo" class="form_input schedule_form_memo" rows="5"
          placeholder="메모를 입력하세요" />
      </div>

      <p v-if="formError" class="schedule_form_error" role="alert">
        {{ formError }}
      </p>

      <button type="submit" class="btn_save" :class="{ is_disabled: is_loading }" :disabled="is_loading">
        {{ is_loading ? '저장 중…' : '저장' }}
      </button>

      <button
        v-if="editingItem"
        type="button"
        class="btn_delete"
        :class="{ is_disabled: is_loading }"
        :disabled="is_loading"
        @click="deleteSchedule"
      >
        일정 삭제
      </button>
    </form>
  </section>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as *;

.schedule_form_panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: $z_schedule_panel;
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: $color_surface;
  box-shadow: -0.25rem 0 1rem rgba(0, 0, 0, 0.08);
}

.schedule_form_header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $space_md;
  border-bottom: $border_width solid $color_border;
}

.btn_close {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: $btn_icon_min_size;
  min-height: $btn_icon_min_size;
  font-size: $font_size_lg;
  color: $color_text_muted;
}

.schedule_form_area {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: $space_md;
  padding: $space_md;
}

.schedule_form_date_row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $space_sm;
}

.schedule_form_memo {
  min-height: 8rem;
  padding-top: $space_sm;
  padding-bottom: $space_sm;
  resize: vertical;
}

.schedule_form_error {
  font-size: $font_size_sm;
  color: $color_sunday;
}

.btn_delete {
  width: 100%;
  min-height: $btn_min_height;
  border-radius: $radius_sm;
  font-size: $font_size_base;
  font-weight: 600;
  color: $color_sunday;
  border: $border_width solid $color_sunday;

  &.is_disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
