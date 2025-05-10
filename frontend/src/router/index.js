import { createRouter, createWebHistory } from 'vue-router';
import NProgress  from 'nprogress';
import 'nprogress/nprogress.css';
import Main from '../pages/main.vue';
import Home from '../views/homepage.vue';
import Login from '../pages/login.vue';
import Register from '../pages/register.vue';

const routes = [
    {
        path: '/',
        component: Main,
        redirect: 'home',
        children: [
            {
                path: 'home', name: 'Home', component: Home
            },
        ]
    },
    {
        path: '/register', name: 'Register', component: Register
    },
       {
        path: '/login', name: 'Login', component: Login
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
  });

router.beforeEach((to, from, next) => {
  NProgress.start();
  next();
});

router.afterEach(() => {
  NProgress.done();
});
export default router;