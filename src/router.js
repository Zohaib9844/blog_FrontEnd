
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './Home_view.vue';
import ReadView from './ReadView.vue';
import AddEditView from './AddEdit_View.vue';
import LoginView from './LoginView.vue';
import AdminView from './AdminView.vue';
import SignupView from './SignupView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/blog/:id',
    name: 'ReadView',
    component: ReadView,
    props: true,
  },
  {
    path: '/add-blog',
    name: 'AddBlog',
    component: AddEditView,
    meta: { requiresAuth: true }
  },
  {
    path: '/edit-blog/:id',
    name: 'EditBlog',
    component: AddEditView,
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/signup',
    name: 'Signup',
    component: SignupView,
  },
  {
    path: '/admin',
    name: 'AdminView',
    component: AdminView,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Auth guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('authToken'); // Changed from 'isAuthenticated'
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;