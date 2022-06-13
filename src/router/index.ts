import { createRouter, createWebHistory } from 'vue-router';
import { SYSTEM, SERVICE, API, MANAGEMENT, MONITORING, MY } from '@/router/Names';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('@/views/main/MainPage.vue'),
    },
    // {
    //   path: '/login',
    //   name: 'login',
    //   component: () => import('@/views/login/LoginPage.vue'),
    // },
    // {
    //   path: '/signUp',
    //   name: 'signUp',
    //   redirect: '/signUp/stipulation',
    //   component: () => import('@/views/login/sign-up/SignUpPage.vue'),
    //   children: [
    //     {
    //       path: '/signUp/stipulation',
    //       name: 'signUpStipulation',
    //       component: () => import('@/views/login/sign-up/stipulation/SignUpStipulationPage.vue'),
    //     },
    //     {
    //       path: '/signUp/register',
    //       name: 'signUpRegister',
    //       component: () => import('@/views/login/sign-up/register/SignUpRegisterPage.vue'),
    //     },
    //     {
    //       path: '/signUp/complete',
    //       name: 'signUpComplete',
    //       component: () => import('@/views/login/sign-up/complete/SignUpCompletePage.vue'),
    //     },
    //   ],
    // },
    {
      path: '/main',
      name: 'main',
      component: () => import('@/views/main/MainPage.vue'),
      children: [
        {
          path: '/dashboard',
          name: 'dashBoard',
          component: () => import('@/views/main/dash-board/DashBoardPage.vue'),
        },
        // System
        {
          path: SYSTEM,
          name: 'system',
          component: () => import('@/views/main/system-mngt/SystemPage.vue'),
        },
        {
          path: SYSTEM + '/register',
          name: 'system-register',
          component: () => import('@/views/main/system-mngt/register/SystemRegisterPage.vue'),
        },
        {
          path: SYSTEM + '/detail/:id',
          name: 'system-detail',
          component: () => import('@/views/main/system-mngt/detail/SystemDetailPage.vue'),
        },
        {
          path: SYSTEM + '/edit/:id',
          name: 'system-edit',
          component: () => import('@/views/main/system-mngt/edit/SystemEditPage.vue'),
        },
        // Api
        {
          path: API,
          name: 'api',
          component: () => import('@/views/main/api-mngt/ApiPage.vue'),
        },
        {
          path: API + '/register',
          name: 'api-register',
          component: () => import('@/views/main/api-mngt/register/ApiRegisterPage.vue'),
        },
        {
          path: API + '/detail',
          name: 'api-detail',
          component: () => import('@/views/main/api-mngt/detail/ApiDetailPage.vue'),
        },
        {
          path: API + '/edit',
          name: 'api-edit',
          component: () => import('@/views/main/api-mngt/edit/ApiEditPage.vue'),
        },
        // Service
        {
          path: SERVICE,
          name: 'service',
          component: () => import('@/views/main/service-mngt/ServicePage.vue'),
        },
        {
          path: SERVICE + '/register',
          name: 'service-register',
          component: () => import('@/views/main/service-mngt/register/ServiceRegisterPage.vue'),
        },
        {
          path: SERVICE + '/detail/:id',
          name: 'service-detail',
          component: () => import('@/views/main/service-mngt/detail/ServiceDetailPage.vue'),
        },
        {
          path: SERVICE + '/edit/:id',
          name: 'service-edit',
          component: () => import('@/views/main/service-mngt/edit/ServiceEditPage.vue'),
        },
        {
          path: MONITORING + '/control',
          name: 'control',
          component: () => import('@/views/main/monitoring/control/ControlPage.vue'),
        },
        {
          path: MONITORING + '/statistic',
          name: 'statistic',
          component: () => import('@/views/main/monitoring/statistic/StatisticPage.vue'),
        },
        {
          path: MONITORING + '/traffic',
          name: 'traffic',
          component: () => import('@/views/main/monitoring/traffic/TrafficPage.vue'),
        },
        {
          path: MANAGEMENT,
          name: 'management',
          component: () => import('@/views/main/management/ManagementPage.vue'),
        },
        {
          path: MY + '/:id',
          name: 'my',
          component: () => import('@/views/main/my/MyPage.vue'),
        },
      ],
    },
  ],
});

export default router;
