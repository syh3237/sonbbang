import { createRouter, createWebHistory } from 'vue-router'
import { setupRouterGuards } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/AppLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/calendar/CalendarView.vue'),
          meta: { title: '홈' },
        },
        {
          path: 'expense',
          name: 'expense',
          component: () => import('@/views/expense/ExpenseView.vue'),
          meta: { title: '가계부' },
        },
        {
          path: 'mypage',
          name: 'mypage',
          component: () => import('@/views/mypage/MypageView.vue'),
          meta: { title: '마이페이지' },
        },
        {
          path: 'friends',
          name: 'friends',
          component: () => import('@/views/friend/FriendView.vue'),
          meta: { title: '친구', requiresAuth: true },
        },
      ],
    },
    {
      path: '/auth',
      component: () => import('@/layouts/AuthLayout.vue'),
      meta: { guestOnly: true },
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/auth/LoginView.vue'),
          meta: { title: '로그인', guestOnly: true },
        },
        {
          path: 'signup',
          name: 'signup',
          component: () => import('@/views/auth/SignupView.vue'),
          meta: { title: '회원가입', guestOnly: true },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: { name: 'home' },
    },
  ],
})

setupRouterGuards(router)

router.afterEach((to) => {
  const title = to.meta.title
  document.title = title ? `${title} | Schedule Share` : 'Schedule Share'
})

export default router
