import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import NProgress  from 'nprogress';
import 'nprogress/nprogress.css';
import Main from '../pages/user/main.vue';

const routes = [
    {
        path: '/',
        component: Main,
        redirect: 'home',
        children: [
          {
            path: 'home', 
            name: 'Home', 
            component: () => import('../pages/user/homepage.vue')
          },
          {
            path: '/articles',
            name: 'Articles',
            component: () => import('../pages/user/article.vue')
          },
          {
            path: '/articles/details.:id',
            name: 'ArticleDetails',
            component: () => import('../pages/user/article-details.vue')
          },
          {
            path: '/exercises',
            name: 'Exercises',
            component: () => import('../pages/user/Exercises.vue')
          },
          {
            path: '/programs',
            name: 'Programs',
            component: () => import('../pages/user/programs.vue')
          },
          {
            path: '/programs/details/:id',
            name: 'ProgramDetail',
            component: () => import('../pages/user/program-details.vue')
          },
          {
            path: '/progress-tracking',
            name: 'ProgressTracking',
            component: () => import('../pages/user/progress-tracking.vue'),
            meta: { requiresAuth: true }
          }
        ]
    },
    {
      path: '/checkout', name: 'Checkout', component: () => import ('../pages/user/checkout.vue')
    },
    {
        path: '/register', name: 'Register', component: () => import ('../pages/entry/register.vue')
    },
    {
        path: '/login', name: 'Login', component: () => import ('../pages/entry/login.vue')
    },
    {
      path: '/password-recovery', name: 'Password-Recovery', component: () => import ('../pages/entry/password-recover.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
  });

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isLoggedIn){
    next({ name: 'Login' });
  }
  else{
    NProgress.start();
    next();
  }
});

router.afterEach(() => {
  NProgress.done();
});
export default router;