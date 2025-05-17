import { createRouter, createWebHistory } from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

import AdminLayout from '../components/wrapper/indexAdmin.vue'; 

const routes = [
  { path: '/', redirect: '/login' },

  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/login.vue'),
    meta: { title: 'Đăng nhập'}
  },

  {
    path: '/admin',
    component: AdminLayout,
    children: [
      {
        path: '', 
        name: 'AdminHome',
        component: () => import('../components/admin/home/index.vue'),
        meta: { title: 'GymSite Admin'}
      },
      {
        path: 'quan-li-bai-tap',      // /admin/quan-li-bai-tap
        name: 'QuanLyBaiTap',
        component: () => import('../components/admin/quanLyBaiTap/index.vue'),
        meta: { title: 'Quản lý bài tập'}
      },
      {
        path: 'quan-li-chuong-trinh-tap-luyen',  // /admin/quan-li-chuong-trinh-tap-luyen
        name: 'QuanLyChuongTrinhTap',
        component: () => import('../components/admin/quanLyChuongTrinhTap/index.vue'),
        meta: { title: 'Quản lý chương trình tập'}      
      },
      {
        path: 'quan-li-user',  // /admin/quan-li-user
        name: 'QuanLyUser',
        component: () => import('../components/admin/quanLyUser/index.vue'),
        meta: { title: 'Quản lý người dùng'}      
      },
      {
        path: 'quan-li-bai-dang',  // /admin/quan-li-bai-dang
        name: 'QuanLyBaiDang',
        component: () => import('../components/admin/quanLyBaiDang/index.vue'),
        meta: { title: 'Quản lý bài đăng'}      
      },
    ]
  },

  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Loading bar
router.beforeEach((to, from, next) => {
  NProgress.start();
  next();
});
router.afterEach((to) => {
  NProgress.done();
  document.title = to.meta.title ? to.meta.title: 'Admin';
});

export default router;
