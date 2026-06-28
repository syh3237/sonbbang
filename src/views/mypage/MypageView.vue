<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { profileService } from '@/services/profile.service'

const authStore = useAuthStore()
const router = useRouter()

const user = computed(() => authStore.session?.user)
const isGoogleUser = computed(() => user.value?.app_metadata?.provider === 'google')

// 프로필 데이터
const username = ref('')
const displayName = ref('')
const email = ref('')

// 닉네임 수정
const isEditingNickname = ref(false)
const newDisplayName = ref('')
const nicknameMessage = ref('')
const nicknameError = ref('')

// 비밀번호 변경
const isEditingPassword = ref(false)
const newPassword = ref('')
const confirmPassword = ref('')
const passwordMessage = ref('')
const passwordError = ref('')

onMounted(async () => {
  email.value = user.value?.email ?? ''

  if (isGoogleUser.value) {
    displayName.value = user.value?.user_metadata?.full_name ?? ''
    username.value = ''
  } else {
    const { data } = await profileService.getById(authStore.userId)
    username.value = data?.username ?? ''
    displayName.value = data?.display_name ?? ''
  }
})

function startEditNickname() {
  newDisplayName.value = displayName.value
  nicknameMessage.value = ''
  nicknameError.value = ''
  isEditingNickname.value = true
}

async function saveNickname() {
  nicknameError.value = ''
  nicknameMessage.value = ''
  if (!newDisplayName.value.trim()) {
    nicknameError.value = '닉네임을 입력해 주세요.'
    return
  }
  const { error } = await authStore.updateDisplayName(newDisplayName.value.trim())
  if (error) {
    nicknameError.value = error
  } else {
    displayName.value = newDisplayName.value.trim()
    nicknameMessage.value = '닉네임이 변경됐습니다.'
    isEditingNickname.value = false
  }
}

function startEditPassword() {
  newPassword.value = ''
  confirmPassword.value = ''
  passwordMessage.value = ''
  passwordError.value = ''
  isEditingPassword.value = true
}

async function savePassword() {
  passwordError.value = ''
  passwordMessage.value = ''
  if (newPassword.value.length < 6) {
    passwordError.value = '비밀번호는 6자 이상이어야 합니다.'
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    passwordError.value = '비밀번호가 일치하지 않습니다.'
    return
  }
  const { error } = await authStore.updatePassword(newPassword.value)
  if (error) {
    passwordError.value = error
  } else {
    passwordMessage.value = '비밀번호가 변경됐습니다.'
    isEditingPassword.value = false
  }
}

async function handleSignOut() {
  await authStore.signOut()
  router.push({ name: 'home' })
}
</script>

<template>
  <section class="mypage_wrap">
    <h1 class="title_page">마이페이지</h1>

    <ul class="info_list">
      <!-- 아이디 -->
      <li v-if="!isGoogleUser" class="info_item">
        <span class="info_label">아이디</span>
        <span class="info_value">{{ username }}</span>
      </li>

      <!-- 이메일 -->
      <li class="info_item">
        <span class="info_label">이메일</span>
        <span class="info_value">{{ email }}</span>
      </li>

      <!-- 닉네임 -->
      <li class="info_item">
        <span class="info_label">닉네임</span>
        <div class="info_value_wrap">
          <template v-if="!isEditingNickname">
            <span class="info_value">{{ displayName }}</span>
            <button type="button" class="btn_edit" @click="startEditNickname">수정</button>
          </template>
          <template v-else>
            <div class="edit_form">
              <input
                v-model="newDisplayName"
                class="form_input"
                type="text"
                placeholder="새 닉네임 입력"
                maxlength="20"
              />
              <p v-if="nicknameError" class="field_message is_error">{{ nicknameError }}</p>
              <p v-if="nicknameMessage" class="field_message">{{ nicknameMessage }}</p>
              <div class="edit_actions">
                <button type="button" class="btn_primary btn_save_sm" :disabled="authStore.isLoading" @click="saveNickname">저장</button>
                <button type="button" class="btn btn_cancel" @click="isEditingNickname = false">취소</button>
              </div>
            </div>
          </template>
        </div>
      </li>
    </ul>

    <!-- 비밀번호 변경 (이메일 가입자만) -->
    <div v-if="!isGoogleUser" class="section_block">
      <div class="section_header">
        <h2 class="section_title">비밀번호 변경</h2>
        <button v-if="!isEditingPassword" type="button" class="btn_edit" @click="startEditPassword">변경</button>
      </div>
      <template v-if="isEditingPassword">
        <div class="edit_form">
          <div class="form_field">
            <label class="form_label" for="new_pw">새 비밀번호</label>
            <input id="new_pw" v-model="newPassword" class="form_input" type="password" placeholder="6자 이상" autocomplete="new-password" />
          </div>
          <div class="form_field">
            <label class="form_label" for="confirm_pw">비밀번호 확인</label>
            <input id="confirm_pw" v-model="confirmPassword" class="form_input" type="password" placeholder="비밀번호 재입력" autocomplete="new-password" />
          </div>
          <p v-if="passwordError" class="field_message is_error">{{ passwordError }}</p>
          <p v-if="passwordMessage" class="field_message">{{ passwordMessage }}</p>
          <div class="edit_actions">
            <button type="button" class="btn_primary btn_save_sm" :disabled="authStore.isLoading" @click="savePassword">저장</button>
            <button type="button" class="btn btn_cancel" @click="isEditingPassword = false">취소</button>
          </div>
        </div>
      </template>
    </div>

    <!-- 구글 로그인 안내 -->
    <p v-if="isGoogleUser" class="google_badge">Google 계정으로 로그인됨</p>

    <button type="button" class="btn_logout" @click="handleSignOut">로그아웃</button>
  </section>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as *;

.mypage_wrap {
  display: flex;
  flex-direction: column;
  gap: $space_xl;
  padding: $space_xl $space_md $space_md;
}

.info_list {
  display: flex;
  flex-direction: column;
  border-top: $border_width solid $color_border;
}

.info_item {
  display: flex;
  align-items: flex-start;
  gap: $space_md;
  padding: $space_md 0;
  border-bottom: $border_width solid $color_border;
}

.info_label {
  flex-shrink: 0;
  width: 5rem;
  font-size: $font_size_sm;
  font-weight: 600;
  color: $color_text_muted;
}

.info_value_wrap {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $space_sm;
}

.info_value {
  flex: 1;
  font-size: $font_size_sm;
  color: $color_text;
}

.btn_edit {
  flex-shrink: 0;
  font-size: $font_size_sm;
  font-weight: 600;
  color: $color_primary;
  text-decoration: underline;
}

.edit_form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: $space_sm;
}

.edit_actions {
  display: flex;
  gap: $space_sm;
}

.btn_save_sm {
  padding: 0 $space_md;
  min-height: 2rem;
  font-size: $font_size_sm;
  border-radius: $radius_sm;
}

.btn_cancel {
  padding: 0 $space_md;
  min-height: 2rem;
  font-size: $font_size_sm;
  border: $border_width solid $color_border;
  border-radius: $radius_sm;
}

.field_message {
  font-size: $font_size_sm;
  color: $color_primary;

  &.is_error {
    color: $color_sunday;
  }
}

.section_block {
  display: flex;
  flex-direction: column;
  gap: $space_md;
}

.section_header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section_title {
  font-size: $font_size_base;
  font-weight: 600;
}

.google_badge {
  font-size: $font_size_sm;
  color: $color_text_muted;
}

.btn_logout {
  width: 100%;
  min-height: $btn_min_height;
  border: $border_width solid $color_border;
  border-radius: $radius_sm;
  font-size: $font_size_sm;
  font-weight: 600;
  color: $color_sunday;
  margin-top: auto;
}
</style>
