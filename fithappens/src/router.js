import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './components/HomePage.vue';
import SecondPage from './components/SecondPage.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/second', component: SecondPage }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;